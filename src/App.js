import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import ForgotPassword from "./views/pages/ForgotPassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

// ✅ الداشبورد الحقيقي
import Dashboard from "./views/dashboard/Dashboard.js";

export default function App() {

  // 🎨 خلفية عامة للنظام
  useEffect(() => {
    document.body.style.background = `
      linear-gradient(rgba(5,15,35,0.45), rgba(30,64,175,0.55)),
      url("https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80")
    `;

    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
  }, []);

  // 👤 مؤقت (لاحقًا يأتي من Supabase Auth)
  const fakeUser = {
    username: "admin",
    role: "admin", // inspector / clerk
  };

  return (
    <Routes>

      {/* 🔐 AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* 🧠 MAIN DASHBOARD (النظام الحقيقي) */}
      <Route
        path="/dashboard"
        element={<Dashboard user={fakeUser} />}
      />

      {/* 🔁 REDIRECTS */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

















