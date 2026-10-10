export function parseVideoEmbedUrl(url: string): {
  embedUrl: string;
  platform: 'youtube' | 'facebook' | 'instagram' | 'vimeo' | 'other';
  thumbnailUrl?: string;
  isEmbeddable: boolean;
} {
  if (!url || typeof url !== 'string') {
    return { embedUrl: '', platform: 'other', isEmbeddable: false };
  }

  const cleanUrl = url.trim();

  // YouTube
  // Formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const ytMatch = cleanUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`,
      platform: 'youtube',
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      isEmbeddable: true
    };
  }

  // Vimeo
  // Format: https://vimeo.com/123456789
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/(?:video\/)?)([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      platform: 'vimeo',
      thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`,
      isEmbeddable: true
    };
  }

  // Facebook Video
  // Format: https://www.facebook.com/.../videos/...
  if (cleanUrl.includes('facebook.com') && (cleanUrl.includes('/videos/') || cleanUrl.includes('/watch/'))) {
    return {
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanUrl)}&show_text=false`,
      platform: 'facebook',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80',
      isEmbeddable: true
    };
  }

  // Instagram Reel / Video Post
  // Format: https://www.instagram.com/p/CODE/ or https://www.instagram.com/reel/CODE/
  const igMatch = cleanUrl.match(/instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/i);
  if (igMatch && igMatch[1]) {
    return {
      embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`,
      platform: 'instagram',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?auto=format&fit=crop&w=800&q=80',
      isEmbeddable: true
    };
  }

  // If already an embed or generic HTTPS video
  return {
    embedUrl: cleanUrl,
    platform: 'other',
    thumbnailUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    isEmbeddable: cleanUrl.startsWith('http')
  };
}
