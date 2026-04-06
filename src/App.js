import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// صفحات auth
import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import ForgotPassword from "./views/pages/ForgotPassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

// داشبورد
import Dashboard from "./views/dashboard/Dashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🎨 الخلفية
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

  // 🔐 إصلاح نهائي: مزامنة user بشكل مباشر
  useEffect(() => {
    const syncUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    syncUser();

    // يحدث لو تغير localStorage من أي مكان
    window.addEventListener("storage", syncUser);

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  if (loading) {
    return (
      <div style={{ color: "white", padding: 20 }}>
        Loading system...
      </div>
    );
  }

  return (
    <Routes>

      {/* 🔐 AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/change-password" element={<ChangePassword />} />

      {/* 🧠 DASHBOARD (محمي) */}
      <Route
        path="/dashboard"
        element={
          user ? <Dashboard user={user} /> : <Navigate to="/login" replace />
        }
      />

      {/* 🔁 ROOT */}
      <Route
        path="/"
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* ❌ fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}






















