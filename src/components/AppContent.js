import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

import routes from '../routes'

// 🔥 Layout components
import { AppSidebar, AppHeader, AppFooter } from './index'

const AppContent = () => {
  return (
    <div className="app-layout">

      {/* 🔥 SIDEBAR ثابت */}
      <AppSidebar />

      {/* 🔥 MAIN WRAPPER */}
      <div className="wrapper d-flex flex-column min-vh-100">

        {/* 🔥 HEADER ثابت */}
        <AppHeader />

        {/* 🔥 CONTENT AREA */}
        <div className="body flex-grow-1 px-3">
          <CContainer fluid>

            <Suspense fallback={<CSpinner color="primary" />}>
              <Routes>

                {routes.map((route, idx) => {
                  return (
                    route.element && (
                      <Route
                        key={idx}
                        path={route.path}
                        element={<route.element />}
                      />
                    )
                  )
                })}

                {/* 🔥 REDIRECT */}
                <Route path="/" element={<Navigate to="dashboard" replace />} />

              </Routes>
            </Suspense>

          </CContainer>
        </div>

        {/* 🔥 FOOTER ثابت */}
        <AppFooter />

      </div>
    </div>
  )
}

export default React.memo(AppContent)

