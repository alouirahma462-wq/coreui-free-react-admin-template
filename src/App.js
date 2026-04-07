import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// AUTH
import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import ForgotPassword from "./views/pages/ForgotPassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

// DASHBOARDS
import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎨 Background
  useEffect(() => {
    document.body.style.background = `
      linear-gradient(rgba(5,15,35,0.45), rgba(30,64,175,0.55)),
      url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80")
    `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }, []);

  // 🔐 Load user
  useEffect(() => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
    setLoading(false);
  }, []);

  if (loading) {
    return <div style={{ color: "white", padding: 20 }}>Loading...</div>;
  }

  // 🧠 ROLE SYSTEM (صح 100% مع users table)
  const getHome = () => {
    if (!user) return "/login";

    if (user.must_change_password) {
      return "/change-password";
    }

    const roleKey = user.role_key;
    const accessLevel = user.access_level;

    // 🏛 المحكمة
    if (roleKey === "case_clerk" || roleKey === "prosecutor_group") {
      return `/court/${user.court_id}`;
    }

    // 🔎 التفقدية
    if (roleKey === "inspection_general" || accessLevel === "global") {
      return "/inspection-dashboard";
    }

    return "/login";
  };

  return (
    <Routes>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* COURT DASHBOARD */}
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

      {/* INSPECTION DASHBOARD */}
      <Route
        path="/inspection-dashboard"
        element={
          user && user.role_key === "inspection_general" ? (
            <InspectionDashboard user={user} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* ROOT */}
      <Route path="/" element={<Navigate to={getHome()} replace />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to={getHome()} replace />} />

    </Routes>
  );
}

























