import React from "react";
import { useTheme } from "../context/ThemeContext";

function Footer() {
  const { isDark } = useTheme();

  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-white/50" : "text-gray-500";
  const textMuted = isDark ? "text-white/25" : "text-gray-400";
  const dividerColor = isDark ? "border-white/5" : "border-gray-200";

  return (
    <footer className={`relative z-10 border-t ${dividerColor}`}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </div>
            <span className={`${textPrimary} font-bold text-lg tracking-tight`}>
              Media<span className="text-gradient">Grab</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="/" className={`${textSecondary} text-sm hover:opacity-80 transition-opacity duration-200`}>
              Home
            </a>
            <span className={`${textMuted} text-sm cursor-default`}>Terms</span>
            <span className={`${textMuted} text-sm cursor-default`}>Privacy</span>
            <a href="/admin/login" className={`${textSecondary} text-sm hover:opacity-80 transition-opacity duration-200`}>
              Admin
            </a>
          </div>
        </div>

        <div className={`h-px ${dividerColor} mb-6`} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`${textMuted} text-xs`}>
            &copy; {new Date().getFullYear()} Freebuff Downloader. All rights reserved.
          </p>
          <p className={`${textMuted} text-xs`}>
            Built with care for the community
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
