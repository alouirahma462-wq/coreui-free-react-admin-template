import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

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

  // 🔐 Load user (IMPORTANT FIX)
  const loadUser = () => {
    const stored = localStorage.getItem("user");
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setUser(loadUser());
    setLoading(false);
  }, []);

  // 🔁 إعادة مزامنة user عند تغيير الصفحات (fix مهم جداً)
  useEffect(() => {
    setUser(loadUser());
  }, [location.pathname]);

  if (loading) {
    return <div style={{ color: "white", padding: 20 }}>Loading...</div>;
  }

  // 🧠 HOME LOGIC (FIXED)
  const getHome = () => {
    const currentUser = loadUser();

    if (!currentUser) return "/login";

    // ⚠️ must change password أولاً
    if (currentUser.must_change_password === true) {
      return "/change-password";
    }

    const roleKey = currentUser.role_key;
    const accessLevel = currentUser.access_level;

    if (roleKey === "case_clerk" || roleKey === "prosecutor_group") {
      return `/court/${currentUser.court_id}`;
    }

    if (roleKey === "inspection_general" || accessLevel === "global") {
      return "/inspection-dashboard";
    }

    return "/login";
  };

  // 🔐 Route guard helper
  const ProtectedRoute = ({ children }) => {
    const currentUser = loadUser();

    if (!currentUser) return <Navigate to="/login" replace />;

    if (currentUser.must_change_password) {
      return <Navigate to="/change-password" replace />;
    }

    return children;
  };

  return (
    <Routes>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword setUser={setUser} />} />

      {/* COURT DASHBOARD */}
      <Route
        path="/court/:id"
        element={
          <ProtectedRoute>
            <CourtDashboard user={user} />
          </ProtectedRoute>
        }
      />

      {/* INSPECTION DASHBOARD */}
      <Route
        path="/inspection-dashboard"
        element={
          <ProtectedRoute>
            <InspectionDashboard user={user} />
          </ProtectedRoute>
        }
      />

      {/* ROOT */}
      <Route path="/" element={<Navigate to={getHome()} replace />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to={getHome()} replace />} />

    </Routes>
  );
}


























