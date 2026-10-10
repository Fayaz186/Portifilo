const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, mocks) {
  const module = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText;
  vm.runInNewContext(code, {
    module, exports: module.exports, ...mocks.globals,
    require: name => {
      if (name in mocks.modules) return mocks.modules[name];
      throw new Error(`Unexpected dependency: ${name}`);
    },
  });
  return module.exports;
}

function setup() {
  const initial = load('src/data/initialData.ts', { modules: {}, globals: {} });
  const events = new EventTarget();
  const cache = new Map();
  let reads = 0;
  let writes = 0;
  let offline = false;
  const read = async value => {
    reads++;
    if (offline) throw new Error('offline');
    return value;
  };
  const service = load('src/services/storageService.ts', {
    globals: {
      window: events, CustomEvent,
      localStorage: {
        getItem: key => cache.get(key) ?? null,
        setItem: (key, value) => cache.set(key, value),
        removeItem: key => cache.delete(key),
      },
      console: { error() {}, warn() {} },
    },
    modules: {
      '../data/initialData': initial,
      './firebase': {
        db: {}, auth: { currentUser: { uid: 'owner' } },
        isFirebaseActive: () => true,
        handleFirestoreError: error => { throw error; }, OperationType: {},
      },
      'firebase/firestore/lite': {
        doc: () => ({}), collection: () => ({}),
        getDoc: () => read({ exists: () => true, data: () => initial.initialProfile }),
        getDocs: () => read({ empty: true, docs: [] }),
        setDoc: async () => { await Promise.resolve(); writes++; },
        deleteDoc: async () => { await Promise.resolve(); writes++; },
        query: () => ({}), orderBy: () => ({}),
      },
      './supabaseStorage': {},
    },
  });
  return { service, initial, reads: () => reads, writes: () => writes, goOffline: () => { offline = true; } };
}

test('cloud reads cache content without triggering a portfolio reload', async () => {
  const { service } = setup();
  let changes = 0;
  const unsubscribe = service.onDataChange(() => changes++);
  await service.getStoredData();
  await service.getProfile();
  await service.getContactMessages();
  assert.equal(changes, 0);
  unsubscribe();
});

test('saving content triggers one refresh that does not trigger another refresh', async () => {
  const { service, initial, reads, writes } = setup();
  const refreshes = [];
  let changes = 0;
  const unsubscribe = service.onDataChange(() => {
    assert.equal(writes(), 1, 'refresh must wait for the cloud write to complete');
    if (++changes > 1) throw new Error('Recursive portfolio reload');
    refreshes.push(service.getStoredData());
  });
  await service.saveProfile(initial.initialProfile);
  await Promise.all(refreshes);
  assert.equal(changes, 1);
  assert.equal(reads(), 8);
  unsubscribe();
  await service.saveProfile(initial.initialProfile);
  assert.equal(changes, 1);
});

test('offline cache fallback does not announce a content mutation', async () => {
  const { service, goOffline } = setup();
  await service.getStoredData();
  goOffline();
  let changes = 0;
  const unsubscribe = service.onDataChange(() => changes++);
  const result = await service.getStoredData();
  assert.equal(result.isFromFirestore, false);
  assert.equal(changes, 0);
  unsubscribe();
});
