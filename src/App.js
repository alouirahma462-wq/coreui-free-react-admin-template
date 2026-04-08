import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";
import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 SINGLE SOURCE OF TRUTH
  const loadUser = async () => {
    const userId = localStorage.getItem("user_id");

    if (!userId) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    setUser(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route
        path="/change-password"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : user.must_change_password ? (
            <ChangePassword />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/court/:id"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : user.must_change_password ? (
            <Navigate to="/change-password" />
          ) : user.access_level === "court" ? (
            <CourtDashboard user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/inspection-dashboard"
        element={
          !user ? (
            <Navigate to="/login" />
          ) : user.must_change_password ? (
            <Navigate to="/change-password" />
          ) : user.access_level === "global" ? (
            <InspectionDashboard user={user} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/"
        element={
          user
            ? user.must_change_password
              ? <Navigate to="/change-password" />
              : user.access_level === "court"
              ? <Navigate to={`/court/${user.court_id}`} />
              : <Navigate to="/inspection-dashboard" />
            : <Navigate to="/login" />
        }
      />

    </Routes>
  );
}































