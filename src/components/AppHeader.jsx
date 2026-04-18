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
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilMenu,
  cilMoon,
  cilSun,
  cilUserPlus,
  cilAccountLogout,
} from '@coreui/icons'

// ✅ FIX: استدعاء مباشر بدل index
import AppBreadcrumb from './AppBreadcrumb'

const AppHeader = ({ type }) => {
  const headerRef = useRef()
  const navigate = useNavigate()

  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const user = JSON.parse(localStorage.getItem("user")) || {}

  const courtName = user?.court_name || "المحكمة"
  const fullName = user?.full_name || "المستخدم"

  const [visible, setVisible] = useState(false)

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

  const handleLogout = () => {
    localStorage.clear()
    navigate("/", { replace: true })
  }

  return (
    <>
      <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
        <CContainer className="border-bottom px-4" fluid>

          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px' }}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>

          <CHeaderNav className="d-none d-md-flex">
            {type === "court" && (
              <CNavItem>
                <CNavLink to="/dashboard" as={NavLink}>
                  🏠 المحكمة
                </CNavLink>
              </CNavItem>
            )}

            {type === "inspection" && (
              <CNavItem>
                <CNavLink to="/inspection-dashboard" as={NavLink}>
                  🔍 التفقد
                </CNavLink>
              </CNavItem>
            )}
          </CHeaderNav>

          <div style={{
            flex: 1,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "16px"
          }}>
            🇹🇳 وزارة العدل — {courtName}
          </div>

          <CHeaderNav className="ms-auto">

            <CNavItem>
              <CNavLink href="#">
                <CIcon icon={cilBell} size="lg" />
              </CNavLink>
            </CNavItem>

            <CNavItem>
              <CNavLink href="#">
                <CIcon icon={cilEnvelopeOpen} size="lg" />
              </CNavLink>
            </CNavItem>

            <CNavItem style={{ display: "flex", alignItems: "center", marginInline: "10px" }}>
              👤 {fullName}
            </CNavItem>

            <CNavItem>
              <CButton
                color="primary"
                size="sm"
                onClick={() => setVisible(true)}
                style={{ marginInline: "10px" }}
              >
                <CIcon icon={cilUserPlus} /> مستخدم جديد
              </CButton>
            </CNavItem>

            <CNavItem>
              <CButton
                color="danger"
                size="sm"
                onClick={handleLogout}
              >
                <CIcon icon={cilAccountLogout} /> خروج
              </CButton>
            </CNavItem>
          </CHeaderNav>

          <CHeaderNav>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>

              <CDropdownMenu>
                <CDropdownItem onClick={() => setColorMode('light')}>
                  <CIcon className="me-2" icon={cilSun} /> Light
                </CDropdownItem>

                <CDropdownItem onClick={() => setColorMode('dark')}>
                  <CIcon className="me-2" icon={cilMoon} /> Dark
                </CDropdownItem>

                <CDropdownItem onClick={() => setColorMode('auto')}>
                  <CIcon className="me-2" icon={cilContrast} /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CHeaderNav>

        </CContainer>

        <CContainer className="px-4" fluid>
          <AppBreadcrumb />
        </CContainer>
      </CHeader>

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



