import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CButton,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";

import AppBreadcrumb from "./AppBreadcrumb";
import { supabase } from "../supabaseClient";

const AppHeader = ({ type }) => {

  const headerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidebarShow = useSelector((state) => state.sidebarShow ?? true);

  const [fullName, setFullName] = useState("المستخدم");
  const [courtName, setCourtName] = useState("المحكمة");

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("user_id");

      if (!userId) return;

      const { data: userData } = await supabase
        .from("users")
        .select("full_name, court_id")
        .eq("id", Number(userId))
        .single();

      if (userData?.full_name) setFullName(userData.full_name);

      if (userData?.court_id) {
        const { data: court } = await supabase
          .from("courts")
          .select("name")
          .eq("id", userData.court_id)
          .single();

        if (court?.name) setCourtName(court.name);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <CHeader
      className="p-0 header"
      ref={headerRef}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,

        // 🔥 تحسين الشكل فقط (بدون تغيير منطق)
        background: "#ffffff",
        borderBottom: "2px solid #e5e7eb",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <CContainer className="px-4" fluid>

        <CHeaderToggler
          onClick={() =>
            dispatch({ type: "set", sidebarShow: !sidebarShow })
          }
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>

        <div className="flex-grow-1 text-center">
          <div style={{ fontSize: "12px", opacity: 0.6 }}>
            🇹🇳 الجمهورية التونسية
          </div>

          <div style={{ fontWeight: "bold", color: "#0d6efd", fontSize: "16px" }}>
            🏛️ {courtName}
          </div>
        </div>

        <CHeaderNav className="ms-auto d-flex align-items-center gap-2">

          <div
            style={{
              padding: "6px 12px",
              background: "#f1f5f9",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "bold",
              border: "1px solid #e5e7eb",
            }}
          >
            👤 {fullName}
          </div>

          <CButton
            style={{
              background: "#dc2626",
              border: "none",
              borderRadius: "8px",
              padding: "6px 12px",
              fontWeight: "bold",
            }}
            onClick={handleLogout}
          >
            🚪 خروج
          </CButton>

        </CHeaderNav>

      </CContainer>

      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;







