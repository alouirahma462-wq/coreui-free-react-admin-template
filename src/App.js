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

// 🔥 ADD LAYOUTS ONLY (NO CHANGES ELSEWHERE)
import CourtLayout from "./layout/CourtLayout";
import InspectionLayout from "./layout/InspectionLayout";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  const isLanding = location.pathname === "/landing";

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
    setUser(null);

    try {
      const userId = localStorage.getItem("user_id");

      if (!userId || userId === "undefined" || userId === "null") {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", Number(userId))
        .maybeSingle();

      if (error || !data) {
        localStorage.removeItem("user_id");
        setLoading(false);
        return;
      }

      setUser(data);
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

  useEffect(() => {
    const handleStorageChange = () => loadUser();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const isMustChange = (value) =>
    value === true ||
    value === 1 ||
    value === "1" ||
    value === "true";

  const getHomeRoute = () => {
    if (!user) return "/login";
    if (isMustChange(user.must_change_password)) return "/change-password";
    if (user.court_id === null) return "/inspection-dashboard";
    return `/court/${user.court_id}`;
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
    {/* 🎧 MUSIC (FIXED ONLY HERE) */}
      {(isAuth || isDashboard) ? (
        <GlobalMusic key={location.pathname} />
      ) : null}

      {/* 🎬 AUTH BACKGROUND */}
      {isAuth && !isLanding && (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -3,
          }}
        >
          <source src="/justice-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* 🖼 DASHBOARD BACKGROUND */}
      {isDashboard && (
        <>
          <div
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              backgroundImage: "url('/dashboard-bg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: "brightness(0.55) blur(1px)",
              zIndex: -3,
            }}
          />

          <div
            style={{
              position: "fixed",
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.25)",
              zIndex: -2,
            }}
          />
        </>
      )}

      {/* 🔵 AUTH OVERLAY */}
      {isAuth && !isLanding && (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            zIndex: -1,
          }}
        />
      )}

      <Routes>
        {/* 🔥 LANDING */}
        <Route
          path="/landing"
          element={
            <div style={{ width: "100%", height: "100%", position: "relative" }}>
              <LandingPage />
            </div>
          }
        />

        <Route
          path="/login"
          element={
            user ? <Navigate to={getHomeRoute()} replace /> : <Login />
          }
        />

        <Route
          path="/change-password"
          element={
            !user ? <Navigate to="/login" replace /> : <ChangePassword />
          }
        />

        <Route
          path="/forgot-password"
          element={
            !user ? <ForgotPassword /> : <Navigate to={getHomeRoute()} replace />
          }
        />

        <Route
          path="/reset-password"
          element={
            !user ? <ResetPassword /> : <Navigate to={getHomeRoute()} replace />
          }
        />

        {/* 🔥 COURT DASHBOARD + LAYOUT */}
        <Route
          path="/court/:id"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : isMustChange(user.must_change_password) ? (
              <Navigate to="/change-password" replace />
            ) : (
              <CourtLayout>
                <CourtDashboard user={user} />
              </CourtLayout>
            )
          }
        />

        {/* 🔥 INSPECTION DASHBOARD + LAYOUT */}
        <Route
          path="/inspection-dashboard"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : isMustChange(user.must_change_password) ? (
              <Navigate to="/change-password" replace />
            ) : (
              <InspectionLayout>
                <InspectionDashboard user={user} />
              </InspectionLayout>
            )
          }
        />

        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

























































