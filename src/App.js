import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";

function Dashboard() {
  return <h1>Dashboard</h1>;
}

// =========================
// GET USER SAFE
// =========================
function getUser() {
  try {
    return (
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"))
    );
  } catch {
    return null;
  }
}

// =========================
// PROTECTED ROUTE
// =========================
function ProtectedRoute({ children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =========================
// LOGIN ROUTE (SMART)
// =========================
function LoginRoute() {
  const user = getUser();

  if (!user) return <Login />;

  // إذا عنده must_change_password
  if (user.must_change_password) {
    return <Navigate to="/change-password" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

// =========================
// CHANGE PASSWORD ROUTE (SMART)
// =========================
function ChangePasswordRoute() {
  const user = getUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.must_change_password) {
    return <Navigate to="/dashboard" replace />;
  }

  return <ChangePassword />;
}

export default function App() {
  return (
    <Routes>

      {/* LOGIN SMART */}
      <Route path="/login" element={<LoginRoute />} />

      {/* CHANGE PASSWORD SMART */}
      <Route path="/change-password" element={<ChangePasswordRoute />} />

      {/* DASHBOARD PROTECTED */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ROOT SMART */}
      <Route
        path="/"
        element={<LoginRoute />}
      />

      {/* FALLBACK */}
      <Route
        path="*"
        element={<LoginRoute />}
      />
    </Routes>
  );
}













