import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import ForgotPassword from "./views/pages/ForgotPassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

import LandingPage from "./views/pages/LandingPage.jsx";

import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

import GlobalMusic from "./GlobalMusic";

import AppLayout from "./layout/AppLayout";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith("/court") ||
    location.pathname.startsWith("/inspection-dashboard");

  const isAuth =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/change-password";

  const loadUser = async () => {
    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id");

      if (!userId || userId === "undefined" || userId === "null") {
        setUser(null);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(userId))
        .maybeSingle();

      setUser(data || null);
    } catch (err) {
      console.log(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [location.pathname]);

  const isMustChange = (value) =>
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true";

  const getHomeRoute = () => {
    if (!user) return "/login";
    if (isMustChange(user?.must_change_password)) return "/change-password";
    if (user?.court_id === null) return "/inspection-dashboard";
    return `/court/${user?.court_id}`;
  };

  if (loading && location.pathname !== "/login") {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: 50 }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {(isAuth || isDashboard) && (
        <GlobalMusic key={location.pathname} />
      )}

      <Routes>

        {/* 🔥 LANDING */}
        <Route path="/landing" element={<LandingPage />} />

        {/* 🔥 ROOT */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        <Route
          path="/login"
          element={user ? <Navigate to={getHomeRoute()} replace /> : <Login />}
        />

        <Route
          path="/change-password"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : (
              <ChangePassword />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            !user ? (
              <ForgotPassword />
            ) : (
              <Navigate to={getHomeRoute()} replace />
            )
          }
        />

        <Route
          path="/reset-password"
          element={
            !user ? (
              <ResetPassword />
            ) : (
              <Navigate to={getHomeRoute()} replace />
            )
          }
        />

        {/* 🔥 APP LAYOUT FIX (IMPORTANT) */}
        <Route element={<AppLayout />}>
          <Route
            path="/court/:id"
            element={<CourtDashboard user={user} />}
          />

          <Route
            path="/inspection-dashboard"
            element={<InspectionDashboard user={user} />}
          />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/landing" replace />} />

      </Routes>
    </>
  );
}


































































