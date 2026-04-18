import React from "react";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const InspectionLayout = ({ children }) => {
  return (
    <div className="app-layout">
      <AppSidebar type="inspection" />

      <div
        className="wrapper d-flex flex-column min-vh-100"
        style={{
          background: "linear-gradient(135deg, #111827, #1f2937)",
          color: "white",
        }}
      >
        <AppHeader type="inspection" />

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

export default InspectionLayout;

