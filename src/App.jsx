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

import DefaultLayout from "./layout/DefaultLayout";

import SmartScreen from "./views/pages/SmartScreen.jsx";

export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // =========================
  // 🎯 DASHBOARD CHECK
  // =========================
  const isDashboard =
    location.pathname.startsWith("/court") ||
    location.pathname.startsWith("/inspection-dashboard");

  // =========================
  // 🔓 AUTH CHECK
  // =========================
  const isAuth =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password" ||
    location.pathname === "/change-password";

  // =========================
  // 🧠 LOAD USER (FIXED)
  // =========================
  const loadUser = async () => {

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

  // =========================
  // ⚠️ FIX: no reload on every route
  // =========================
  useEffect(() => {
    loadUser();
  }, []);

  // =========================
  // ⏳ LOADING
  // =========================
  if (loading) {
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

        {/* 🔓 AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* 🔥 SMART SCREEN */}
        <Route path="/smart" element={<SmartScreen />} />

        {/* =========================
            📊 DEFAULT LAYOUT
        ========================= */}
        <Route element={<DefaultLayout />}>

          {/* Dashboard */}
          <Route
            path="/court/:id"
            element={<CourtDashboard user={user} />}
          />

          <Route
            path="/inspection-dashboard"
            element={<InspectionDashboard user={user} />}
          />

          {/* Cases */}
          <Route path="/cases" element={<CaseList />} />
          <Route path="/cases/create" element={<CaseForm />} />
          <Route path="/cases/edit/:id" element={<CaseForm />} />
          <Route path="/cases/detail" element={<CaseDetail />} />

        </Route>

        {/* ❌ FIXED fallback (important) */}
        <Route path="*" element={<Navigate to="/landing" replace />} />

      </Routes>
    </>
  );
}








































































