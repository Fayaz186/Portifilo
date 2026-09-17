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
import { testFirebaseConnection } from './services/firebase';
import { initialPortfolioData } from './data/initialData';
import { PortfolioData } from './types';
import {
  Loader2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

const PortfolioContent: React.FC = () => {
  const { language } = useLanguage();
  const { isAdmin } = useAuth();

  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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

  // Admin Portal is ONLY accessible through its direct link/URL (#admin, #/admin, /admin, ?admin)
  const checkAdminRoute = useCallback(() => {
    const hash = window.location.hash.toLowerCase();
    const pathname = window.location.pathname.toLowerCase();
    const search = new URLSearchParams(window.location.search);

    const isDirectAdminUrl =
      hash === '#admin' ||
      hash === '#/admin' ||
      pathname === '/admin' ||
      pathname.endsWith('/admin') ||
      search.has('admin');

    if (isDirectAdminUrl) {
      if (isAdmin) {
        setIsAdminDashboardOpen(true);
        setIsAdminLoginOpen(false);
      } else {
        setIsAdminLoginOpen(true);
      }
    }
  }, [isAdmin]);

  useEffect(() => {
    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);
    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, [checkAdminRoute]);

  const handleCloseAdminModals = () => {
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(false);
    // Reset hash if it was pointing to admin
    if (window.location.hash.toLowerCase() === '#admin' || window.location.hash.toLowerCase() === '#/admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (window.location.pathname.toLowerCase().endsWith('/admin')) {
      window.history.replaceState(null, '', '/');
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
            Fayaz Ahmad Malikzai
          </h2>
          <p className="text-xs text-slate-400">
            {language === 'fa' ? 'در حال بارگذاری پورتفولیو...' : 'Loading portfolio...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      {/* Error State Banner if connection warning exists */}
      {connectionError && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs py-2.5 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Notice:</strong> {connectionError}
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

        {/* 8. Direct Contact & Collaboration Form */}
        <ContactSection
          profile={data.profile}
        />
      </main>

      {/* Footer */}
      <Footer
        profile={data.profile}
        onOpenResume={() => setIsResumeOpen(true)}
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

      {/* Admin Authentication Modal (Only triggered via direct URL) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={handleCloseAdminModals}
        onSuccess={() => {
          setIsAdminLoginOpen(false);
          setIsAdminDashboardOpen(true);
        }}
      />

      {/* Admin Content Management Dashboard (Only triggered via direct URL) */}
      <AdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={handleCloseAdminModals}
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
