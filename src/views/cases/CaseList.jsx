import { useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CFormInput,
  CBadge,
  CRow,
  CCol,
  CCollapse
} from '@coreui/react'

// =======================
// 🧠 قاموس الحالات (نفسه)
// =======================
const CASE_STATUS = {
  registration: { label: 'تسجيل', color: 'secondary', icon: '📝' },
  board: { label: 'مجلس', color: 'primary', icon: '👶' },
  children: { label: 'أطفال', color: 'info', icon: '🧒' },
  violations: { label: 'مخالفات', color: 'dark', icon: '🚨' },
  added: { label: 'مضافة', color: 'warning', icon: '➕' },
  commitment: { label: 'تعهد', color: 'warning', icon: '✍️' },
  execution: { label: 'تنفيذ', color: 'success', icon: '🏁' },
  investigation: { label: 'تحقيق', color: 'info', icon: '🔍' },
  search: { label: 'بحث', color: 'primary', icon: '📡' },
  saved: { label: 'حفظ', color: 'success', icon: '💾' },
  criminal: { label: 'جناحي الناحية', color: 'danger', icon: '⚖️' },
  family_judge: { label: 'محال على قاضي الأسرة', color: 'info', icon: '👨‍⚖️' },
  single_judge: { label: 'محال على القضاء المنفرد', color: 'primary', icon: '⚖️' },
  mediation: { label: 'الصلح بالوساطة', color: 'success', icon: '🤝' }
}

const getStatusColor = (status) => {
  const found = Object.values(CASE_STATUS).find(s => s.label === status)
  return found ? found.color : 'light'
}

const getStatusIcon = (status) => {
  const found = Object.values(CASE_STATUS).find(s => s.label === status)
  return found ? found.icon : '📄'
}

// =======================
// 📂 CaseList
// =======================
const CaseList = () => {

  const navigate = useNavigate()
  const [cases, setCases] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('cases')) || []
    setCases(data)
  }, [])

  const filtered = cases.filter(c =>
    (c.subject || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.caseFileNumber || '').toLowerCase().includes(search.toLowerCase())
  )

  // ================= ACTIONS =================
  const openCase = (c) => {
    localStorage.setItem('selectedCase', JSON.stringify(c))
    navigate('/cases/detail')
  }

  const deleteCase = (id) => {
    const updated = cases.filter(c => c.id !== id)
    setCases(updated)
    localStorage.setItem('cases', JSON.stringify(updated))
  }

  const editCase = (c) => {
    navigate('/cases/edit', { state: c })
  }

  const exportMemo = (c) => {
    navigate('/cases/detail', { state: { mode: 'memo', case: c } })
  }

  return (
    <div className="case-page">

      <CCard className="shadow-sm">
        <CCardBody>

          <h4 className="mb-3">📂 قائمة القضايا </h4>

          {/* FILTER */}
          <CRow className="mb-3">
            <CCol md={4}>
              <CFormInput
                placeholder="🔍 بحث..."
                onChange={(e) => setSearch(e.target.value)}
              />
            </CCol>
          </CRow>

          {/* TABLE */}
          <CTable hover bordered responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>🆔 ID القضية</CTableHeaderCell>
                <CTableHeaderCell>🏛 المحكمة</CTableHeaderCell>
                <CTableHeaderCell>⚖️ كاتب ضبط النيابة المسؤول</CTableHeaderCell>
                <CTableHeaderCell>📌 الموضوع</CTableHeaderCell>
                <CTableHeaderCell>🎨 الحالة</CTableHeaderCell>
                <CTableHeaderCell>📌 القرار</CTableHeaderCell>
                <CTableHeaderCell>🕒 تاريخ التلقي</CTableHeaderCell>
                <CTableHeaderCell>⚙️ إجراءات</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {filtered.map((c, i) => (
                <Fragment key={c.id || i}>

                  <CTableRow>

                    <CTableDataCell>{c.caseFileNumber}</CTableDataCell>
                    <CTableDataCell>{c.court}</CTableDataCell>
                    <CTableDataCell>{c.prosecution || 'النيابة'}</CTableDataCell>
                    <CTableDataCell>{c.createdAt || c.fileDate}</CTableDataCell>
                    <CTableDataCell>{c.subject}</CTableDataCell>

                    <CTableDataCell>
                      <CBadge color={getStatusColor(c.status)}>
                        {getStatusIcon(c.status)} {c.status}
                      </CBadge>
                    </CTableDataCell>

                    <CTableDataCell>{c.decision || '—'}</CTableDataCell>
                    <CTableDataCell>{c.receivedTime || c.fileDate}</CTableDataCell>

                    <CTableDataCell>

                      <CButton size="sm" color="info"
                        onClick={() => setExpandedId(expandedId === i ? null : i)}>
                        عرض المزيد
                      </CButton>

                      <CButton size="sm" color="primary" className="mx-1"
                        onClick={() => editCase(c)}>
                        تعديل
                      </CButton>

                      <CButton size="sm" color="danger"
                        onClick={() => deleteCase(c.id)}>
                        حذف
                      </CButton>

                      <CButton size="sm" color="dark" className="mx-1"
                        onClick={() => exportMemo(c)}>
                        مذكرة
                      </CButton>

                    </CTableDataCell>

                  </CTableRow>

                  {/* EXPAND */}
                  <CTableRow>
                    <CTableDataCell colSpan={8} className="p-0">
                      <CCollapse visible={expandedId === i}>
                        <div className="p-3 bg-light border-top">

                          <div><b>📁 عدد الملف الأمني :</b> {c.securityFiles || 0}</div>
                          <div><b>🧾 عدد التسجيل:</b> {c.registrations || 0}</div>
                          <div><b>👥 الأطراف:</b> {c.parties || '—'}</div>
                          <div><b>⚖️ التصنيف الجرمي:</b> {c.criminalClass || '—'}</div>
                          <div><b>📝 آخر تعديل:</b> {c.lastUpdate || '—'}</div>

                          <div className="mt-3">
                            <CButton color="primary" size="sm" onClick={() => openCase(c)}>
                              📂 فتح الملف الكامل
                            </CButton>
                          </div>

                        </div>
                      </CCollapse>
                    </CTableDataCell>
                  </CTableRow>

                </Fragment>
              ))}
            </CTableBody>

          </CTable>

        </CCardBody>
      </CCard>

    </div>
  )
}

export default CaseList



