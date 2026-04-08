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

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      // 🔥 حماية إضافية ضد user قديم
      if (!data) {
        localStorage.clear();
        setUser(null);
        return;
      }

      setUser(data);
    } catch (err) {
      console.log(err);
      localStorage.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();

    // ❌ تم حذف interval لأنه يسبب مشاكل session
    // const sync = setInterval(loadUser, 800);
    // return () => clearInterval(sync);

  }, []);

  if (loading) return <div style={{ color: "white" }}>Loading...</div>;

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

      {/* COURT */}
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

      {/* INSPECTION */}
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






































