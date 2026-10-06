import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useTheme } from "../context/ThemeContext";

function AdminDashboard({ onLogout }) {
  const { isDark, toggleTheme } = useTheme();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get("/api/admin/dashboard/stats"),
        api.get("/api/admin/activity/recent?limit=15"),
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data.activity);
    } catch (err) {
      if (err.response?.status === 401) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    onLogout();
  };

  // Theme colors
  const bg = isDark ? "bg-gray-900" : "bg-gray-50";
  const cardBg = isDark ? "bg-gray-800/80 border-gray-700/50" : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-300" : "text-gray-600";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";
  const headerBg = isDark ? "bg-gray-800/90 border-gray-700/50" : "bg-white border-gray-200";
  const rowHover = isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50";
  const tableHeaderBg = isDark ? "bg-gray-700/50" : "bg-gray-50";
  const dividerColor = isDark ? "divide-gray-700/50" : "divide-gray-100";

  // Status & platform colors for both themes
  const statusColors = {
    success: isDark ? "bg-green-500/15 text-green-400" : "bg-green-100 text-green-700",
    failed: isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-700",
    pending: isDark ? "bg-yellow-500/15 text-yellow-400" : "bg-yellow-100 text-yellow-700",
  };

  const platformColors = {
    YouTube: isDark ? "bg-red-500/15 text-red-400" : "bg-red-100 text-red-700",
    Facebook: isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-100 text-blue-700",
    Instagram: isDark ? "bg-pink-500/15 text-pink-400" : "bg-pink-100 text-pink-700",
    X: isDark ? "bg-gray-500/15 text-gray-300" : "bg-gray-100 text-gray-700",
  };

  const statCardColors = {
    purple: isDark ? "bg-purple-500/15" : "bg-purple-100",
    blue: isDark ? "bg-blue-500/15" : "bg-blue-100",
    green: isDark ? "bg-green-500/15" : "bg-green-100",
    red: isDark ? "bg-red-500/15" : "bg-red-100",
  };

  const statIconColors = {
    purple: isDark ? "text-purple-400" : "text-purple-600",
    blue: isDark ? "text-blue-400" : "text-blue-600",
    green: isDark ? "text-green-400" : "text-green-600",
    red: isDark ? "text-red-400" : "text-red-600",
  };

  const barColors = {
    YouTube: isDark ? "bg-red-500" : "bg-red-500",
    Facebook: isDark ? "bg-blue-500" : "bg-blue-500",
    Instagram: isDark ? "bg-pink-500" : "bg-pink-500",
    X: isDark ? "bg-gray-500" : "bg-gray-800",
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${bg} transition-colors`}>
        <div className="text-center">
          <svg className={`w-10 h-10 animate-spin mx-auto mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className={textSecondary}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalPlatformDownloads = stats
    ? stats.platforms.youtube + stats.platforms.facebook + stats.platforms.instagram + stats.platforms.x
    : 0;

  const StatCard = ({ title, value, icon, colorKey }) => (
    <div className={`${cardBg} rounded-2xl border p-5 flex items-center gap-4 transition-colors`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statCardColors[colorKey]}`}>
        <span className={statIconColors[colorKey]}>{icon}</span>
      </div>
      <div>
        <p className={`text-2xl font-bold ${textPrimary}`}>{value}</p>
        <p className={`text-sm ${textMuted}`}>{title}</p>
      </div>
    </div>
  );

  const PlatformBar = ({ name, count }) => {
    const pct = totalPlatformDownloads > 0 ? Math.round((count / totalPlatformDownloads) * 100) : 0;
    return (
      <div className="flex items-center gap-3">
        <span className={`text-sm ${textSecondary} w-24`}>{name}</span>
        <div className={`flex-1 h-3 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full overflow-hidden`}>
          <div className={`h-full rounded-full ${barColors[name]}`} style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-sm font-medium ${textSecondary} w-16 text-right`}>{count} ({pct}%)</span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${bg} transition-colors`}>
      {/* Header */}
      <header className={`${headerBg} border-b px-6 py-4 transition-colors`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className={`text-lg font-bold ${textPrimary}`}>Admin Dashboard</h1>
              <p className={`text-xs ${textMuted}`}>Freebuff Analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className={`px-4 py-2 text-sm ${textSecondary} rounded-xl transition-all ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              View Site
            </a>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleLogout}
              className={`px-4 py-2 text-sm rounded-xl transition-all ${isDark ? 'text-red-400 hover:bg-red-500/10' : 'text-red-600 hover:bg-red-50'}`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Unique Visitors"
            value={stats?.totalVisitors || 0}
            colorKey="purple"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Downloads"
            value={stats?.totalDownloads || 0}
            colorKey="blue"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            }
          />
          <StatCard
            title="Successful"
            value={stats?.successfulDownloads || 0}
            colorKey="green"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Failed"
            value={stats?.failedDownloads || 0}
            colorKey="red"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Time Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={`${cardBg} rounded-2xl border p-5 transition-colors`}>
            <p className={`text-sm ${textMuted} mb-1`}>Downloads Today</p>
            <p className={`text-3xl font-bold ${textPrimary}`}>{stats?.downloadsToday || 0}</p>
          </div>
          <div className={`${cardBg} rounded-2xl border p-5 transition-colors`}>
            <p className={`text-sm ${textMuted} mb-1`}>Downloads This Week</p>
            <p className={`text-3xl font-bold ${textPrimary}`}>{stats?.downloadsThisWeek || 0}</p>
          </div>
        </div>

        {/* Platform Stats */}
        <div className={`${cardBg} rounded-2xl border p-6 mb-8 transition-colors`}>
          <h2 className={`text-lg font-semibold ${textPrimary} mb-5`}>Platform Statistics</h2>
          <div className="space-y-4">
            <PlatformBar name="YouTube" count={stats?.platforms?.youtube || 0} />
            <PlatformBar name="Facebook" count={stats?.platforms?.facebook || 0} />
            <PlatformBar name="Instagram" count={stats?.platforms?.instagram || 0} />
            <PlatformBar name="X" count={stats?.platforms?.x || 0} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`${cardBg} rounded-2xl border overflow-hidden transition-colors`}>
          <div className={`px-6 py-4 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-100'}`}>
            <h2 className={`text-lg font-semibold ${textPrimary}`}>Recent Activity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-left text-xs font-medium ${textMuted} uppercase tracking-wider ${tableHeaderBg}`}>
                  <th className="px-6 py-3">Platform</th>
                  <th className="px-6 py-3">Video Title</th>
                  <th className="px-6 py-3">Quality</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Time</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${dividerColor}`}>
                {activity.length === 0 ? (
                  <tr>
                    <td colSpan="5" className={`px-6 py-12 text-center ${textMuted}`}>
                      No activity yet
                    </td>
                  </tr>
                ) : (
                  activity.map((item) => (
                    <tr key={item._id} className={`${rowHover} transition-colors`}>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${platformColors[item.platform] || (isDark ? 'bg-gray-500/15 text-gray-300' : 'bg-gray-100 text-gray-700')}`}>
                          {item.platform}
                        </span>
                      </td>
                      <td className={`px-6 py-3 text-sm ${textSecondary} max-w-[200px] truncate`}>
                        {item.videoTitle || "Unknown"}
                      </td>
                      <td className={`px-6 py-3 text-sm ${textMuted}`}>{item.quality}</td>
                      <td className="px-6 py-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status] || (isDark ? 'bg-gray-500/15 text-gray-300' : 'bg-gray-100 text-gray-700')}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className={`px-6 py-3 text-sm ${textMuted}`}>
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
