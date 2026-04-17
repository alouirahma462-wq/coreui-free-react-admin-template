import React from "react"
import AppSidebar from "../components/AppSidebar"
import AppHeader from "../components/AppHeader"
import AppFooter from "../components/AppFooter"

const CourtLayout = ({ children }) => {
  return (
    <div className="app-layout">

      {/* 🔥 SIDEBAR */}
      <AppSidebar type="court" />

      {/* 🔥 MAIN */}
      <div
        className="wrapper d-flex flex-column min-vh-100"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e293b)",
          color: "white"
        }}
      >

        {/* 🔥 HEADER */}
        <AppHeader type="court" />

        {/* 🔥 CONTENT */}
        <div
          className="body flex-grow-1 px-4 py-3"
          style={{
            backdropFilter: "blur(6px)"
          }}
        >
          {children}
        </div>

        {/* 🔥 FOOTER */}
        <AppFooter />

      </div>
    </div>
  )
}

export default CourtLayout
