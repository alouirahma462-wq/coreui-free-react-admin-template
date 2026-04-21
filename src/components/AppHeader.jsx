import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  useColorModes,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";
import { cilMenu, cilMoon, cilSun, cilContrast } from "@coreui/icons";

import AppBreadcrumb from "./AppBreadcrumb";
import { supabase } from "../supabaseClient";

const AppHeader = ({ type }) => {

  const headerRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidebarShow = useSelector((state) => state.sidebarShow ?? true);

  const { colorMode, setColorMode } = useColorModes(
    "coreui-free-react-admin-template-theme"
  );

  const [fullName, setFullName] = useState("المستخدم");
  const [courtName, setCourtName] = useState("المحكمة");
  const [visible, setVisible] = useState(false);

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
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
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

          <div style={{ fontWeight: "bold", color: "#0d6efd" }}>
            🏛️ {courtName}
          </div>
        </div>

        <CHeaderNav className="ms-auto d-flex align-items-center gap-2">

          <div
            style={{
              padding: "6px 10px",
              background: "#f1f3f5",
              borderRadius: 20,
            }}
          >
            👤 {fullName}
          </div>

          <CButton color="danger" size="sm" onClick={handleLogout}>
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







