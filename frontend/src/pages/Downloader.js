import React, { useState, useCallback, useRef } from "react";
import BounceLoader from "react-spinners/BounceLoader";
import api from "../utils/api";
import { useTheme } from "../context/ThemeContext";

const PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    gradient: "from-red-500 to-red-600",
    glowColor: "rgba(255, 0, 0, 0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    gradient: "from-blue-500 to-blue-600",
    glowColor: "rgba(24, 119, 242, 0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E4405F",
    gradient: "from-pink-500 via-purple-500 to-orange-400",
    glowColor: "rgba(228, 64, 95, 0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    id: "x",
    name: "X (Twitter)",
    color: "#000000",
    gradient: "from-gray-700 to-gray-900",
    glowColor: "rgba(100, 100, 100, 0.3)",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Lightning Fast",
    desc: "Download videos in seconds with optimized servers",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "100% Secure",
    desc: "No data stored, no login required, fully private",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "HD Quality",
    desc: "Choose from multiple resolutions up to 4K",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "All Devices",
    desc: "Works on desktop, tablet, and mobile browsers",
  },
];

const detectPlatform = (url) => {
  if (!url) return null;
  const lower = url.toLowerCase();
  if (lower.includes("youtube.com") || lower.includes("youtu.be") || lower.includes("music.youtube.com")) return "youtube";
  if (lower.includes("facebook.com") || lower.includes("fb.watch")) return "facebook";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("x.com") || lower.includes("twitter.com") || lower.includes("t.co")) return "x";
  return null;
};

function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts = [h, m, s].map((v) => String(v).padStart(2, "0"));
  if (h > 0) return parts.join(":");
  return parts.slice(1).join(":");
}

function Downloader() {
  const { isDark } = useTheme();
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState(null);
  const inputRef = useRef(null);

  const handleUrlChange = useCallback((e) => {
    const val = e.target.value;
    setUrl(val);
    setVideoInfo(null);
    setError("");
    setSuccess("");
    setDetectedPlatform(detectPlatform(val));
  }, []);

  const fetchVideoInfo = useCallback(async () => {
    if (!url.trim()) {
      setError("Please paste a video URL first.");
      return;
    }

    const platform = detectPlatform(url);
    if (!platform) {
      setError("Unsupported URL. Please provide a YouTube, Facebook, Instagram, or X (Twitter) video link.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.get(`/api/video-info?url=${encodeURIComponent(url)}`);
      setVideoInfo(data.videoInfo);
      setSelectedQuality(data.videoInfo.defaultQuality || 720);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch video info. Please check the URL and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleDownload = useCallback(async () => {
    if (!videoInfo) return;

    setDownloading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.get(
        `/api/video-download?url=${encodeURIComponent(url)}&quality=${selectedQuality}`,
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "video/mp4" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const safeTitle = (videoInfo.title || "video").replace(/[<>:"/\\|?*]+/g, "").substring(0, 80);
      link.setAttribute("download", `${safeTitle}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setSuccess("Download started! Check your downloads folder.");
    } catch (err) {
      const msg = err.response?.data?.error || "Download failed. Please try again later.";
      setError(msg);
    } finally {
      setDownloading(false);
    }
  }, [url, videoInfo, selectedQuality]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchVideoInfo();
    }
  };

  const getPlatformInfo = () => {
    if (!detectedPlatform) return null;
    return PLATFORMS.find((p) => p.id === detectedPlatform);
  };

  const platformInfo = getPlatformInfo();

  // Theme-aware text colors
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/70" : "text-gray-600";
  const textMuted = isDark ? "text-white/40" : "text-gray-400";
  const textHint = isDark ? "text-white/25" : "text-gray-400";

  return (
    <div className="bg-mesh noise-overlay grid-pattern min-h-screen relative">
      {/* Background decorative orbs - dark only */}
      {isDark && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="orb w-96 h-96 bg-blue-600 -top-48 -left-48" style={{ animationDelay: "0s" }} />
          <div className="orb w-80 h-80 bg-purple-600 top-1/3 -right-40" style={{ animationDelay: "2s" }} />
          <div className="orb w-64 h-64 bg-pink-500 bottom-20 left-1/4" style={{ animationDelay: "4s" }} />
        </div>
      )}

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-16">
          {/* Badge */}
          <div className="animate-slide-up mb-6">
            <span className="status-badge inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Free &middot; No Sign-up &middot; No Ads
            </span>
          </div>

          {/* Headline */}
          <div className="text-center mb-4 animate-slide-up-delay hero-heading">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight flex gap-2`}>
              <span className={textPrimary}>Download</span>
              <br />
              <span className="text-gradient">Any Video</span>
              <br />
              <span className={`${textMuted} text-4xl sm:text-5xl md:text-6xl lg:text-7xl`}>for Free</span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className={`hero-subtitle ${textSecondary} text-base sm:text-lg max-w-lg text-center mb-10 animate-slide-up-delay-2`}>
            Save videos from YouTube, Facebook, Instagram & X directly to your device.
            <br className="hidden sm:block" />
            High quality, fast, and completely private.
          </p>

          {/* Platform Pills */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-8 animate-slide-up-delay-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  if (detectedPlatform === p.id) {
                    setDetectedPlatform(null);
                    setUrl("");
                    setVideoInfo(null);
                    setError("");
                    setSuccess("");
                    inputRef.current?.focus();
                  }
                }}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  detectedPlatform === p.id
                    ? `bg-gradient-to-r ${p.gradient} text-white shadow-lg scale-105`
                    : `platform-pill`
                }`}
                style={detectedPlatform === p.id ? { boxShadow: `0 4px 20px ${p.glowColor}` } : {}}
              >
                <span className={detectedPlatform === p.id ? "text-white" : ""}>
                  {p.icon}
                </span>
                <span>{p.name}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full max-w-2xl mb-4 animate-scale-in">
            <div className="relative group">
              {/* Glow effect behind input - dark only */}
              {isDark && (
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
              )}

              <div className="relative flex items-center">
                <div className={`absolute left-4 ${isDark ? 'text-white/40 group-focus-within:text-white/70' : 'text-gray-400 group-focus-within:text-blue-500'} transition-colors`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your video link here..."
                  className="w-full pl-12 pr-14 py-4 text-base glass-input rounded-2xl focus:outline-none transition-all duration-300"
                />
                <button
                  onClick={fetchVideoInfo}
                  disabled={loading || !url.trim()}
                  className="absolute right-2 p-3 btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none rounded-xl"
                >
                  {loading ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Supported formats hint */}
          <p className={`${textHint} text-xs mb-8 hint-text`}>
            Supports YouTube, Facebook, Instagram, X (Twitter) &middot; MP4, WebM
          </p>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-2xl mb-4 animate-slide-up">
              <div className="px-5 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="w-full max-w-2xl mb-4 animate-slide-up">
              <div className="px-5 py-4 rounded-2xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-green-300 text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Loading Spinner */}
          {loading && (
            <div className="flex flex-col items-center gap-4 py-8 animate-fade-in">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse-slow" />
                <BounceLoader color={isDark ? "#748ffc" : "#4c6ef5"} size={56} />
              </div>
              <p className={`${textMuted} text-sm font-medium`}>Fetching video information...</p>
            </div>
          )}

          {/* Video Info Card */}
          {!loading && videoInfo && (
            <div className="w-full max-w-3xl animate-scale-in">
              <div className="glass-card rounded-3xl overflow-hidden md:flex">
                {/* Thumbnail - side on desktop, top on mobile */}
                <div className="relative md:w-[45%] md:min-h-[260px] overflow-hidden">
                  {videoInfo.thumbnailUrl ? (
                    <>
                      <img
                        src={videoInfo.thumbnailUrl}
                        alt={videoInfo.title}
                        className="w-full h-56 md:h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10" />
                      {/* Duration badge */}
                      {videoInfo.duration > 0 && (
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
                          {formatDuration(videoInfo.duration)}
                        </div>
                      )}
                      {/* Platform badge */}
                      {platformInfo && (
                        <div className="absolute top-3 left-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${platformInfo.gradient} text-white shadow-lg`}>
                            {platformInfo.icon}
                            {platformInfo.name}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-56 md:h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center">
                      <svg className={`w-16 h-16 ${isDark ? 'text-white/10' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info panel */}
                <div className="md:w-[55%] p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className={`font-bold ${textPrimary} text-lg leading-snug mb-3 line-clamp-2`}>
                      {videoInfo.title}
                    </h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 mb-4">
                      {videoInfo.duration > 0 && (
                        <span className={`flex items-center gap-1.5 ${textMuted} text-sm`}>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {formatDuration(videoInfo.duration)}
                        </span>
                      )}
                      <span className={`flex items-center gap-1.5 ${textMuted} text-sm`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span className="capitalize">{videoInfo.platform || 'Video'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Bottom section: quality + download */}
                  <div>
                    {/* Quality Selector */}
                    {videoInfo.formats && videoInfo.formats.length > 0 && (
                      <div className="mb-4">
                        <label className={`block text-xs font-semibold ${isDark ? 'text-white/50' : 'text-gray-500'} uppercase tracking-wider mb-2`}>
                          Quality
                        </label>
                        <select
                          value={selectedQuality}
                          onChange={(e) => setSelectedQuality(e.target.value)}
                          className="w-full px-4 py-3 glass-input rounded-xl text-sm font-medium focus:outline-none transition-all duration-300 appearance-none cursor-pointer pr-10"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 12px center',
                            backgroundSize: '18px',
                          }}
                        >
                          {videoInfo.formats.map((fmt, i) => (
                            <option key={i} value={fmt.value}>
                              {fmt.quality}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Download Button */}
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className={`w-full py-3.5 rounded-xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide ${
                        downloading
                          ? "bg-gray-400 cursor-not-allowed text-white/60"
                          : "btn-primary"
                      }`}
                    >
                      {downloading ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Now
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          {!videoInfo && !loading && (
            <div className="w-full max-w-4xl mt-8 animate-slide-up-delay-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {FEATURES.map((feature, i) => (
                  <div
                    key={i}
                    className={`feature-card glass-card rounded-2xl p-5 text-center group transition-all duration-300 hover:scale-105`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${isDark ? 'from-blue-500/20 to-purple-500/20 text-blue-300' : 'from-blue-100 to-purple-100 text-blue-600'} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <h3 className={`${textPrimary} font-semibold text-sm mb-1`}>{feature.title}</h3>
                    <p className={`${textMuted} text-xs leading-relaxed`}>{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom spacing for fixed navbar */}
        <div className="h-20" />
      </div>
    </div>
  );
}

export default Downloader;
