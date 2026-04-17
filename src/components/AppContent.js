import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

import routes from '../routes'

const AppContent = () => {
  return (
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
  )
}

export default React.memo(AppContent)


