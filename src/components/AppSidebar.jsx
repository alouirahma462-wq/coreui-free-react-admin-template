import React from "react";
import { useSelector } from "react-redux";
import courtNav from "../navigation/courtNav";
import inspectionNav from "../navigation/inspectionNav";
import AppSidebarNav from "./AppSidebarNav";

const AppSidebar = ({ type }) => {
  const sidebarShow = useSelector(
    (state) => state.sidebarShow ?? true
  );

  const sidebarShow = useSelector((state) => state.sidebarShow ?? true);

  const navigation =
    type === "court"
      ? courtNav
      : type === "inspection"
      ? inspectionNav
      : [];

  return (
    <aside
      className="sidebar-custom"
      style={{
        width: "260px",
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <AppSidebarNav items={navigation} />
    </aside>
  );
};

export default AppSidebar;










