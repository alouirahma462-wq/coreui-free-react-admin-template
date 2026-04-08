import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

// AUTH
import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import ForgotPassword from "./views/pages/ForgotPassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

// DASHBOARDS
import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

export default function App() {
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

  // 🔐 LOAD USER (ONLY SOURCE OF TRUTH)
  const getUser = () => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) return null;

      return { id: userId };
    } catch {
      return null;
    }
  };

  // 🧠 HOME ROUTE FIXED
  const getHome = () => {
    const u = getUser();

    if (!u) return "/login";

    // default safe
    return "/inspection-dashboard";
  };

  // 🔐 PROTECTED ROUTE (NO LOOP)
  const ProtectedRoute = ({ children }) => {
    const u = getUser();

    if (!u) return <Navigate to="/login" replace />;

    return children;
  };

  return (
    <Routes>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* CHANGE PASSWORD (FREE ACCESS) */}
      <Route path="/change-password" element={<ChangePassword />} />

      {/* COURT */}
      <Route
        path="/court/:id"
        element={
          <ProtectedRoute>
            <CourtDashboard />
          </ProtectedRoute>
        }
      />

      {/* INSPECTION */}
      <Route
        path="/inspection-dashboard"
        element={
          <ProtectedRoute>
            <InspectionDashboard />
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






























