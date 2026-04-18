import React from "react";
import { Navigate } from "react-router-dom";

import Login from "./views/auth/Login.jsx";
import LandingPage from "./views/pages/LandingPage.jsx";

import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

import ChangePassword from "./views/pages/ChangePassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

const routes = [
  {
    path: "/landing",
    name: "Landing",
    element: <LandingPage />,
  },

  {
    path: "/",
    name: "Home",
    element: <Navigate to="/login" replace />,
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
    path: "/court/:id",
    name: "CourtDashboard",
    element: <CourtDashboard />,
  },

  {
    path: "/inspection-dashboard",
    name: "InspectionDashboard",
    element: <InspectionDashboard />,
  },
];

export default routes;



