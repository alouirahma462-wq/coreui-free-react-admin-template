import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

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

  // 🎨 خلفية النظام
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

  // 🔐 جلب المستخدم الحقيقي من Supabase
  useEffect(() => {
    const getUser = async () => {
      setLoading(true);

      const { data: authData } = await supabase.auth.getUser();

      if (!authData?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 👇 جلب بيانات المستخدم من جدول users
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      setUser(data);
      setLoading(false);
    };

    getUser();

    // 🔄 تحديث تلقائي عند login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // ⏳ Loading screen
  if (loading) {
    return (
      <div style={{ color: "white", padding: 20 }}>
        Loading system...
      </div>
    );
  }

  return (
    <Routes>

      {/* 🔐 AUTH ROUTES */}
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

      {/* 🔁 REDIRECTS */}
      <Route
        path="/"
        element={
          user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}



















