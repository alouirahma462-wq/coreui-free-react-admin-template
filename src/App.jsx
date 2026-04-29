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
import CaseForm from "./views/cases/CaseForm.jsx";
import CaseList from "./views/cases/CaseList.jsx";
import CaseDetail from "./views/cases/CaseDetail.jsx";

import GlobalMusic from "./GlobalMusic";

// 🔥 مهم: استخدم DefaultLayout فقط
import DefaultLayout from "./layout/DefaultLayout";

// 🔥 SMART SCREEN (إضافة جديدة فقط)
import SmartScreen from "./views/pages/SmartScreen.jsx";

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
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, [location.pathname]);

  const isMustChange = (v) =>
    v === true || v === 1 || v === "1" || v === "true";

  const getHomeRoute = () => "/landing";

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

      {/* 🔥 LANDING أول صفحة */}
      <Route path="/landing" element={<LandingPage />} />

      {/* 🔥 ROOT */}
      <Route path="/" element={<Navigate to="/landing" replace />} />

      {/* ✅ LOGIN */}
      <Route path="/login" element={<Login />} />

      {/* 🔥 AUTH PAGES */}
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* 🔥 SMART SCREEN */}
      <Route path="/smart" element={<SmartScreen />} />

      {/* 🔥 DASHBOARD */}
      <Route element={<DefaultLayout />}>
        
        <Route path="/court/:id" element={<CourtDashboard user={user} />} />
        <Route path="/inspection-dashboard" element={<InspectionDashboard user={user} />} />

        {/* ⭐⭐⭐ FIX مهم: إضافة القضايا داخل Layout */}
        <Route path="/cases" element={<CaseList />} />
        <Route path="/cases/create" element={<CaseForm />} />
        <Route path="/case-detail" element={<CaseDetail />} />

      </Route>

      <Route path="*" element={<Navigate to="/landing" />} />

    </Routes>
  </>
);






































































