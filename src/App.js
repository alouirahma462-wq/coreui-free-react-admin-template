import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD USER (single source of truth)
  const loadUser = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select(`
        id,
        fullName,
        must_change_password,
        court_id,
        isActive
      `)
      .eq("id", userId)
      .single();

    if (error || !data || !data.isActive) {
      localStorage.removeItem("user_id");
      setUser(null);
    } else {
      setUser(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  // 🔥 GUARD COMPONENT (clean logic)
  const RequireAuth = ({ children }) => {
    if (!user) return <Navigate to="/login" replace />;
    return children;
  };

  const RequirePasswordChange = ({ children }) => {
    if (user?.must_change_password)
      return <Navigate to="/change-password" replace />;
    return children;
  };

  const getHomeRoute = () => {
    if (!user) return "/login";
    if (user.must_change_password) return "/change-password";
    if (user.court_id === null) return "/inspection-dashboard";
    return `/court/${user.court_id}`;
  };

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: 50 }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* CHANGE PASSWORD */}
      <Route
        path="/change-password"
        element={
          <RequireAuth>
            <ChangePassword />
          </RequireAuth>
        }
      />

      {/* COURT DASHBOARD */}
      <Route
        path="/court/:id"
        element={
          <RequireAuth>
            <RequirePasswordChange>
              {user?.court_id !== null ? (
                <CourtDashboard user={user} />
              ) : (
                <Navigate to="/inspection-dashboard" replace />
              )}
            </RequirePasswordChange>
          </RequireAuth>
        }
      />

      {/* INSPECTION DASHBOARD */}
      <Route
        path="/inspection-dashboard"
        element={
          <RequireAuth>
            <RequirePasswordChange>
              {user?.court_id === null ? (
                <InspectionDashboard user={user} />
              ) : (
                <Navigate to={getHomeRoute()} replace />
              )}
            </RequirePasswordChange>
          </RequireAuth>
        }
      />

      {/* ROOT SMART REDIRECT */}
      <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

































