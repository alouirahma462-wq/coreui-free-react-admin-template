import React from "react";
import { Navigate } from "react-router-dom";

import Login from "./views/auth/Login";
import LandingPage from "./views/pages/LandingPage"; // ✅ NEW

// Lazy pages
const Dashboard = React.lazy(() =>
  import("./views/dashboard/Dashboard")
);

const ChangePassword = React.lazy(() =>
  import("./views/pages/ChangePassword")
);

// 🔐 NEW: Reset Password page
const ResetPassword = React.lazy(() =>
  import("./views/auth/pages/ResetPassword")
);

const routes = [
  // 🆕 LANDING PAGE (NEW - SAFE ADDITION)
  {
    path: "/landing",
    name: "Landing",
    element: <LandingPage />,
  },

  // 🔁 KEEP SYSTEM AS IT IS (NO CHANGE)
  {
    path: "/",
    exact: true,
    name: "Home",
    element: <Navigate to="/login" />,
  },

  // 🔐 Login
  {
    path: "/login",
    name: "Login",
    element: <Login />,
  },

  // 🔐 Change password (first login)
  {
    path: "/change-password",
    name: "ChangePassword",
    element: <ChangePassword />,
  },

  // 🚨 Reset password
  {
    path: "/reset-password",
    name: "ResetPassword",
    element: <ResetPassword />,
  },

  // 📊 Dashboard
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
  },
];

export default routes;

