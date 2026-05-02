import React from 'react'
import { CFooter, CContainer } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter
      className="px-4"
      style={{
        background: "rgba(0,0,0,0.5)",
        color: "white",
        backdropFilter: "blur(6px)"
      }}
    >
      <CContainer fluid>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "13px",
            padding: "10px 0",
            gap: "8px"
          }}
        >
          <span>
            جميع الحقوق محفوظة © 2026 وزارة العدل - الجمهورية التونسية
          </span>

          {/* 🇹🇳 علم تونس داخل دائرة */}
          <span
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              lineHeight: "1"
            }}
          >
            🇹🇳
          </span>

        </div>

      </CContainer>
    </CFooter>
  )
}

export default React.memo(AppFooter)

