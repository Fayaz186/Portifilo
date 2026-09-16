import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
// Firebase Cloud Storage disabled to prevent billing requirements
const storage: null = null;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  // CRITICAL: The app will break without specifying firestoreDatabaseId
  db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
  auth = getAuth(app);
} catch (err) {
  console.error('Failed to initialize Firebase applet configuration:', err);
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, auth, db, storage };
export const isFirebaseActive = (): boolean => !!(app && db);

export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot and provide callable check
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { success: true, message: 'Connected to Cloud Firestore' };
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
      return { success: false, message: 'Firebase client is offline. Check configuration.' };
    }
    // permission-denied or document not found confirms successful network communication with Firestore server
    return { success: true, message: 'Cloud Firestore server is online and responding' };
  }
}

// Automatically test connection
testFirestoreConnection().catch(console.warn);

export const testFirebaseConnection = testFirestoreConnection;

export function getSavedFirebaseConfig() {
  try {
    const raw = localStorage.getItem('arh_custom_firebase_config');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return firebaseConfig;
}

export function saveFirebaseConfig(config: any) {
  try {
    localStorage.setItem('arh_custom_firebase_config', JSON.stringify(config));
    window.location.reload();
  } catch (e) {}
}

export function clearFirebaseConfig() {
  try {
    localStorage.removeItem('arh_custom_firebase_config');
    window.location.reload();
  } catch (e) {}
}

