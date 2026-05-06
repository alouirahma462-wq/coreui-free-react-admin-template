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

    <Route path="*" element={<div>404 - Page Not Found</div>} /> 

      </Routes>
    </Suspense>
  )
}

export default React.memo(AppContent)




