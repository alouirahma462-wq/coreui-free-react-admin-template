import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

import routes from '../routes'

// 🔥 صفحات النظام القضائي الجديدة
import CaseForm from "../views/cases/CaseForm.jsx"
import CaseList from "../views/cases/CaseList.jsx"
import CaseDetail from "../views/cases/CaseDetail.jsx"

const AppContent = () => {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>

        {routes.map((route, idx) => (
          route.element && (
            <Route
              key={idx}
              path={route.path}
              element={route.element}
            />
          )
        ))}

        {/* 🔥 CASE MANAGEMENT ROUTES */}
        <Route path="/court/files" element={<CaseList />} />
        <Route path="/court/files/new" element={<CaseForm />} />
        <Route path="/court/files/detail" element={<CaseDetail />} />

        {/* 🔥 FIX 1: لا dashboard redirect */}
        <Route path="/" element={<Navigate to="/landing" replace />} />

        {/* 🔥 FIX 2: fallback آمن */}
        <Route path="*" element={<Navigate to="/landing" replace />} />

      </Routes>
    </Suspense>
  )
}

export default React.memo(AppContent)




