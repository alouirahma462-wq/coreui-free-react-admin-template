import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CProgress,
} from '@coreui/react'

import { supabase } from '../../supabaseClient'

const Dashboard = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
  })

  // 🔥 جلب المستخدمين
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('users').select('*')

      if (error) {
        console.log('ERROR:', error)
        return
      }

      console.log('DATA:', data)

      setUsers(data || [])
      setStats({
        totalUsers: data?.length || 0,
      })
    }

    fetchData()
  }, [])

  return (
    <>
      {/* 🔥 TOP STATS */}
      <CRow>
        <CCol sm={6}>
          <CCard className="mb-4">
            <CCardBody>
              <h4>Total Users</h4>
              <h2>{stats.totalUsers}</h2>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* 🔥 USERS TABLE */}
      <CRow>
        <CCol>
          <CCard className="mb-4">
            <CCardHeader>Users Dashboard</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>Created At</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {users.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{user.name || 'No Name'}</CTableDataCell>
                      <CTableDataCell>{user.email || '-'}</CTableDataCell>
                      <CTableDataCell>{user.role || 'user'}</CTableDataCell>
                      <CTableDataCell>
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : '-'}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard

