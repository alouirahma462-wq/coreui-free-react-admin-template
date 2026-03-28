import React from 'react'
import { Navigate } from 'react-router-dom'
import Login from './views/auth/Login'

// Lazy pages
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  // 🔥 الصفحة الأولى = Login
  { path: '/', exact: true, name: 'Home', element: <Navigate to="/login" /> },

  // 🔐 Login
  { path: '/login', name: 'Login', element: Login },

  // 🏛 Dashboard
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
]

export default routes

