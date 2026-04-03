import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./views/pages/login/Login.jsx";
import ChangePassword from "./views/pages/ChangePassword.jsx";

function Dashboard() {
  return <h1>Dashboard</h1>;
}

// =========================
// حماية الصفحات
// =========================
function ProtectedRoute({ children }) {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =========================
// منع دخول login إذا user مسجل
// =========================
function PublicRoute({ children }) {
  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* Change Password */}
      <Route path="/change-password" element={<ChangePassword />} />

      {/* Dashboard (محمي) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* root → smart redirect */}
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      {/* fallback */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}












