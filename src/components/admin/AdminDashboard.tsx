import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
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
  FirebaseClientConfig
} from '../../types';
import {
  saveProfile,
  saveExperiences,
  saveEducation,
  saveSkillCategories,
  saveProjects,
  saveResearchPapers,
  saveMediaItems,
  saveAchievements,
  seedAllToFirestore,
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
  resetAllDataToDefaults,
  uploadFile,
  uploadPortfolioAsset
} from '../../services/storageService';
import {
  isSupabaseConfigured,
  getSupabaseConfig,
  saveCustomSupabaseConfig,
  clearCustomSupabaseConfig,
  parseVideoEmbedUrl,
  SupabaseStorageCategory,
  STORAGE_FALLBACKS
} from '../../services/supabaseStorage';
import {
  isFirebaseActive,
  getSavedFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig
} from '../../services/firebase';
import { BrandLogo } from '../common/BrandLogo';
import {
  LogOut,
  X,
  User,
  Briefcase,
  GraduationCap,
  FolderGit2,
  BookOpen,
  Image,
  Inbox,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  Upload,
  ExternalLink,
  ShieldCheck,
  Cloud,
  Mail,
  Loader2,
  Play,
  Database,
  FileDown
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileBio;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  research: ResearchPaper[];
  media: MediaItem[];
  achievements: AchievementItem[];
  onRefreshData: () => void;
}

type TabType =
  | 'overview'
  | 'profile'
  | 'experiences'
  | 'projects'
  | 'research'
  | 'media'
  | 'messages'
  | 'firebase';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  profile: initialP,
  experiences: initialExp,
  education: initialEdu,
  skills: initialSkills,
  projects: initialProj,
  research: initialRes,
  media: initialMed,
  achievements: initialAch,
  onRefreshData
}) => {
  const { logout, currentUser, isAdmin } = useAuth();
  const { language } = useLanguage();

  const [currentTab, setCurrentTab] = useState<TabType>('overview');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Local editable copies of data
  const [profileForm, setProfileForm] = useState<ProfileBio>(initialP);
  const [expList, setExpList] = useState<ExperienceItem[]>(initialExp);
  const [eduList, setEduList] = useState<EducationItem[]>(initialEdu);
  const [skillList, setSkillList] = useState<SkillCategory[]>(initialSkills);
  const [projList, setProjList] = useState<ProjectItem[]>(initialProj);
  const [resList, setResList] = useState<ResearchPaper[]>(initialRes);
  const [medList, setMedList] = useState<MediaItem[]>(initialMed);
  const [achList, setAchList] = useState<AchievementItem[]>(initialAch);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null);

  // Firebase config state
  const [fbConfig, setFbConfig] = useState<FirebaseClientConfig>(() => {
    return getSavedFirebaseConfig() || {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    };
  });

  // Supabase storage config state & upload status
  const [supabaseSettings, setSupabaseSettings] = useState(() => getSupabaseConfig());
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const handleUploadAsset = async (
    file: File,
    category: SupabaseStorageCategory,
    onSuccess: (url: string) => void
  ) => {
    // 1. Guard against large video files to preserve free storage
    if (file.type.startsWith('video/') || /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(file.name)) {
      alert(
        'Video file uploads are disabled to conserve free storage limits. Please use a YouTube, Facebook, Instagram, or Vimeo public embed URL.'
      );
      return;
    }

    try {
      setIsUploading(true);
      setUploadFeedback(`Uploading ${file.name} (${category})...`);
      const res = await uploadPortfolioAsset(file, category);
      onSuccess(res.url);
      if (res.isFallback) {
        showNotification('Supabase Storage in fallback mode. Fallback preview assigned.');
      } else {
        showNotification(`Uploaded ${file.name} to Supabase Storage!`);
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to upload asset.');
    } finally {
      setIsUploading(false);
      setUploadFeedback(null);
    }
  };

  useEffect(() => {
    setProfileForm(initialP);
    setExpList(initialExp);
    setEduList(initialEdu);
    setSkillList(initialSkills);
    setProjList(initialProj);
    setResList(initialRes);
    setMedList(initialMed);
    setAchList(initialAch);
  }, [initialP, initialExp, initialEdu, initialSkills, initialProj, initialRes, initialMed, initialAch]);

  const handleSyncToFirestore = async () => {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await seedAllToFirestore({
        profile: profileForm,
        experiences: expList,
        education: eduList,
        skills: skillList,
        projects: projList,
        research: resList,
        media: medList,
        achievements: achList
      });
      setSyncResult(res);
      if (res.success) {
        showNotification('Successfully synced all data to Cloud Firestore!');
        onRefreshData();
      }
    } catch (err: any) {
      setSyncResult({ success: false, message: err?.message || 'Failed to sync with Cloud Firestore.' });
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen]);

  const loadMessages = async () => {
    const msgs = await getContactMessages();
    setMessages(msgs);
  };

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setSaveStatus(msg);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  // --- SAVE ACTIONS ---
  const handleSaveProfile = async () => {
    await saveProfile(profileForm);
    onRefreshData();
    showNotification('Profile updated successfully!');
  };

  const handleSaveExperiences = async (updated: ExperienceItem[]) => {
    setExpList(updated);
    await saveExperiences(updated);
    onRefreshData();
    showNotification('Experiences updated successfully!');
  };

  const handleSaveProjects = async (updated: ProjectItem[]) => {
    setProjList(updated);
    await saveProjects(updated);
    onRefreshData();
    showNotification('Projects updated successfully!');
  };

  const handleSaveResearch = async (updated: ResearchPaper[]) => {
    setResList(updated);
    await saveResearchPapers(updated);
    onRefreshData();
    showNotification('Research papers updated successfully!');
  };

  const handleSaveMedia = async (updated: MediaItem[]) => {
    setMedList(updated);
    await saveMediaItems(updated);
    onRefreshData();
    showNotification('Media items updated successfully!');
  };

  const handleDeleteMessage = async (id: string) => {
    await deleteContactMessage(id);
    await loadMessages();
    showNotification('Message deleted');
  };

  const handleMarkRead = async (id: string) => {
    await markMessageRead(id);
    await loadMessages();
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all website data to initial high-quality defaults?')) {
      resetAllDataToDefaults();
      onRefreshData();
      showNotification('All data successfully reset to defaults.');
    }
  };

  const handleSaveFirebaseKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbConfig.apiKey || !fbConfig.projectId) {
      alert('API Key and Project ID are required.');
      return;
    }
    saveFirebaseConfig(fbConfig);
  };

  const unreadMessagesCount = messages.filter(m => !m.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn overflow-hidden">
      <div className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[96vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold">
              AR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  Content Management & Administration
                </h2>
                {isAdmin ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Administrator
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Read-Only Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Logged in as: {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold animate-pulse">
                <Check className="w-3.5 h-3.5" />
                <span>{saveStatus}</span>
              </div>
            )}

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Layout: Sidebar Nav + Main Content Panel */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Nav */}
          <aside className="w-48 sm:w-60 bg-slate-50 border-r border-slate-200 p-3 space-y-1 overflow-y-auto shrink-0">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: ShieldCheck },
              { id: 'profile', label: 'Biography & Info', icon: User },
              { id: 'experiences', label: 'Experiences', icon: Briefcase },
              { id: 'projects', label: 'Projects Showcase', icon: FolderGit2 },
              { id: 'research', label: 'Research Papers', icon: BookOpen },
              { id: 'media', label: 'Media & Certificates', icon: Image },
              {
                id: 'messages',
                label: 'Inquiries Inbox',
                icon: Inbox,
                badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
              },
              { id: 'firebase', label: 'Cloud & Storage', icon: Cloud }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as TabType)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 p-6 overflow-y-auto bg-white">
            {/* 1. OVERVIEW */}
            {currentTab === 'overview' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Welcome, Abdul Razaq Hilal!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage your portfolio content, research publications, media, and prospective inquiries.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
                    <div className="text-2xl font-extrabold text-indigo-700">
                      {projList.length}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">
                      Shipped Projects
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <div className="text-2xl font-extrabold text-emerald-700">
                      {resList.length}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">
                      Research Papers
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                    <div className="text-2xl font-extrabold text-amber-700">
                      {messages.length}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-1">
                      Inquiries Received
                    </div>
                  </div>
                </div>

                {/* Cloud & Local State Info & 1-Click Sync */}
                <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-indigo-600" />
                        <span>Cloud Firestore Live Synchronization</span>
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Connected to Firestore database (project: <span className="font-mono font-bold text-indigo-700">proven-dialect-3f38q</span>).
                      </p>
                    </div>

                    <button
                      onClick={handleSyncToFirestore}
                      disabled={isSyncing}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                    >
                      {isSyncing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Syncing to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Cloud className="w-4 h-4" />
                          <span>Sync All to Cloud Firestore</span>
                        </>
                      )}
                    </button>
                  </div>

                  {syncResult && (
                    <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      syncResult.success
                        ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100/80 text-rose-800 border border-rose-300'
                    }`}>
                      {syncResult.success ? (
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{syncResult.message}</span>
                    </div>
                  )}
                </div>

                {/* Quick reset actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={handleResetDefaults}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Data to Initial Defaults</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. PROFILE & BIO */}
            {currentTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Biography & Profile Editor
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update bilingual personal information, roles, and contacts.
                    </p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Updates</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Full Name (English)
                      </label>
                      <input
                        type="text"
                        value={profileForm.name.en}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          name: { ...profileForm.name, en: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Full Name (Dari)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={profileForm.name.fa}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          name: { ...profileForm.name, fa: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Primary Headline (English)
                      </label>
                      <input
                        type="text"
                        value={profileForm.title.en}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          title: { ...profileForm.title, en: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Primary Headline (Dari)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={profileForm.title.fa}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          title: { ...profileForm.title, fa: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Short Summary Bio (English)
                      </label>
                      <textarea
                        rows={3}
                        value={profileForm.shortBio.en}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          shortBio: { ...profileForm.shortBio, en: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Short Summary Bio (Dari)
                      </label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={profileForm.shortBio.fa}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          shortBio: { ...profileForm.shortBio, fa: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Full Biography (English)
                      </label>
                      <textarea
                        rows={4}
                        value={profileForm.fullBio.en}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          fullBio: { ...profileForm.fullBio, en: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Full Biography (Dari)
                      </label>
                      <textarea
                        rows={4}
                        dir="rtl"
                        value={profileForm.fullBio.fa}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          fullBio: { ...profileForm.fullBio, fa: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm resize-none"
                      />
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Location (EN)
                      </label>
                      <input
                        type="text"
                        value={profileForm.location.en}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          location: { ...profileForm.location, en: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                      />
                    </div>
                  </div>

                  {/* Official Brand Logo */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase text-slate-700">
                        Official Brand Logo / د برانډ رسمي لګو
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                        Brand Identity
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="shrink-0 p-1 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <BrandLogo customLogoUrl={profileForm.logoUrl} size="lg" />
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={profileForm.logoUrl || ''}
                          onChange={(e) => setProfileForm({ ...profileForm, logoUrl: e.target.value })}
                          placeholder="/logo.jpeg or https://..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                        />

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Logo File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadAsset(file, 'profile-photos', (url) => {
                                    setProfileForm({ ...profileForm, logoUrl: url });
                                  });
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, logoUrl: '/logo.jpeg' })}
                            className="text-[11px] text-slate-600 hover:text-slate-900 underline px-2 py-1"
                          >
                            Reset to Default Logo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Avatar URL & Supabase Storage Upload */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase text-slate-700">
                        Portrait Profile Photo / شخصي انځور
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        Supabase Storage: profile-photos
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-200 border-2 border-indigo-200 shrink-0 shadow-sm">
                        <img
                          src={profileForm.avatarUrl || STORAGE_FALLBACKS['profile-photos']}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="text"
                          value={profileForm.avatarUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                          placeholder="https://..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                        />

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-sm transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo to Storage</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadAsset(file, 'profile-photos', (url) => {
                                    setProfileForm({ ...profileForm, avatarUrl: url });
                                  });
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => setProfileForm({ ...profileForm, avatarUrl: STORAGE_FALLBACKS['profile-photos'] })}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline px-2 py-1"
                          >
                            Reset Default Photo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Resume File & Supabase Storage Upload */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase text-slate-700">
                        Curriculum Vitae / Resume File
                      </label>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                        Supabase Storage: resumes
                      </span>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={profileForm.resumeDownloadUrl || ''}
                        onChange={(e) => setProfileForm({ ...profileForm, resumeDownloadUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                      />

                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold cursor-pointer border border-indigo-200 transition-colors">
                          <FileDown className="w-3.5 h-3.5" />
                          <span>Upload Resume PDF to Supabase</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadAsset(file, 'resumes', (url) => {
                                  setProfileForm({ ...profileForm, resumeDownloadUrl: url });
                                });
                              }
                            }}
                          />
                        </label>

                        {profileForm.resumeDownloadUrl && (
                          <a
                            href={profileForm.resumeDownloadUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Preview Current File</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. EXPERIENCES */}
            {currentTab === 'experiences' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Professional Experience Entries ({expList.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage career milestones, roles, companies, and achievements.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newExp: ExperienceItem = {
                        id: 'exp-' + Date.now(),
                        role: { en: 'New Role Title', fa: 'عنوان وظیفه جدید' },
                        company: { en: 'Company / Organization', fa: 'شرکت / اداره' },
                        location: { en: 'Kabul, Afghanistan', fa: 'کابل، افغانستان' },
                        period: { en: '2024 - Present', fa: '۲۰۲۴ - تاکنون' },
                        current: true,
                        description: {
                          en: ['Spearheaded core software development.', 'Collaborated with cross-functional teams.'],
                          fa: ['توسعه و هدایت بخش‌های کلیدی نرم‌افزار.', 'همکاری با تیم‌های مختلف فنی.']
                        },
                        technologies: ['React', 'TypeScript', 'Tailwind CSS']
                      };
                      handleSaveExperiences([newExp, ...expList]);
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {expList.map((exp, idx) => (
                    <div
                      key={exp.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-indigo-700">
                          #{idx + 1} &bull; {exp.role.en} at {exp.company.en}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this experience entry?')) {
                              const updated = expList.filter(e => e.id !== exp.id);
                              handleSaveExperiences(updated);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Role Title (EN)</label>
                          <input
                            type="text"
                            value={exp.role.en}
                            onChange={(e) => {
                              const copy = [...expList];
                              copy[idx].role.en = e.target.value;
                              setExpList(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Company (EN)</label>
                          <input
                            type="text"
                            value={exp.company.en}
                            onChange={(e) => {
                              const copy = [...expList];
                              copy[idx].company.en = e.target.value;
                              setExpList(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleSaveExperiences(expList)}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold"
                        >
                          Update Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. PROJECTS */}
            {currentTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Projects Showcase ({projList.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Edit web, mobile, research, and product applications.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newProj: ProjectItem = {
                        id: 'proj-' + Date.now(),
                        title: { en: 'New Digital Project', fa: 'پروژه دیجیتال جدید' },
                        description: {
                          en: 'An innovative web or mobile application delivering real-world utility.',
                          fa: 'یک نرم‌افزار نوآورانه برای رفع نیازمندی‌های دنیای واقعی.'
                        },
                        category: 'web',
                        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
                        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                        featured: false,
                        completedYear: '2024',
                        highlights: {
                          en: ['Built with modern architectural design patterns.'],
                          fa: ['ساخته شده با معماری و الگوهای طراحی مدرن.']
                        }
                      };
                      handleSaveProjects([newProj, ...projList]);
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projList.map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-slate-900 line-clamp-1">
                            {proj.title.en}
                          </span>
                          <button
                            onClick={() => {
                              if (window.confirm('Delete this project?')) {
                                const updated = projList.filter(p => p.id !== proj.id);
                                handleSaveProjects(updated);
                              }
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Title (EN)</label>
                          <input
                            type="text"
                            value={proj.title.en}
                            onChange={(e) => {
                              const copy = [...projList];
                              copy[idx].title.en = e.target.value;
                              setProjList(copy);
                            }}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] uppercase font-bold text-slate-600">
                              Project Screenshot URL
                            </label>
                            <span className="text-[9px] text-emerald-700 bg-emerald-50 font-semibold px-1.5 py-0.5 rounded">
                              Supabase: project-screenshots
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <img
                              src={proj.imageUrl || STORAGE_FALLBACKS['project-screenshots']}
                              alt="Project thumbnail"
                              className="w-8 h-8 rounded object-cover border border-slate-200 shrink-0"
                            />
                            <input
                              type="text"
                              value={proj.imageUrl}
                              onChange={(e) => {
                                const copy = [...projList];
                                copy[idx].imageUrl = e.target.value;
                                setProjList(copy);
                              }}
                              className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono"
                            />
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded cursor-pointer border border-indigo-200">
                              <Upload className="w-3 h-3" />
                              <span>Upload Screenshot</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleUploadAsset(file, 'project-screenshots', (url) => {
                                      const copy = [...projList];
                                      copy[idx].imageUrl = url;
                                      setProjList(copy);
                                    });
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase font-bold text-slate-500">Category</label>
                          <select
                            value={proj.category}
                            onChange={(e) => {
                              const copy = [...projList];
                              copy[idx].category = e.target.value as any;
                              setProjList(copy);
                            }}
                            className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                          >
                            <option value="web">Web</option>
                            <option value="mobile">Mobile</option>
                            <option value="research">Research</option>
                            <option value="product">Product</option>
                          </select>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleSaveProjects(projList)}
                          className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. RESEARCH PAPERS */}
            {currentTab === 'research' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Research Papers & Publications ({resList.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Manage academic publications, citations, and abstracts.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newPaper: ResearchPaper = {
                        id: 'res-' + Date.now(),
                        title: {
                          en: 'New Research Paper on Machine Learning & Linguistics',
                          fa: 'مقاله پژوهشی جدید در زمینه یادگیری ماشین و زبان‌شناسی'
                        },
                        authors: ['Abdul Razaq Hilal', 'Co-Author Name'],
                        venue: { en: 'Academic Journal of Computer Science', fa: 'مجله علمی علوم کامپیوتر' },
                        year: 2024,
                        abstract: {
                          en: 'A rigorous empirical investigation analyzing model performance on constrained datasets.',
                          fa: 'تحلیل دقیق علمی با استفاده از مدل‌های نوین روی داده‌ها.'
                        },
                        keywords: ['Computer Science', 'Machine Learning', 'NLP'],
                        citationCount: 0
                      };
                      handleSaveResearch([newPaper, ...resList]);
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Research Paper</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {resList.map((paper, idx) => (
                    <div
                      key={paper.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {paper.title.en} ({paper.year})
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this paper?')) {
                              const updated = resList.filter(r => r.id !== paper.id);
                              handleSaveResearch(updated);
                            }
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Title (EN)</label>
                          <input
                            type="text"
                            value={paper.title.en}
                            onChange={(e) => {
                              const copy = [...resList];
                              copy[idx].title.en = e.target.value;
                              setResList(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-600">Venue (EN)</label>
                          <input
                            type="text"
                            value={paper.venue.en}
                            onChange={(e) => {
                              const copy = [...resList];
                              copy[idx].venue.en = e.target.value;
                              setResList(copy);
                            }}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300"
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] font-bold uppercase text-slate-600">
                            Research Paper PDF Document
                          </label>
                          <span className="text-[9px] text-emerald-700 bg-emerald-50 font-semibold px-1.5 py-0.5 rounded">
                            Supabase: research-papers
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={paper.pdfUrl || ''}
                            onChange={(e) => {
                              const copy = [...resList];
                              copy[idx].pdfUrl = e.target.value;
                              setResList(copy);
                            }}
                            placeholder="https://... or upload PDF"
                            className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                          />
                          <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg cursor-pointer border border-indigo-200">
                            <Upload className="w-3 h-3" />
                            <span>Upload PDF</span>
                            <input
                              type="file"
                              accept=".pdf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadAsset(file, 'research-papers', (url) => {
                                    const copy = [...resList];
                                    copy[idx].pdfUrl = url;
                                    setResList(copy);
                                  });
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => handleSaveResearch(resList)}
                          className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MEDIA & CERTIFICATES */}
            {currentTab === 'media' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Media Gallery & Certificates ({medList.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload and manage certificate credentials, event photos, and video links.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const newMed: MediaItem = {
                        id: 'med-' + Date.now(),
                        title: { en: 'New Professional Certificate', fa: 'مدرک یا گواهی جدید' },
                        type: 'certificate',
                        url: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=800&q=80',
                        caption: { en: 'Accreditation milestone.', fa: 'دستاورد و گواهی حرفه‌ای.' },
                        date: new Date().toISOString().slice(0, 10)
                      };
                      handleSaveMedia([newMed, ...medList]);
                    }}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Media</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {medList.map((m, idx) => {
                    const isVideo = m.type === 'video';
                    const videoParsed = isVideo ? parseVideoEmbedUrl(m.url) : null;

                    return (
                      <div
                        key={m.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          {/* Preview Aspect Container */}
                          <div className="aspect-video rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative">
                            {isVideo ? (
                              videoParsed?.isEmbeddable ? (
                                <iframe
                                  src={videoParsed.embedUrl}
                                  title={m.title.en}
                                  className="w-full h-full border-0"
                                />
                              ) : (
                                <div className="p-4 text-center text-slate-300 text-xs">
                                  <Play className="w-8 h-8 text-rose-500 mx-auto mb-1" />
                                  <span>Public Video Embed (YouTube, Facebook, Instagram)</span>
                                </div>
                              )
                            ) : (
                              <img
                                src={m.url || STORAGE_FALLBACKS['certificates']}
                                alt={m.title.en}
                                className="w-full h-full object-cover"
                              />
                            )}

                            <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-950/80 text-white backdrop-blur-xs">
                              {m.type}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-900 line-clamp-1">{m.title.en}</span>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this item?')) {
                                  const updated = medList.filter(item => item.id !== m.id);
                                  handleSaveMedia(updated);
                                }
                              }}
                              className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-500">Title</label>
                              <input
                                type="text"
                                value={m.title.en}
                                onChange={(e) => {
                                  const copy = [...medList];
                                  copy[idx].title.en = e.target.value;
                                  setMedList(copy);
                                }}
                                className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-slate-500">Type</label>
                              <select
                                value={m.type}
                                onChange={(e) => {
                                  const copy = [...medList];
                                  copy[idx].type = e.target.value as any;
                                  setMedList(copy);
                                }}
                                className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-semibold"
                              >
                                <option value="certificate">Certificate</option>
                                <option value="photo">Photo</option>
                                <option value="project">Project</option>
                                <option value="video">Video (Public Embed)</option>
                              </select>
                            </div>
                          </div>

                          {/* Video-Specific Embed Input & Warning */}
                          {isVideo ? (
                            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1.5 text-xs">
                              <div className="font-bold flex items-center gap-1 text-[11px]">
                                <Play className="w-3 h-3 text-amber-700" />
                                <span>No Storage Uploads for Video</span>
                              </div>
                              <p className="text-[10px] leading-normal text-amber-800">
                                To conserve free tier storage, videos are not uploaded to Supabase or Firebase. Paste a public embed link from YouTube, Facebook, Instagram, or Vimeo below:
                              </p>
                              <input
                                type="text"
                                value={m.url}
                                onChange={(e) => {
                                  const copy = [...medList];
                                  copy[idx].url = e.target.value;
                                  setMedList(copy);
                                }}
                                placeholder="https://www.youtube.com/watch?v=... or FB / IG URL"
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-amber-300 bg-white font-mono"
                              />
                            </div>
                          ) : (
                            /* File / Image Upload to Supabase Storage */
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-[10px] uppercase font-bold text-slate-500">
                                  {m.type === 'certificate' ? 'Certificate Credential' : 'Image Asset'}
                                </label>
                                <span className="text-[9px] text-emerald-700 bg-emerald-50 font-semibold px-1.5 py-0.5 rounded">
                                  Supabase: {m.type === 'certificate' ? 'certificates' : 'project-screenshots'}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={m.url}
                                onChange={(e) => {
                                  const copy = [...medList];
                                  copy[idx].url = e.target.value;
                                  setMedList(copy);
                                }}
                                className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono"
                              />
                              <label className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg cursor-pointer border border-indigo-200">
                                <Upload className="w-3 h-3" />
                                <span>Upload to Supabase Storage</span>
                                <input
                                  type="file"
                                  accept={m.type === 'certificate' ? 'image/*,.pdf' : 'image/*'}
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const category: SupabaseStorageCategory = m.type === 'certificate' ? 'certificates' : 'project-screenshots';
                                      handleUploadAsset(file, category, (url) => {
                                        const copy = [...medList];
                                        copy[idx].url = url;
                                        setMedList(copy);
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-200/60">
                          <button
                            onClick={() => handleSaveMedia(medList)}
                            className="px-3 py-1 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer"
                          >
                            Save Item
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8. INCOMING MESSAGES INBOX */}
            {currentTab === 'messages' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Received Inquiries & Messages ({messages.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Inquiries submitted through the portfolio contact form.
                  </p>
                </div>

                {messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No messages received yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          msg.read
                            ? 'bg-slate-50/70 border-slate-200'
                            : 'bg-white border-indigo-300 shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                {msg.senderName}
                              </span>
                              {!msg.read && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-indigo-600 font-medium">
                              {msg.senderEmail} &bull; {new Date(msg.createdAt).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`mailto:${msg.senderEmail}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold flex items-center gap-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Reply</span>
                            </a>

                            {!msg.read && (
                              <button
                                onClick={() => handleMarkRead(msg.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                              >
                                Mark Read
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Delete Message"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3">
                          <div className="font-semibold text-xs text-slate-700">
                            Subject: {msg.subject}
                          </div>
                          <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line bg-white/70 p-3 rounded-xl border border-slate-200/60">
                            {msg.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 9. CLOUD ARCHITECTURE & SUPABASE STORAGE */}
            {currentTab === 'firebase' && (
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h3 className="text-lg font-bold text-slate-900">
                    Cloud Storage & Database Architecture
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configuration for Firebase Authentication, Cloud Firestore, and Supabase Storage.
                  </p>
                </div>

                {/* ARCHITECTURE STATUS SUMMARY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* 1. Firebase Auth */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Firebase Auth</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Secures admin login and credentials.
                    </p>
                  </div>

                  {/* 2. Cloud Firestore */}
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Cloud Firestore</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isFirebaseActive() ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {isFirebaseActive() ? 'Connected' : 'Local + Ready'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Stores website content, metadata & messages.
                    </p>
                  </div>

                  {/* 3. Firebase Storage (Disabled) */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-1 opacity-90">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Firebase Storage</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Disabled (No Billing)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Temporarily disabled to eliminate storage billing.
                    </p>
                  </div>

                  {/* 4. Supabase Storage */}
                  <div className="p-3.5 rounded-2xl bg-white border border-indigo-200 shadow-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-950">Supabase Storage</span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isSupabaseConfigured() ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {isSupabaseConfigured() ? 'Configured' : 'Fallback Active'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Handles the 6 permitted asset categories.
                    </p>
                  </div>
                </div>

                {/* 6 PERMITTED ASSET CATEGORIES EXPLANATION */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        Supabase Storage Asset Categories & Video Policy
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Supabase Storage is strictly reserved for the following 6 categories:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {[
                      { name: 'Profile Photos', path: 'profile-photos' },
                      { name: 'Project Screenshots', path: 'project-screenshots' },
                      { name: 'Blog Cover Images', path: 'blog-covers' },
                      { name: 'Certificates', path: 'certificates' },
                      { name: 'Research PDF Files', path: 'research-papers' },
                      { name: 'Resume Files', path: 'resumes' }
                    ].map((cat, i) => (
                      <div key={i} className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                        <span className="font-semibold text-slate-200">{cat.name}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">bucket/{cat.path}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 text-xs text-amber-300 flex items-start gap-1.5">
                    <Play className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span>
                      <strong>Large Videos:</strong> Never uploaded to Supabase or Firebase. Use public video embed links (YouTube, Facebook, Instagram, Vimeo) to keep storage 100% free.
                    </span>
                  </div>
                </div>

                {/* SUPABASE STORAGE CONFIGURATION */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Supabase Storage Credentials
                      </h4>
                      <p className="text-xs text-slate-500">
                        Configurable via environment variables or runtime browser settings.
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {isSupabaseConfigured() ? 'Live Supabase API Active' : 'Graceful Fallback Mode'}
                    </span>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveCustomSupabaseConfig(supabaseSettings.supabaseUrl, supabaseSettings.supabaseAnonKey);
                      showNotification('Supabase Storage configuration saved!');
                    }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Supabase URL (VITE_SUPABASE_URL)
                      </label>
                      <input
                        type="text"
                        value={supabaseSettings.supabaseUrl}
                        onChange={(e) => setSupabaseSettings({ ...supabaseSettings, supabaseUrl: e.target.value })}
                        placeholder="https://your-project.supabase.co"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Supabase Anon Key (VITE_SUPABASE_ANON_KEY)
                      </label>
                      <input
                        type="password"
                        value={supabaseSettings.supabaseAnonKey}
                        onChange={(e) => setSupabaseSettings({ ...supabaseSettings, supabaseAnonKey: e.target.value })}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                      />
                      <p className="text-[10px] text-slate-500 mt-1">
                        * Only provide the client-safe public `anon` key. Never expose the service-role key.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Save Supabase Settings
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          clearCustomSupabaseConfig();
                          setSupabaseSettings(getSupabaseConfig());
                          showNotification('Custom Supabase settings cleared.');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        Reset to Defaults
                      </button>
                    </div>
                  </form>
                </div>

                {/* FIREBASE CONFIGURATION */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-bold text-slate-900">
                      Firebase Project Credentials
                    </h4>
                    <p className="text-xs text-slate-500">
                      Used for Firebase Authentication and Cloud Firestore content sync.
                    </p>
                  </div>

                  <form onSubmit={handleSaveFirebaseKeys} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                          API Key
                        </label>
                        <input
                          type="text"
                          value={fbConfig.apiKey}
                          onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                          placeholder="AIzaSy..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                          Project ID
                        </label>
                        <input
                          type="text"
                          value={fbConfig.projectId}
                          onChange={(e) => setFbConfig({ ...fbConfig, projectId: e.target.value })}
                          placeholder="abdulrazaq-hilal-portfolio"
                          className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Save Firebase Keys & Reload
                      </button>

                      {getSavedFirebaseConfig() && (
                        <button
                          type="button"
                          onClick={clearFirebaseConfig}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                        >
                          Disconnect Custom Keys
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
