import React from 'react'
import { CFooter, CContainer, CRow, CCol } from '@coreui/react'

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

        <CRow>

          {/* 🔹 معلومات النظام */}
          <CCol md={4}>
            <h6>🏛️ وزارة العدل</h6>
            <p style={{ fontSize: "14px" }}>
              منظومة النيابة العمومية الرقمية
            </p>
          </CCol>

          {/* 🔹 روابط سريعة */}
          <CCol md={4}>
            <h6>روابط سريعة</h6>
            <ul style={{ listStyle: "none", padding: 0, fontSize: "14px" }}>
              <li>متابعة القضايا</li>
              <li>الخدمات الإدارية</li>
              <li>إحصائيات قضائية</li>
            </ul>
          </CCol>

          {/* 🔹 معلومات المستخدم */}
          <CCol md={4}>
            <h6>النظام</h6>
            <p style={{ fontSize: "14px" }}>
              نظام داخلي آمن — الوصول للمخولين فقط
            </p>
          </CCol>

        </CRow>

        {/* 🔻 خط سفلي */}
        <div
          style={{
            marginTop: "10px",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: "10px",
            display: "flex",
            justifyContent: "space-between",
            fontSize: "13px"
          }}
        >
          <span>🇹🇳 وزارة العدل التونسية</span>
          <span>© {new Date().getFullYear()} جميع الحقوق محفوظة</span>
        </div>

      </CContainer>
    </CFooter>
  )
}

export default React.memo(AppFooter)

