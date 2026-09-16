import React, { useState, useEffect, useCallback } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { AboutSection } from './components/home/AboutSection';
import { ExperienceSection } from './components/home/ExperienceSection';
import { SkillsSection } from './components/home/SkillsSection';
import { ProjectsSection } from './components/home/ProjectsSection';
import { ResearchSection } from './components/home/ResearchSection';
import { MediaGallerySection } from './components/home/MediaGallerySection';
import { ContactSection } from './components/home/ContactSection';
import { ResumeModal } from './components/resume/ResumeModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BrandLogo } from './components/common/BrandLogo';
import { getStoredData, onDataChange, uploadPortfolioAsset, saveProfile } from './services/storageService';
import { isFirebaseActive, testFirebaseConnection } from './services/firebase';
import { initialPortfolioData } from './data/initialData';
import { PortfolioData } from './types';
import {
  Loader2,
  ShieldCheck,
  CloudCheck,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Lock
} from 'lucide-react';

const PortfolioContent: React.FC = () => {
  const { language } = useLanguage();
  const { isAdmin, currentUser } = useAuth();

  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFromFirestore, setIsFromFirestore] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Test Firebase connection health
      const health = await testFirebaseConnection();
      if (!health.success) {
        setConnectionError(health.message);
      } else {
        setConnectionError(null);
      }

      const res = await getStoredData();
      setData(res.data);
      setIsFromFirestore(res.isFromFirestore);
      if (res.error) {
        setConnectionError(res.error);
      }
    } catch (err: any) {
      console.error('Error loading portfolio data:', err);
      setConnectionError(err?.message || 'Failed to communicate with Cloud Firestore');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = onDataChange(() => {
      loadData();
    });
    return () => unsubscribe();
  }, [loadData]);

  const handleAdminAction = () => {
    if (isAdmin) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleUpdateLogo = async (file: File) => {
    let logoUrl = '';
    try {
      const res = await uploadPortfolioAsset(file, 'profile-photos');
      if (!res.isFallback && res.url) {
        logoUrl = res.url;
      }
    } catch (err) {
      console.warn('Logo upload to Supabase failed, using local reader fallback:', err);
    }

    if (!logoUrl) {
      logoUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const updatedProfile = { ...data.profile, logoUrl };
    await saveProfile(updatedProfile);
    setData((prev) => ({ ...prev, profile: updatedProfile }));
  };

  // Full Screen Initial Loading State
  if (isLoading && !data.profile.name.en) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 space-y-6">
        <div className="relative flex items-center justify-center">
          <BrandLogo customLogoUrl={data?.profile?.logoUrl} size="lg" />
          <Loader2 className="w-10 h-10 text-indigo-400 animate-spin absolute" />
        </div>
        <div className="text-center space-y-2 max-w-sm">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Abdul Razaq Hilal
          </h2>
          <p className="text-xs text-slate-400">
            Connecting to Cloud Firestore & initializing bilingual portfolio...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      {/* Top Banner: Status & Admin Feedback - Beautifully visible above sticky menu */}
      <div id="top-status-bar" className="bg-slate-900 border-b border-slate-800 text-slate-300 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-white">
              {isFromFirestore
                ? (language === 'fa' ? 'پایگاه داده آنلاین فایربیس (Cloud Firestore)' : 'Cloud Firestore Live')
                : (language === 'fa' ? 'فایربیس آماده به کار' : 'Firebase Ready')}
            </span>
            <span className="text-slate-500 hidden sm:inline">&bull;</span>
            <span className="text-slate-400 hidden sm:inline">
              {language === 'fa' ? 'پروژه:' : 'Project:'} proven-dialect-3f38q
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{language === 'fa' ? 'مدیر سیستم:' : 'Admin:'} {currentUser?.email}</span>
                </span>
                <button
                  onClick={() => setIsAdminDashboardOpen(true)}
                  className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {language === 'fa' ? 'مدیریت محتوا' : 'Manage Content'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'fa' ? 'ورود به پورتال مدیریت' : 'Administrator Sign In'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error State Banner if connection warning exists */}
      {connectionError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Firebase Notice:</strong> {connectionError}
              </span>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdmin={handleAdminAction}
        customLogoUrl={data.profile.logoUrl}
        onUploadLogo={handleUpdateLogo}
      />

      {/* Main Single-Page Portfolio Flow */}
      <main className="flex-grow">
        {/* 1. Hero Showcase */}
        <HeroSection
          profile={data.profile}
          onOpenResume={() => setIsResumeOpen(true)}
          onUpdateProfile={(updated) => setData((prev) => ({ ...prev, profile: updated }))}
        />

        {/* 2. Biography & Achievements */}
        <AboutSection
          profile={data.profile}
          achievements={data.achievements}
        />

        {/* 3. Professional Experience & Education */}
        <ExperienceSection
          experiences={data.experiences}
          education={data.education}
        />

        {/* 4. Categorized Technical Proficiencies */}
        <SkillsSection
          categories={data.skills}
        />

        {/* 5. Shipped Projects Showcase */}
        <ProjectsSection
          projects={data.projects}
        />

        {/* 6. Academic Research & Publications */}
        <ResearchSection
          papers={data.research}
        />

        {/* 7. Media & Certificates */}
        <MediaGallerySection
          media={data.media}
        />

        {/* 9. Direct Contact & Collaboration Form */}
        <ContactSection
          profile={data.profile}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={data.profile}
        onOpenResume={() => setIsResumeOpen(true)}
        onOpenAdmin={handleAdminAction}
      />

      {/* Printable / Downloadable PDF Resume Generator Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        profile={data.profile}
        experiences={data.experiences}
        education={data.education}
        skills={data.skills}
        projects={data.projects}
        research={data.research}
        achievements={data.achievements}
      />

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={() => setIsAdminDashboardOpen(true)}
      />

      {/* Admin Content Management Dashboard */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        profile={data.profile}
        experiences={data.experiences}
        education={data.education}
        skills={data.skills}
        projects={data.projects}
        research={data.research}
        media={data.media}
        achievements={data.achievements}
        onRefreshData={loadData}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <PortfolioContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
