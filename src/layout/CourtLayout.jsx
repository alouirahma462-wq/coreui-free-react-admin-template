import React from "react";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const CourtLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <AppSidebar type="court" />

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white",
          minHeight: "100vh",
        }}
      >
        <AppHeader type="court" />

        <main
          style={{
            flex: 1,
            padding: "20px",
            backdropFilter: "blur(6px)",
          }}
        >
          {children}
        </main>

        <AppFooter />
      </div>
    </div>
  );
};

export default CourtLayout;


