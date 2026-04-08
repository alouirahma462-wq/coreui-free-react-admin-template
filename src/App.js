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

  // 🔥 SINGLE SOURCE OF TRUTH
  const loadUser = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
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

  if (loading) {
    return <div style={{ color: "white" }}>Loading...</div>;
  }

  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* CHANGE PASSWORD */}
      <Route
        path="/change-password"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.must_change_password ? (
            <ChangePassword />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* COURT */}
      <Route
        path="/court/:id"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.must_change_password ? (
            <Navigate to="/change-password" replace />
          ) : user.access_level === "court" ? (
            <CourtDashboard user={user} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* INSPECTION */}
      <Route
        path="/inspection-dashboard"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.must_change_password ? (
            <Navigate to="/change-password" replace />
          ) : user.access_level === "global" ? (
            <InspectionDashboard user={user} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />

      {/* ROOT */}
      <Route
        path="/"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.must_change_password ? (
            <Navigate to="/change-password" replace />
          ) : user.access_level === "court" ? (
            <Navigate to={`/court/${user.court_id}`} replace />
          ) : (
            <Navigate to="/inspection-dashboard" replace />
          )
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}
































