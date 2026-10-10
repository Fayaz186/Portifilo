import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type SupabaseStorageCategory =
  | 'profile-photos'
  | 'project-screenshots'
  | 'blog-covers'
  | 'certificates'
  | 'research-papers'
  | 'resumes';

export interface SupabaseConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
}

// Fallback high-definition placeholders when Supabase is not configured
export const STORAGE_FALLBACKS: Record<SupabaseStorageCategory, string> = {
  'profile-photos': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
  'project-screenshots': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  'blog-covers': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  'certificates': 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=1200&q=80',
  'research-papers': 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
  'resumes': 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf'
};

const LOCAL_STORAGE_SUPABASE_KEY = 'arh_custom_supabase_config';

/**
 * Retrieve active Supabase configuration from environment variables or localStorage override.
 * Strictly checks that no service-role key is ever accepted or exposed in the frontend.
 */
export function getSupabaseConfig(): SupabaseConfig {
  const metaEnv = (import.meta as any).env || {};
  let envUrl = (metaEnv.VITE_SUPABASE_URL || '').trim();
  let envKey = (metaEnv.VITE_SUPABASE_ANON_KEY || metaEnv.VITE_SUPABASE_PUBLISHABLE_KEY || '').trim();

  // If URL string contains concatenated env definition (e.g. from container setup)
  if (envUrl.includes('https://')) {
    const urlMatch = envUrl.match(/https:\/\/[a-zA-Z0-9.-]+(?:\.supabase\.co)?/);
    if (urlMatch) {
      // Check if publishable key was appended
      const keyMatch = envUrl.match(/sb_publishable_[a-zA-Z0-9_-]+/);
      if (!envKey && keyMatch) {
        envKey = keyMatch[0];
      }
      envUrl = urlMatch[0];
    }
  }

  // Check custom admin override if present
  try {
    const custom = localStorage.getItem(LOCAL_STORAGE_SUPABASE_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.supabaseUrl) envUrl = parsed.supabaseUrl.trim();
      if (parsed.supabaseAnonKey) envKey = parsed.supabaseAnonKey.trim();
    }
  } catch (e) {
    console.warn('Failed to parse custom Supabase config:', e);
  }

  // Security Safeguard: Prevent accidental use of service-role keys in frontend
  if (envKey.includes('service_role') || envKey.startsWith('sb_secret_')) {
    console.error('CRITICAL: Supabase service-role key detected. Never expose service keys in client code.');
    return { supabaseUrl: '', supabaseAnonKey: '' };
  }

  return {
    supabaseUrl: envUrl,
    supabaseAnonKey: envKey
  };
}

export function saveCustomSupabaseConfig(configOrUrl: SupabaseConfig | string, maybeKey?: string): void {
  const config: SupabaseConfig = typeof configOrUrl === 'string'
    ? { supabaseUrl: configOrUrl, supabaseAnonKey: maybeKey || '' }
    : configOrUrl;

  // Security validation before saving
  if (config.supabaseAnonKey.includes('service_role') || config.supabaseAnonKey.startsWith('sb_secret_')) {
    throw new Error('Security violation: Service role keys must never be saved in client-side settings.');
  }

  localStorage.setItem(LOCAL_STORAGE_SUPABASE_KEY, JSON.stringify(config));
  cachedClient = null;
}

export function clearCustomSupabaseConfig(): void {
  localStorage.removeItem(LOCAL_STORAGE_SUPABASE_KEY);
  cachedClient = null;
}

export function isSupabaseConfigured(): boolean {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    cachedClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

export interface UploadResult {
  url: string;
  isFallback: boolean;
  category: SupabaseStorageCategory;
  fileName: string;
  storageProvider: 'supabase' | 'fallback-data-url' | 'fallback-placeholder';
  message?: string;
}

/**
 * Uploads a file specifically to Supabase Storage according to permitted category.
 * If Supabase is not configured, provides a graceful fallback placeholder or local data URL.
 * Strictly blocks raw video files to conserve free storage tier.
 */
export async function uploadToSupabaseStorage(
  file: File,
  category: SupabaseStorageCategory
): Promise<UploadResult> {
  // 1. Guard against large video files
  if (
    file.type.startsWith('video/') ||
    /\.(mp4|mov|avi|wmv|flv|mkv|webm)$/i.test(file.name)
  ) {
    throw new Error(
      'Large video files cannot be uploaded to storage to conserve free storage limits. Please use YouTube, Facebook, Instagram, or Vimeo public embed URLs instead.'
    );
  }

  const client = getSupabaseClient();
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = `${category}/${timestamp}_${sanitizedName}`;

  // 2. If Supabase is active, attempt upload
  if (client && isSupabaseConfigured()) {
    try {
      // We first try bucket named after category or 'portfolio-assets'
      const bucketName = 'portfolio-assets';

      const { data, error } = await client.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        // If 'portfolio-assets' doesn't exist, try direct category bucket
        const { data: catData, error: catError } = await client.storage
          .from(category)
          .upload(`${timestamp}_${sanitizedName}`, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (catError) {
          throw new Error(error.message || catError.message);
        }

        const { data: pubData } = client.storage
          .from(category)
          .getPublicUrl(`${timestamp}_${sanitizedName}`);

        return {
          url: pubData.publicUrl,
          isFallback: false,
          category,
          fileName: file.name,
          storageProvider: 'supabase',
          message: `Successfully uploaded ${file.name} to Supabase bucket: ${category}`
        };
      }

      const { data: pubData } = client.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        url: pubData.publicUrl,
        isFallback: false,
        category,
        fileName: file.name,
        storageProvider: 'supabase',
        message: `Successfully uploaded ${file.name} to Supabase bucket: ${bucketName}/${filePath}`
      };
    } catch (err: any) {
      console.warn('Supabase storage upload error, falling back to data URL preview:', err);
    }
  }

  // 3. Graceful Fallback Mode: Generate client-side Data URL for immediate local preview
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        url: reader.result as string,
        isFallback: true,
        category,
        fileName: file.name,
        storageProvider: 'fallback-data-url',
        message: 'Supabase Storage is not configured yet. Fallback local preview generated.'
      });
    };
    reader.onerror = () => {
      // If file reader fails, return designated category placeholder
      resolve({
        url: STORAGE_FALLBACKS[category],
        isFallback: true,
        category,
        fileName: file.name,
        storageProvider: 'fallback-placeholder',
        message: 'Supabase Storage is not configured. Default placeholder assigned.'
      });
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Parses a public video URL (YouTube, Vimeo, Facebook, Instagram) into an embeddable iframe URL.
 * Conserves free storage by avoiding direct file uploads for videos.
 */
export { parseVideoEmbedUrl } from '../utils/videoEmbed';
