import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import ForgotPassword from "./views/pages/ForgotPassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const userId = localStorage.getItem("user_id");

      if (!userId) {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(userId)) // 🔥 FIX مهم جداً (string → number)
        .maybeSingle();

      if (error) {
        console.log("DB error:", error);
        setUser(null);
        setLoading(false);
        return;
      }

      if (!data) {
        console.log("User not found");
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(data);
      setLoading(false);

    } catch (err) {
      console.log("Fatal error:", err);
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: 50 }}>
        Loading...
      </div>
    );
  }

  const getHomeRoute = () => {
    if (!user) return "/login";
    if (user.must_change_password) return "/change-password";
    if (user.court_id === null) return "/inspection-dashboard";
    return `/court/${user.court_id}`;
  };

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          user ? <Navigate to={getHomeRoute()} replace /> : <Login />
        }
      />

      {/* CHANGE PASSWORD */}
      <Route
        path="/change-password"
        element={
          !user ? <Navigate to="/login" replace /> : <ChangePassword />
        }
      />

      {/* FORGOT PASSWORD */}
      <Route
        path="/forgot-password"
        element={
          !user ? <ForgotPassword /> : <Navigate to={getHomeRoute()} replace />
        }
      />

      {/* RESET PASSWORD */}
      <Route
        path="/reset-password"
        element={
          !user ? <ResetPassword /> : <Navigate to={getHomeRoute()} replace />
        }
      />

      {/* COURT DASHBOARD */}
      <Route
        path="/court/:id"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.must_change_password ? (
            <Navigate to="/change-password" replace />
          ) : (
            <CourtDashboard user={user} />
          )
        }
      />

      {/* INSPECTION DASHBOARD */}
      <Route
        path="/inspection-dashboard"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : user.must_change_password ? (
            <Navigate to="/change-password" replace />
          ) : (
            <InspectionDashboard user={user} />
          )
        }
      />

      {/* ROOT */}
      <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}










































