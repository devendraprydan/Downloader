/**
 * Detect the platform from a video URL.
 * Returns one of: 'YouTube', 'Facebook', 'Instagram', 'X', or null if unknown.
 */
function detectPlatform(url) {
  if (!url || typeof url !== 'string') return null;

  const lowerUrl = url.toLowerCase().trim();

  // YouTube patterns
  if (
    lowerUrl.includes('youtube.com/watch') ||
    lowerUrl.includes('youtube.com/shorts/') ||
    lowerUrl.includes('youtu.be/') ||
    lowerUrl.includes('youtube.com/embed/') ||
    lowerUrl.includes('youtube.com/v/') ||
    lowerUrl.includes('music.youtube.com/watch')
  ) {
    return 'YouTube';
  }

  // Facebook patterns
  if (
    lowerUrl.includes('facebook.com/watch') ||
    lowerUrl.includes('facebook.com/reel/') ||
    lowerUrl.includes('facebook.com/video/') ||
    lowerUrl.includes('fb.watch/') ||
    lowerUrl.includes('facebook.com/share/v/') ||
    lowerUrl.includes('facebook.com/share/r/')
  ) {
    return 'Facebook';
  }

  // Instagram patterns
  if (
    lowerUrl.includes('instagram.com/reel/') ||
    lowerUrl.includes('instagram.com/reels/') ||
    lowerUrl.includes('instagram.com/p/') ||
    lowerUrl.includes('instagram.com/tv/')
  ) {
    return 'Instagram';
  }

  // X (Twitter) patterns
  if (
    lowerUrl.includes('x.com/') ||
    lowerUrl.includes('twitter.com/') ||
    lowerUrl.includes('t.co/')
  ) {
    return 'X';
  }

  return null;
}

/**
 * Extract YouTube video ID from URL
 */
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/|v\/)|youtu\.be\/|music\.youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

/**
 * Validate that a URL is well-formed
 */
function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

module.exports = { detectPlatform, extractYouTubeId, isValidUrl };
