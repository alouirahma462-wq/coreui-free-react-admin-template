return (
  <CHeader
    className="p-0 header"
    ref={headerRef}
    style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      background: "#ffffff",
      borderBottom: "1px solid #e5e7eb",
    }}
  >
    <CContainer className="px-4" fluid>

      {/* sidebar toggle */}
      <CHeaderToggler
        onClick={() =>
          dispatch({ type: "set", sidebarShow: !sidebarShow })
        }
      >
        <CIcon icon={cilMenu} size="lg" />
      </CHeaderToggler>

      {/* 🔥 FIX: عرض دائم بدون type شرط */}
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

        {/* theme */}
        <CDropdown variant="nav-item">
          <CDropdownToggle caret={false}>
            {colorMode === "dark" ? (
              <CIcon icon={cilMoon} />
            ) : colorMode === "auto" ? (
              <CIcon icon={cilContrast} />
            ) : (
              <CIcon icon={cilSun} />
            )}
          </CDropdownToggle>

          <CDropdownMenu>
            <CDropdownItem onClick={() => setColorMode("light")}>
              Light
            </CDropdownItem>
            <CDropdownItem onClick={() => setColorMode("dark")}>
              Dark
            </CDropdownItem>
            <CDropdownItem onClick={() => setColorMode("auto")}>
              Auto
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

      </CHeaderNav>

    </CContainer>
  </CHeader>
);







