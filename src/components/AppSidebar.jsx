import React from "react";
import { useSelector } from "react-redux";
import courtNav from "../navigation/courtNav";
import inspectionNav from "../navigation/inspectionNav";
import AppSidebarNav from "./AppSidebarNav";

const AppSidebar = ({ type }) => {

  // ✅ DECLARE ONCE فقط
  const sidebarShow = useSelector(
    (state) => state.sidebarShow ?? true
  );

  if (!sidebarShow) return null;

  const navigation =
    type === "court"
      ? courtNav
      : type === "inspection"
      ? inspectionNav
      : [];

  return (
    <aside
      style={{
        width: "260px",
        background: "#0f172a",
        color: "white",
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        overflowY: "auto",
      }}
    >
      <AppSidebarNav items={navigation} />
    </aside>
  );
};

export default AppSidebar;











