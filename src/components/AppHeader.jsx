import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import {
  cilMenu,
  cilMoon,
  cilSun,
  cilContrast,
} from '@coreui/icons'

import AppBreadcrumb from './AppBreadcrumb'
import { supabase } from '../supabaseClient'

const AppHeader = ({ type }) => {
  const headerRef = useRef()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const { colorMode, setColorMode } = useColorModes(
    'coreui-free-react-admin-template-theme'
  )

  // ================= STATES =================
  const [fullName, setFullName] = useState("المستخدم")
  const [courtName, setCourtName] = useState("المحكمة")
  const [visible, setVisible] = useState(false)

  // ================= FETCH USER + COURT =================
  useEffect(() => {
    const fetchData = async () => {
      const { data: authUser } = await supabase.auth.getUser()
      const userId = authUser?.user?.id

      if (!userId) return

      // 👤 user
      const { data: userData } = await supabase
        .from("users")
        .select("full_name, court_id")
        .eq("id", userId)
        .single()

      if (userData?.full_name) {
        setFullName(userData.full_name)
      }

      // 🏛️ court
      if (userData?.court_id) {
        const { data: court } = await supabase
          .from("courts")
          .select("name")
          .eq("id", userData.court_id)
          .single()

        if (court?.name) {
          setCourtName(court.name)
        }
      }
    }

    fetchData()
  }, [])

  // ================= SCROLL SHADOW =================
  useEffect(() => {
    const handleScroll = () => {
      headerRef.current &&
        headerRef.current.classList.toggle(
          'shadow-sm',
          document.documentElement.scrollTop > 0
        )
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    navigate("/", { replace: true })
  }

  // ================= UI =================
  return (
    <>
      <CHeader
        position="sticky"
        className="mb-4 p-0"
        ref={headerRef}
        style={{
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.85)"
        }}
      >
        <CContainer className="border-bottom px-4" fluid>

          {/* Sidebar Toggle */}
          <CHeaderToggler
            onClick={() =>
              dispatch({ type: 'set', sidebarShow: !sidebarShow })
            }
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          {/* ================= COURT NAVBAR ================= */}
          {type === "court" && (
            <>
              <CHeaderNav className="d-none d-md-flex">
                <CNavItem>
                  <CNavLink as={NavLink} to="/court/dashboard">
                    🏛️ المحكمة
                  </CNavLink>
                </CNavItem>
              </CHeaderNav>

              <div className="flex-grow-1 text-center">
                <div style={{ fontSize: "12px", opacity: 0.6 }}>
                  🇹🇳 الجمهورية التونسية
                </div>

                <div style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#0d6efd"
                }}>
                  🏛️ {courtName}
                </div>
              </div>

              <CHeaderNav className="ms-auto d-flex align-items-center gap-2">

                <div style={{
                  background: "#f1f3f5",
                  padding: "6px 10px",
                  borderRadius: "20px",
                  fontSize: "13px",
                  fontWeight: "500"
                }}>
                  👤 {fullName}
                </div>

                <CButton
                  color="success"
                  size="sm"
                  style={{ borderRadius: "20px" }}
                  onClick={() => setVisible(true)}
                >
                  مستخدم
                </CButton>

                <CButton
                  color="danger"
                  size="sm"
                  style={{ borderRadius: "20px" }}
                  onClick={handleLogout}
                >
                  🚪 خروج
                </CButton>

              </CHeaderNav>
            </>
          )}

          {/* ================= INSPECTION NAVBAR ================= */}
          {type === "inspection" && (
            <>
              <div className="flex-grow-1 text-center">

                <div style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  color: "#212529"
                }}>
                  🕵️ الإدارة المركزية
                </div>

                <div style={{
                  fontSize: "13px",
                  color: "#6c757d"
                }}>
                  الإشراف المركزي على المحاكم
                </div>

                <div style={{
                  marginTop: "4px",
                  display: "inline-block",
                  padding: "4px 10px",
                  background: "#e9ecef",
                  borderRadius: "15px",
                  fontSize: "13px"
                }}>
                  👤 {fullName}
                </div>

              </div>

              <CHeaderNav className="ms-auto">

                <CButton
                  color="dark"
                  size="sm"
                  style={{ borderRadius: "20px" }}
                  onClick={handleLogout}
                >
                  🚪 خروج
                </CButton>

              </CHeaderNav>
            </>
          )}

          {/* ================= THEME ================= */}
          <CHeaderNav>
            <CDropdown variant="nav-item">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} />
                ) : (
                  <CIcon icon={cilSun} />
                )}
              </CDropdownToggle>

              <CDropdownMenu>
                <CDropdownItem onClick={() => setColorMode('light')}>
                  Light
                </CDropdownItem>
                <CDropdownItem onClick={() => setColorMode('dark')}>
                  Dark
                </CDropdownItem>
                <CDropdownItem onClick={() => setColorMode('auto')}>
                  Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>

        </CContainer>

        {/* Breadcrumb */}
        <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>

      {/* ================= MODAL ================= */}
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>إضافة مستخدم جديد</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CFormInput placeholder="اسم المستخدم" className="mb-2" />
          <CFormInput placeholder="كلمة المرور" type="password" className="mb-2" />
          <CFormInput placeholder="الاسم الكامل" />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            إلغاء
          </CButton>
          <CButton color="primary">
            حفظ
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default AppHeader





