import {
  ProfileBio,
  ExperienceItem,
  EducationItem,
  SkillCategory,
  ProjectItem,
  ResearchPaper,
  MediaItem,
  AchievementItem,
  ContactMessage,
  PortfolioData
} from '../types';
import {
  initialProfile,
  initialExperiences,
  initialEducation,
  initialSkillCategories,
  initialProjects,
  initialResearchPapers,
  initialMedia,
  initialAchievements,
  initialPortfolioData
} from '../data/initialData';
import {
  db,
  auth,
  isFirebaseActive,
  handleFirestoreError,
  OperationType
} from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import {
  uploadToSupabaseStorage,
  SupabaseStorageCategory,
  STORAGE_FALLBACKS,
  isSupabaseConfigured
} from './supabaseStorage';

const KEYS = {
  PROFILE: 'arh_data_profile',
  EXPERIENCES: 'arh_data_experiences',
  EDUCATION: 'arh_data_education',
  SKILLS: 'arh_data_skills',
  PROJECTS: 'arh_data_projects',
  RESEARCH: 'arh_data_research',
  MEDIA: 'arh_data_media',
  ACHIEVEMENTS: 'arh_data_achievements',
  MESSAGES: 'arh_data_messages'
};

// Event dispatcher for reactive updates across components
const EVENT_NAME = 'arh_data_change';

/**
 * Converts legacy bilingual records from { en, ps } to { en, fa }.
 * It also guarantees a safe Dari fallback, so old Firestore/local records
 * cannot crash RTL views that call map() or slice() on translated values.
 */
function migrateLegacyLanguageData<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => migrateLegacyLanguageData(item)) as T;
  }

  if (value && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    const migrated: Record<string, unknown> = {};

    for (const [key, child] of Object.entries(source)) {
      if (key !== 'ps') migrated[key] = migrateLegacyLanguageData(child);
    }

    if (Object.prototype.hasOwnProperty.call(source, 'en')) {
      const dariValue = source.fa ?? source.ps ?? source.en;
      migrated.fa = migrateLegacyLanguageData(dariValue);
    }

    return migrated as T;
  }

  return value;
}

function notifyChange(key: string) {
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key } }));
}

export function onDataChange(callback: () => void): () => void {
  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

// Local Storage Caching Helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const migrated = migrateLegacyLanguageData(JSON.parse(item) as T);
    localStorage.setItem(key, JSON.stringify(migrated));
    return migrated;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(migrateLegacyLanguageData(value)));
    notifyChange(key);
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// --- PROFILE ---
export async function getProfile(): Promise<ProfileBio> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDoc(doc(db, 'content', 'profile'));
      if (snap.exists()) {
        const data = migrateLegacyLanguageData(snap.data() as ProfileBio);
        if (data.logoUrl === '/logo.svg' || !data.logoUrl) {
          data.logoUrl = '/logo.jpeg';
        }
        if (!data.avatarUrl || data.avatarUrl.includes('unsplash.com')) {
          data.avatarUrl = '/fayaz.jpeg';
        }
        // Ensure updated profile information is applied
        if (data.name?.en?.includes('Abdul Razaq') || !data.name?.en) {
          data.name = initialProfile.name;
        }
        if (data.email?.includes('abdulrazaq') || !data.email) {
          data.email = initialProfile.email;
        }
        if (!data.roles?.en || data.roles.en.length !== 3 || !data.roles.en.includes('Web Designer')) {
          data.roles = initialProfile.roles;
        }
        if (data.shortBio?.en?.includes('Passionate software engineer') || !data.shortBio?.en) {
          data.shortBio = initialProfile.shortBio;
        }
        setLocal(KEYS.PROFILE, data);
        return data;
      }
    } catch (e) {
      console.warn('Firestore getProfile error, falling back to cached:', e);
      handleFirestoreError(e, OperationType.GET, 'content/profile');
    }
  }
  const cached = getLocal<ProfileBio>(KEYS.PROFILE, initialProfile);
  if (cached.logoUrl === '/logo.svg' || !cached.logoUrl) {
    cached.logoUrl = '/logo.jpeg';
  }
  if (!cached.avatarUrl || cached.avatarUrl.includes('unsplash.com')) {
    cached.avatarUrl = '/fayaz.jpeg';
  }
  if (cached.name?.en?.includes('Abdul Razaq') || !cached.name?.en) {
    cached.name = initialProfile.name;
  }
  if (cached.email?.includes('abdulrazaq') || !cached.email) {
    cached.email = initialProfile.email;
  }
  if (!cached.roles?.en || cached.roles.en.length !== 3 || !cached.roles.en.includes('Web Designer')) {
    cached.roles = initialProfile.roles;
  }
  if (cached.shortBio?.en?.includes('Passionate software engineer') || !cached.shortBio?.en) {
    cached.shortBio = initialProfile.shortBio;
  }
  setLocal(KEYS.PROFILE, cached);
  return cached;
}

export async function saveProfile(profile: ProfileBio): Promise<void> {
  setLocal(KEYS.PROFILE, profile);
  if (isFirebaseActive() && db) {
    try {
      await setDoc(doc(db, 'content', 'profile'), profile);
    } catch (e: any) {
      console.warn('Firestore saveProfile write error:', e);
      handleFirestoreError(e, OperationType.WRITE, 'content/profile');
    }
  }
}

// --- EXPERIENCES ---
export async function getExperiences(): Promise<ExperienceItem[]> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDocs(collection(db, 'experiences'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ExperienceItem));
        setLocal(KEYS.EXPERIENCES, items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getExperiences error:', e);
      handleFirestoreError(e, OperationType.LIST, 'experiences');
    }
  }
  return getLocal<ExperienceItem[]>(KEYS.EXPERIENCES, initialExperiences);
}

export async function saveExperiences(items: ExperienceItem[]): Promise<void> {
  setLocal(KEYS.EXPERIENCES, items);
  if (isFirebaseActive() && db) {
    try {
      for (const item of items) {
        await setDoc(doc(db, 'experiences', item.id), item);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'experiences');
    }
  }
}

// --- EDUCATION ---
export async function getEducation(): Promise<EducationItem[]> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDocs(collection(db, 'education'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as EducationItem));
        setLocal(KEYS.EDUCATION, items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getEducation error:', e);
      handleFirestoreError(e, OperationType.LIST, 'education');
    }
  }
  return getLocal<EducationItem[]>(KEYS.EDUCATION, initialEducation);
}

export async function saveEducation(items: EducationItem[]): Promise<void> {
  setLocal(KEYS.EDUCATION, items);
  if (isFirebaseActive() && db) {
    try {
      for (const item of items) {
        await setDoc(doc(db, 'education', item.id), item);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'education');
    }
  }
}

// --- SKILLS ---
export async function getSkillCategories(): Promise<SkillCategory[]> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDocs(collection(db, 'skills'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as SkillCategory));
        setLocal(KEYS.SKILLS, items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getSkillCategories error:', e);
      handleFirestoreError(e, OperationType.LIST, 'skills');
    }
  }
  return getLocal<SkillCategory[]>(KEYS.SKILLS, initialSkillCategories);
}

export async function saveSkillCategories(items: SkillCategory[]): Promise<void> {
  setLocal(KEYS.SKILLS, items);
  if (isFirebaseActive() && db) {
    try {
      for (const item of items) {
        await setDoc(doc(db, 'skills', item.id), item);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'skills');
    }
  }
}

// --- PROJECTS ---
export async function getProjects(): Promise<ProjectItem[]> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDocs(collection(db, 'projects'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectItem));
        setLocal(KEYS.PROJECTS, items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getProjects error:', e);
      handleFirestoreError(e, OperationType.LIST, 'projects');
    }
  }
  return getLocal<ProjectItem[]>(KEYS.PROJECTS, initialProjects);
}

export async function saveProjects(items: ProjectItem[]): Promise<void> {
  setLocal(KEYS.PROJECTS, items);
  if (isFirebaseActive() && db) {
    try {
      for (const item of items) {
        await setDoc(doc(db, 'projects', item.id), item);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'projects');
    }
  }
}

// --- RESEARCH ---
export async function getResearchPapers(): Promise<ResearchPaper[]> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDocs(collection(db, 'research'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ResearchPaper));
        setLocal(KEYS.RESEARCH, items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getResearchPapers error:', e);
      handleFirestoreError(e, OperationType.LIST, 'research');
    }
  }
  return getLocal<ResearchPaper[]>(KEYS.RESEARCH, initialResearchPapers);
}

export async function saveResearchPapers(items: ResearchPaper[]): Promise<void> {
  setLocal(KEYS.RESEARCH, items);
  if (isFirebaseActive() && db) {
    try {
      for (const item of items) {
        await setDoc(doc(db, 'research', item.id), item);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'research');
    }
  }
}

// --- MEDIA ---
export async function getMediaItems(): Promise<MediaItem[]> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDocs(collection(db, 'media'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem));
        setLocal(KEYS.MEDIA, items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getMediaItems error:', e);
      handleFirestoreError(e, OperationType.LIST, 'media');
    }
  }
  return getLocal<MediaItem[]>(KEYS.MEDIA, initialMedia);
}

export async function saveMediaItems(items: MediaItem[]): Promise<void> {
  setLocal(KEYS.MEDIA, items);
  if (isFirebaseActive() && db) {
    try {
      for (const item of items) {
        await setDoc(doc(db, 'media', item.id), item);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'media');
    }
  }
}

// --- ACHIEVEMENTS ---
export async function getAchievements(): Promise<AchievementItem[]> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDocs(collection(db, 'achievements'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as AchievementItem));
        setLocal(KEYS.ACHIEVEMENTS, items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getAchievements error:', e);
      handleFirestoreError(e, OperationType.LIST, 'achievements');
    }
  }
  return getLocal<AchievementItem[]>(KEYS.ACHIEVEMENTS, initialAchievements);
}

export async function saveAchievements(items: AchievementItem[]): Promise<void> {
  setLocal(KEYS.ACHIEVEMENTS, items);
  if (isFirebaseActive() && db) {
    try {
      for (const item of items) {
        await setDoc(doc(db, 'achievements', item.id), item);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'achievements');
    }
  }
}

// --- MESSAGES ---
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (isFirebaseActive() && db) {
    try {
      const snap = await getDocs(collection(db, 'messages'));
      if (!snap.empty) {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
        setLocal(KEYS.MESSAGES, items);
        return items;
      }
    } catch (e) {
      console.warn('Firestore getContactMessages error:', e);
      // If unauthorized (public visitor), fallback to local cache
    }
  }
  return getLocal<ContactMessage[]>(KEYS.MESSAGES, []);
}

export async function saveContactMessage(msg: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    ...msg,
    id: 'msg-' + Date.now(),
    createdAt: new Date().toISOString(),
    read: false
  };

  const messages = getLocal<ContactMessage[]>(KEYS.MESSAGES, []);
  messages.unshift(newMsg);
  setLocal(KEYS.MESSAGES, messages);

  if (isFirebaseActive() && db) {
    try {
      await setDoc(doc(db, 'messages', newMsg.id), newMsg);
    } catch (e) {
      console.warn('Firestore saveContactMessage error:', e);
      handleFirestoreError(e, OperationType.WRITE, `messages/${newMsg.id}`);
    }
  }

  return newMsg;
}

export async function markMessageRead(id: string): Promise<void> {
  const messages = getLocal<ContactMessage[]>(KEYS.MESSAGES, []);
  const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
  setLocal(KEYS.MESSAGES, updated);

  if (isFirebaseActive() && db && auth?.currentUser) {
    try {
      await setDoc(doc(db, 'messages', id), { read: true }, { merge: true });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `messages/${id}`);
    }
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const messages = getLocal<ContactMessage[]>(KEYS.MESSAGES, []);
  const updated = messages.filter(m => m.id !== id);
  setLocal(KEYS.MESSAGES, updated);

  if (isFirebaseActive() && db && auth?.currentUser) {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `messages/${id}`);
    }
  }
}

// --- FILE UPLOAD (SUPABASE STORAGE ONLY, FIREBASE STORAGE DISABLED) ---
function mapFolderToCategory(folder: string): SupabaseStorageCategory {
  const f = folder.toLowerCase();
  if (f.includes('avatar') || f.includes('profile')) return 'profile-photos';
  if (f.includes('project')) return 'project-screenshots';
  if (f.includes('blog') || f.includes('article')) return 'blog-covers';
  if (f.includes('cert')) return 'certificates';
  if (f.includes('research') || f.includes('paper')) return 'research-papers';
  if (f.includes('resume') || f.includes('cv')) return 'resumes';
  return 'profile-photos';
}

export async function uploadPortfolioAsset(
  file: File,
  category: SupabaseStorageCategory
): Promise<{ url: string; isFallback: boolean; message?: string }> {
  const result = await uploadToSupabaseStorage(file, category);
  return {
    url: result.url,
    isFallback: result.isFallback,
    message: result.message
  };
}

export async function uploadFile(file: File, folder: string = 'profile-photos'): Promise<string> {
  const category = mapFolderToCategory(folder);
  const result = await uploadToSupabaseStorage(file, category);
  return result.url;
}

// Seed / Push full dataset to Cloud Firestore
export async function seedAllToFirestore(data: PortfolioData): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseActive() || !db) {
    return { success: false, message: 'Firebase connection is not active.' };
  }

  try {
    // 1. Profile
    await setDoc(doc(db, 'content', 'profile'), data.profile);

    // 2. Experiences
    for (const exp of data.experiences) {
      await setDoc(doc(db, 'experiences', exp.id), exp);
    }

    // 3. Education
    for (const edu of data.education) {
      await setDoc(doc(db, 'education', edu.id), edu);
    }

    // 4. Skills
    for (const sk of data.skills) {
      await setDoc(doc(db, 'skills', sk.id), sk);
    }

    // 5. Projects
    for (const proj of data.projects) {
      await setDoc(doc(db, 'projects', proj.id), proj);
    }

    // 6. Research
    for (const res of data.research) {
      await setDoc(doc(db, 'research', res.id), res);
    }

    // 7. Media
    for (const med of data.media) {
      await setDoc(doc(db, 'media', med.id), med);
    }

    // 8. Achievements
    for (const ach of data.achievements) {
      await setDoc(doc(db, 'achievements', ach.id), ach);
    }

    notifyChange('all');
    return { success: true, message: 'All portfolio records successfully synchronized with Cloud Firestore!' };
  } catch (err: any) {
    console.error('Error seeding data to Firestore:', err);
    handleFirestoreError(err, OperationType.WRITE, 'portfolio_seed');
    return { success: false, message: err?.message || 'Failed to sync records with Firestore.' };
  }
}

// Fetch complete portfolio data asynchronously
export async function getStoredData(): Promise<{ data: PortfolioData; isFromFirestore: boolean; error: string | null }> {
  if (isFirebaseActive() && db) {
    try {
      const [
        profileSnap,
        experiencesSnap,
        educationSnap,
        skillsSnap,
        projectsSnap,
        researchSnap,
        mediaSnap,
        achievementsSnap
      ] = await Promise.all([
        getDoc(doc(db, 'content', 'profile')),
        getDocs(collection(db, 'experiences')),
        getDocs(collection(db, 'education')),
        getDocs(collection(db, 'skills')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'research')),
        getDocs(collection(db, 'media')),
        getDocs(collection(db, 'achievements'))
      ]);

      const hasAnyDocs =
        profileSnap.exists() ||
        !experiencesSnap.empty ||
        !projectsSnap.empty;

      if (hasAnyDocs) {
        const loadedProfile = profileSnap.exists()
          ? migrateLegacyLanguageData(profileSnap.data() as ProfileBio)
          : initialProfile;
        if (loadedProfile.logoUrl === '/logo.svg' || !loadedProfile.logoUrl) {
          loadedProfile.logoUrl = '/logo.jpeg';
        }
        if (!loadedProfile.avatarUrl || loadedProfile.avatarUrl.includes('unsplash.com')) {
          loadedProfile.avatarUrl = '/fayaz.jpeg';
        }

        const loadedData = migrateLegacyLanguageData<PortfolioData>({
          profile: loadedProfile,
          experiences: !experiencesSnap.empty
            ? experiencesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ExperienceItem))
            : initialExperiences,
          education: !educationSnap.empty
            ? educationSnap.docs.map(d => ({ id: d.id, ...d.data() } as EducationItem))
            : initialEducation,
          skills: !skillsSnap.empty
            ? skillsSnap.docs.map(d => ({ id: d.id, ...d.data() } as SkillCategory))
            : initialSkillCategories,
          projects: !projectsSnap.empty
            ? projectsSnap.docs.map(d => ({ id: d.id, ...d.data() } as ProjectItem))
            : initialProjects,
          research: !researchSnap.empty
            ? researchSnap.docs.map(d => ({ id: d.id, ...d.data() } as ResearchPaper))
            : initialResearchPapers,
          media: !mediaSnap.empty
            ? mediaSnap.docs.map(d => ({ id: d.id, ...d.data() } as MediaItem))
            : initialMedia,
          achievements: !achievementsSnap.empty
            ? achievementsSnap.docs.map(d => ({ id: d.id, ...d.data() } as AchievementItem))
            : initialAchievements
        });

        // Cache loaded data locally
        setLocal(KEYS.PROFILE, loadedData.profile);
        setLocal(KEYS.EXPERIENCES, loadedData.experiences);
        setLocal(KEYS.EDUCATION, loadedData.education);
        setLocal(KEYS.SKILLS, loadedData.skills);
        setLocal(KEYS.PROJECTS, loadedData.projects);
        setLocal(KEYS.RESEARCH, loadedData.research);
        setLocal(KEYS.MEDIA, loadedData.media);
        setLocal(KEYS.ACHIEVEMENTS, loadedData.achievements);

        return { data: loadedData, isFromFirestore: true, error: null };
      }
    } catch (err: any) {
      console.warn('Failed to load from Cloud Firestore, falling back to local storage:', err);
      const fallbackProf = getLocal<ProfileBio>(KEYS.PROFILE, initialProfile);
      if (fallbackProf.logoUrl === '/logo.svg' || !fallbackProf.logoUrl) {
        fallbackProf.logoUrl = '/logo.jpeg';
        setLocal(KEYS.PROFILE, fallbackProf);
      }
      if (!fallbackProf.avatarUrl || fallbackProf.avatarUrl.includes('unsplash.com')) {
        fallbackProf.avatarUrl = '/fayaz.jpeg';
        setLocal(KEYS.PROFILE, fallbackProf);
      }

      // Return local data with error notice
      return {
        data: {
          profile: fallbackProf,
          experiences: getLocal<ExperienceItem[]>(KEYS.EXPERIENCES, initialExperiences),
          education: getLocal<EducationItem[]>(KEYS.EDUCATION, initialEducation),
          skills: getLocal<SkillCategory[]>(KEYS.SKILLS, initialSkillCategories),
          projects: getLocal<ProjectItem[]>(KEYS.PROJECTS, initialProjects),
          research: getLocal<ResearchPaper[]>(KEYS.RESEARCH, initialResearchPapers),
          media: getLocal<MediaItem[]>(KEYS.MEDIA, initialMedia),
          achievements: getLocal<AchievementItem[]>(KEYS.ACHIEVEMENTS, initialAchievements)
        },
        isFromFirestore: false,
        error: err?.message || 'Error connecting to Firestore'
      };
    }
  }

  const defaultProf = getLocal<ProfileBio>(KEYS.PROFILE, initialProfile);
  if (defaultProf.logoUrl === '/logo.svg' || !defaultProf.logoUrl) {
    defaultProf.logoUrl = '/logo.jpeg';
    setLocal(KEYS.PROFILE, defaultProf);
  }
  if (!defaultProf.avatarUrl || defaultProf.avatarUrl.includes('unsplash.com')) {
    defaultProf.avatarUrl = '/fayaz.jpeg';
    setLocal(KEYS.PROFILE, defaultProf);
  }

  // If Firestore is active but empty or initial setup:
  return {
    data: {
      profile: defaultProf,
      experiences: getLocal<ExperienceItem[]>(KEYS.EXPERIENCES, initialExperiences),
      education: getLocal<EducationItem[]>(KEYS.EDUCATION, initialEducation),
      skills: getLocal<SkillCategory[]>(KEYS.SKILLS, initialSkillCategories),
      projects: getLocal<ProjectItem[]>(KEYS.PROJECTS, initialProjects),
      research: getLocal<ResearchPaper[]>(KEYS.RESEARCH, initialResearchPapers),
      media: getLocal<MediaItem[]>(KEYS.MEDIA, initialMedia),
      achievements: getLocal<AchievementItem[]>(KEYS.ACHIEVEMENTS, initialAchievements)
    },
    isFromFirestore: false,
    error: null
  };
}

export function resetAllDataToDefaults(): void {
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.EXPERIENCES);
  localStorage.removeItem(KEYS.EDUCATION);
  localStorage.removeItem(KEYS.SKILLS);
  localStorage.removeItem(KEYS.PROJECTS);
  localStorage.removeItem(KEYS.RESEARCH);
  localStorage.removeItem(KEYS.MEDIA);
  localStorage.removeItem(KEYS.ACHIEVEMENTS);
  localStorage.removeItem(KEYS.MESSAGES);
  notifyChange('all');
}
