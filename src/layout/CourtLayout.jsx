import React from "react";
import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

const CourtLayout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>

      <AppSidebar type="court" />

      <div style={{ flex: 1 }}>
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





