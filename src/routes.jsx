import React from "react";
import { Navigate } from "react-router-dom";

import Login from "./views/auth/Login";
import LandingPage from "./views/pages/LandingPage";

// Lazy pages
const Dashboard = React.lazy(() =>
  import("./views/dashboard/Dashboard")
);

const ChangePassword = React.lazy(() =>
  import("./views/pages/ChangePassword")
);

const ResetPassword = React.lazy(() =>
  import("./views/pages/ResetPassword")
);

const routes = [
  {
    path: "/landing",
    name: "Landing",
    element: <LandingPage />,
  },

  {
    path: "/",
    exact: true,
    name: "Home",
    element: <Navigate to="/login" />,
  },

  {
    path: "/login",
    name: "Login",
    element: <Login />,
  },

  {
    path: "/change-password",
    name: "ChangePassword",
    element: <ChangePassword />,
  },

  {
    path: "/reset-password",
    name: "ResetPassword",
    element: <ResetPassword />,
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboard />,
  },
];

export default routes;


