import React from "react";
import { Navigate } from "react-router-dom";

import Login from "./views/auth/Login.jsx";
import LandingPage from "./views/pages/LandingPage.jsx";

import CourtDashboard from "./views/dashboard/CourtDashboard.jsx";
import InspectionDashboard from "./views/dashboard/InspectionDashboard.jsx";

import ChangePassword from "./views/pages/ChangePassword.jsx";
import ResetPassword from "./views/pages/ResetPassword.jsx";

// =======================
// 📂 إضافة صفحات القضايا
// =======================
import CaseForm from "./views/cases/CaseForm.jsx";
import CaseList from "./views/cases/CaseList.jsx";
import CaseDetail from "./views/cases/CaseDetail.jsx";

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

  // =======================
  // 📂 ROUTES القضايا (جديد)
  // =======================

  {
    path: "/cases/create",
    name: "CaseForm",
    element: <CaseForm />,
  },

  {
    path: "/cases",
    name: "CaseList",
    element: <CaseList />,
  },

  {
    path: "/case-detail",
    name: "CaseDetail",
    element: <CaseDetail />,
  },

];

export default routes;




