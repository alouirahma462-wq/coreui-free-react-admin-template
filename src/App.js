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

  // 🔐 SAFE USER PARSER
  const getUser = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      return u || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    setUser(getUser());
  }, [location.pathname]);

  // 🧠 SAFE HOME ROUTE
  const getHome = () => {
    const u = getUser();

    if (!u) return "/login";

    // 🔴 FIRST LOGIN RULE (PRIORITY 1)
    if (u.must_change_password === true) {
      return "/change-password";
    }

    // 🔥 SAFE ACCESS CHECK
    const access = u.access_level;

    if (access === "court") {
      return `/court/${u.court_id}`;
    }

    if (access === "global") {
      return "/inspection-dashboard";
    }

    // 🚨 fallback آمن (ما يطيّح النظام)
    return "/change-password";
  };

  // 🔐 PROTECTED ROUTE SAFE
  const ProtectedRoute = ({ children }) => {
    const u = getUser();

    if (!u) return <Navigate to="/login" replace />;

    // 🔴 force first login always
    if (u.must_change_password === true) {
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

      {/* CHANGE PASSWORD (NO PROTECTION) */}
      <Route
        path="/change-password"
        element={<ChangePassword setUser={setUser} />}
      />

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





























