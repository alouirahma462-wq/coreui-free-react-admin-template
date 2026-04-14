import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import ForgotPassword from "./views/pages/ForgotPassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

// 🆕 ADD ONLY THIS IMPORT
import LandingPage from "./views/pages/LandingPage.jsx";

import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

import GlobalMusic from "./GlobalMusic";
import { useLocation } from "react-router-dom";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // 🎯 تحديد الصفحات
  const isLanding = location.pathname === "/landing";
  const isDashboard = location.pathname.includes("/dashboard");
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

  // 🔥 FIX: reload user when storage changes (login/update)
  useEffect(() => {
    loadUser();

    const handleStorageChange = () => {
      loadUser();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 🔥 FIX must change password
  const isMustChange = (value) => {
    return (
      value === true ||
      value === 1 ||
      value === "1" ||
      value === "true"
    );
  };

  const getHomeRoute = () => {
    if (!user) return "/login";

    if (isMustChange(user.must_change_password)) return "/change-password";

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
    <>

      {/* 🎧 MUSIC فقط للـ Auth + Dashboard */}
      {isAuth || isDashboard ? <GlobalMusic /> : null}

      {/* 🎬 BACKGROUND للـ AUTH فقط */}
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
            zIndex: -2,
          }}
        >
          <source src="/justice-bg.mp4" type="video/mp4" />
        </video>
      )}

      {/* 🖼 BACKGROUND للـ DASHBOARD فقط */}
      {isDashboard && (
        <div
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            backgroundImage: "url('/dashboard-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            zIndex: -2,
          }}
        />
      )}

      {/* 🌑 overlay */}
      {(isAuth || isDashboard) && !isLanding && (
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

        {/* 🟣 LANDING */}
        <Route path="/landing" element={<LandingPage />} />

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

        <Route
          path="/court/:id"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : isMustChange(user.must_change_password) ? (
              <Navigate to="/change-password" replace />
            ) : (
              <CourtDashboard user={user} />
            )
          }
        />

        <Route
          path="/inspection-dashboard"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : isMustChange(user.must_change_password) ? (
              <Navigate to="/change-password" replace />
            ) : (
              <InspectionDashboard user={user} />
            )
          }
        />

        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}


















































