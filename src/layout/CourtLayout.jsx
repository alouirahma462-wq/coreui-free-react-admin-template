import React from "react";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const CourtLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>

      {/* SIDEBAR */}
      <AppSidebar type="court" />

      {/* MAIN */}
      <div style={{ flex: 1, minHeight: "100vh" }}>

        <AppHeader type="court" />

        <div style={{ padding: "20px" }}>
          {children}
        </div>

        <AppFooter />

      </div>

    </div>
  );
};

export default CourtLayout;




