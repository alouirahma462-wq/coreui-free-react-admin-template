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

  // 🎨 Background (نفسه)
  useEffect(() => {
    document.body.style.background = `
      linear-gradient(rgba(5,15,35,0.45), rgba(30,64,175,0.55)),
      url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80")
    `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }, []);

  // 🔐 قراءة آمنة من localStorage
  const getStoredUser = () => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  };

  // 🔄 تحميل المستخدم أول مرة
  useEffect(() => {
    setUser(getStoredUser());
    setLoading(false);
  }, []);

  // 🔄 تحديث المستخدم عند تغيير الصفحة (مهم جدًا)
  useEffect(() => {
    setUser(getStoredUser());
  }, [location.pathname]);

  if (loading) {
    return <div style={{ color: "white", padding: 20 }}>Loading...</div>;
  }

  // 🧠 ROLE DECISION ENGINE (FIX جذري)
  const getHome = () => {
    const u = getStoredUser();

    if (!u) return "/login";

    if (u.must_change_password === true) {
      return "/change-password";
    }

    // ⚠️ حماية: لو ما في role_key
    if (!u.role_key) return "/login";

    // 🏛 المحكمة
    if (["case_clerk", "prosecutor_group"].includes(u.role_key)) {
      if (!u.court_id) return "/login";
      return `/court/${u.court_id}`;
    }

    // 🔎 التفقدية
    if (u.role_key === "inspection_general" || u.access_level === "global") {
      return "/inspection-dashboard";
    }

    return "/login";
  };

  // 🔐 حماية عامة قوية
  const ProtectedRoute = ({ children, allowRoles }) => {
    const u = getStoredUser();

    if (!u) return <Navigate to="/login" replace />;

    if (u.must_change_password) {
      return <Navigate to="/change-password" replace />;
    }

    if (allowRoles && !allowRoles.includes(u.role_key)) {
      return <Navigate to={getHome()} replace />;
    }

    return children;
  };

  return (
    <Routes>

      {/* AUTH */}
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/change-password"
        element={<ChangePassword setUser={setUser} />}
      />

      {/* COURT */}
      <Route
        path="/court/:id"
        element={
          <ProtectedRoute allowRoles={["case_clerk", "prosecutor_group"]}>
            <CourtDashboard user={user} />
          </ProtectedRoute>
        }
      />

      {/* INSPECTION */}
      <Route
        path="/inspection-dashboard"
        element={
          <ProtectedRoute allowRoles={["inspection_general"]}>
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


























