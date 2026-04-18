import React from "react";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const CourtLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <AppSidebar type="court" />

      <div
        className="wrapper d-flex flex-column min-vh-100"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
        }}
      >
        <AppHeader type="court" />

        <div
          className="body flex-grow-1 px-4 py-3"
          style={{ backdropFilter: "blur(6px)" }}
        >
          {children}
        </div>

        <AppFooter />
      </div>
    </div>
  );
};

export default CourtLayout;

