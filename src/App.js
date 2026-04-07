import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Auth Pages
import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import ForgotPassword from "./views/pages/ForgotPassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

// Dashboards
import CourtDashboard from "./views/dashboard/CourtDashboard";
import ProsecutorDashboard from "./views/dashboard/ProsecutorDashboard";
import InspectionDashboard from "./views/dashboard/InspectionDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🌄 Background
  useEffect(() => {
    document.body.style.background = `
      linear-gradient(rgba(5,15,35,0.45), rgba(30,64,175,0.55)),
      url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80")
    `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
  }, []);

  // 🔐 Sync user from localStorage
  useEffect(() => {
    const syncUser = () => {
      const stored = localStorage.getItem("user");
      setUser(stored ? JSON.parse(stored) : null);
      setLoading(false);
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  if (loading) {
    return (
      <div style={{ color: "white", padding: 20 }}>
        Loading system...
      </div>
    );
  }

  // 🧠 ROLE ROUTING (Final Logic)
  const getHome = () => {
    if (!user) return "/login";

    if (user.must_change_password) {
      return "/change-password";
    }

    const role = user?.role?.role_key ?? user?.role;

    // 🏛 Court system
    if (role === "case_clerk" || role === "prosecutor_group") {
      if (!user.court_id) return "/login";
      return `/court/${user.court_id}`;
    }

    // 🔎 Inspection system
    if (role === "inspection_general") {
      return "/inspection-dashboard";
    }

    return "/login";
  };

  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* ================= COURT DASHBOARD ================= */}
      <Route
        path="/court/:id"
        element={
          user ? (
            <CourtDashboard user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ================= PROSECUTOR DASHBOARD ================= */}
      <Route
        path="/prosecutor-dashboard"
        element={
          user && user.role?.role_key === "prosecutor_group" ? (
            <ProsecutorDashboard user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ================= INSPECTION ================= */}
      <Route
        path="/inspection-dashboard"
        element={
          user && user.role?.role_key === "inspection_general" ? (
            <InspectionDashboard user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ================= ROOT ================= */}
      <Route path="/" element={<Navigate to={getHome()} replace />} />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to={getHome()} replace />} />

    </Routes>
  );
}
























