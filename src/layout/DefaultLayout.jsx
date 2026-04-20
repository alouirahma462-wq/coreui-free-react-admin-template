import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = () => {
  return (
    <div className="wrapper d-flex flex-column min-vh-100">

      {/* 🔥 Sidebar لازم يكون داخل wrapper */}
      <AppSidebar />

      {/* 🔥 Main Area */}
      <div className="body flex-grow-1 d-flex flex-column min-vh-100">

        {/* Header */}
        <AppHeader />

        {/* Content */}
        <div className="flex-grow-1">
          <AppContent />
        </div>

        {/* Footer */}
        <AppFooter />

      </div>
    </div>
  )
}

export default DefaultLayout

