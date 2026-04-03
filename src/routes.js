import React from 'react'
import { Navigate } from 'react-router-dom'
import Login from './views/auth/Login'

// Lazy pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const ChangePassword = React.lazy(() => import('./views/pages/ChangePassword'))

const routes = [
  { path: '/', exact: true, name: 'Home', element: <Navigate to="/login" /> },

  { path: '/login', name: 'Login', element: <Login /> },

  // ✅ أضف هذا
  { path: '/change-password', name: 'ChangePassword', element: <ChangePassword /> },

  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
]

export default routes

