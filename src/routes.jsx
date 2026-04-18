import React from "react";
import { Navigate } from "react-router-dom";

import Login from "./views/auth/Login";
import LandingPage from "./views/pages/LandingPage";

import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

import ChangePassword from "./views/pages/ChangePassword";
import ResetPassword from "./views/pages/ResetPassword";

const routes = [
  {
    path: "/landing",
    name: "Landing",
    element: <LandingPage />,
  },

  {
    path: "/",
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


