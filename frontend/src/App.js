import React, { useState, useCallback } from "react";
import Downloader from "./pages/Downloader";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));

  const handleLogin = useCallback((token) => {
    setAdminToken(token);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
  }, []);

  const isAdminRoute = window.location.pathname.startsWith("/admin");

  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Downloader />} />
          <Route path="/facebook" element={<Downloader />} />
          <Route path="/instagram" element={<Downloader />} />
          <Route path="/x" element={<Downloader />} />
          <Route path="/instadownloader" element={<Navigate to="/instagram" replace />} />

          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              adminToken ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <AdminLogin onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              adminToken ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            }
          />
        </Routes>

        {/* Show Navbar and Footer only on public routes */}
        {!isAdminRoute && <Navbar />}
        {!isAdminRoute && <Footer />}
      </Router>
    </ThemeProvider>
  );
}

export default App;
