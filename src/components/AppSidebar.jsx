import React from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
  CCloseButton,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

// ✔️ تأكد أن هذول موجودين فعلاً في assets/brand
import logo from "../assets/brand/logo.js";
import sygnet from "../assets/brand/sygnet.js";

// ✔️ الـ navigation files
import AppSidebarNav from "./AppSidebarNav";
import navCourt from "../_navCourt";
import navInspection from "../_navInspection";

const AppSidebar = ({ type }) => {
  const dispatch = useDispatch();

  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

  // ✔️ اختيار القائمة حسب النوع
  const navigation = type === "inspection" ? navInspection : navCourt;

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) =>
        dispatch({ type: "set", sidebarShow: visible })
      }
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          <CIcon icon={logo} height={32} />
          <CIcon icon={sygnet} height={32} />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() =>
            dispatch({ type: "set", sidebarShow: false })
          }
        />
      </CSidebarHeader>

      {/* NAVIGATION */}
      <AppSidebarNav items={navigation} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() =>
            dispatch({
              type: "set",
              sidebarUnfoldable: !unfoldable,
            })
          }
        />
      </CSidebarFooter>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);



