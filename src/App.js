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
    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id");

      if (!userId || userId === "undefined" || userId === "null") {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(userId))
        .maybeSingle();

      if (error || !data) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(data);
      setLoading(false);

    } catch (err) {
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // 🔥 FIX 1: storage sync
  useEffect(() => {
    const syncUser = () => {
      loadUser();
    };

    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // 🔥 FIX 2: interval sync (prevents stuck old user)
  useEffect(() => {
    const interval = setInterval(() => {
      const storedId = localStorage.getItem("user_id");

      if (!storedId && user !== null) {
        setUser(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  // 🔥 FIX 3: focus reload (switch tab fix)
  useEffect(() => {
    const handleFocus = () => {
      loadUser();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
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

      <Route path="/login" element={
        user ? <Navigate to={getHomeRoute()} replace /> : <Login />
      } />

      <Route path="/change-password" element={
        !user ? <Navigate to="/login" replace /> : <ChangePassword />
      } />

      <Route path="/forgot-password" element={
        !user ? <ForgotPassword /> : <Navigate to={getHomeRoute()} replace />
      } />

      <Route path="/reset-password" element={
        !user ? <ResetPassword /> : <Navigate to={getHomeRoute()} replace />
      } />

      <Route path="/court/:id" element={
        !user ? (
          <Navigate to="/login" replace />
        ) : user.must_change_password ? (
          <Navigate to="/change-password" replace />
        ) : (
          <CourtDashboard user={user} />
        )
      } />

      <Route path="/inspection-dashboard" element={
        !user ? (
          <Navigate to="/login" replace />
        ) : user.must_change_password ? (
          <Navigate to="/change-password" replace />
        ) : (
          <InspectionDashboard user={user} />
        )
      } />

      <Route path="/" element={<Navigate to={getHomeRoute()} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}













































