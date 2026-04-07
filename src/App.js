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

  // 🎨 Background (نفسه بدون تغيير)
  useEffect(() => {
    document.body.style.background = `
      linear-gradient(rgba(5,15,35,0.45), rgba(30,64,175,0.55)),
      url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80")
    `;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }, []);

  // 🔐 قراءة user بشكل آمن 100%
  const getUser = () => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored) return null;

      const parsed = JSON.parse(stored);

      // حماية من البيانات الناقصة
      if (!parsed) return null;

      return parsed;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    setUser(getUser());
    setLoading(false);
  }, []);

  // 🔁 إعادة تحديث user عند تغيير الصفحة
  useEffect(() => {
    setUser(getUser());
  }, [location.pathname]);

  if (loading) {
    return <div style={{ color: "white", padding: 20 }}>Loading...</div>;
  }

  // 🧠 تحديد الصفحة الرئيسية (FIX قوي)
  const getHome = () => {
    const u = getUser();

    if (!u) return "/login";

    // 🔴 أهم شرط: تغيير كلمة المرور أولاً
    if (u.must_change_password === true) {
      return "/change-password";
    }

    const roleKey = u.role_key || ""; // FIX: يمنع undefined crash
    const accessLevel = u.access_level || "";

    // 🏛 المحكمة
    if (roleKey === "case_clerk" || roleKey === "prosecutor_group") {
      return `/court/${u.court_id}`;
    }

    // 🔎 التفقدية
    if (roleKey === "inspection_general" || accessLevel === "global") {
      return "/inspection-dashboard";
    }

    // ❌ أي حالة ناقصة
    return "/login";
  };

  // 🔐 حماية الصفحات
  const ProtectedRoute = ({ children }) => {
    const u = getUser();

    if (!u) return <Navigate to="/login" replace />;

    // 🚨 إجبار تغيير كلمة المرور أولاً
    if (u.must_change_password === true) {
      return <Navigate to="/change-password" replace />;
    }

    // 🚨 FIX: منع خطأ "no role"
    if (!u.role_key && !u.access_level) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  return (
    <Routes>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* مهم: نمرر setUser */}
      <Route
        path="/change-password"
        element={<ChangePassword setUser={setUser} />}
      />

      {/* COURT */}
      <Route
        path="/court/:id"
        element={
          <ProtectedRoute>
            <CourtDashboard user={user} />
          </ProtectedRoute>
        }
      />

      {/* INSPECTION */}
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



























