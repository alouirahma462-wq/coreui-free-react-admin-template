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

import { supabase } from '../../supabaseClient'

// =======================
// 🧠 قاموس الحالات
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
  const found = Object.values(CASE_STATUS)
    .find(s => s.label === status)

  return found ? found.color : 'light'
}

const getStatusIcon = (status) => {
  const found = Object.values(CASE_STATUS)
    .find(s => s.label === status)

  return found ? found.icon : '📄'
}

const CaseList = () => {

  const navigate = useNavigate()

  const [cases, setCases] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [search, setSearch] = useState('')

  // =======================
  // 📥 LOAD CASES
  // =======================
  useEffect(() => {

    const loadCases = async () => {

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error) {
        setCases(data || [])
      }

    }

    loadCases()

  }, [])

  // =======================
  // 🔍 FILTER
  // =======================
  const filtered = cases.filter(c =>

    (c.subject || '')
      .toLowerCase()
      .includes(search.toLowerCase())

    ||

    (c.case_id || '')
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase())

    ||

    (c.security_files || '')
      .toString()
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  // =======================
  // 📂 OPEN CASE
  // =======================
  const openCase = (c) => {
    localStorage.setItem(
      'selectedCase',
      JSON.stringify(c)
    )

    navigate('/cases/detail')
  }

  // =======================
  // ✏️ EDIT
  // =======================
  const editCase = (c) => {
    navigate(`/cases/edit/${c.id}`)
  }

  // =======================
  // ❌ DELETE
  // =======================
  const deleteCase = async (id) => {

    const confirmDelete = window.confirm(
      'هل أنت متأكد من حذف القضية؟'
    )

    if (!confirmDelete) return

    const { error } = await supabase
      .from('cases')
      .delete()
      .eq('id', id)

    if (!error) {
      setCases(prev =>
        prev.filter(c => c.id !== id)
      )
    }

  }

  // =======================
  // 📝 MEMO
  // =======================
  const exportMemo = (c) => {
    navigate('/cases/detail', {
      state: {
        mode: 'memo',
        case: c
      }
    })
  }

  return (

    <div className="case-page">

      <CCard className="shadow-sm">

        <CCardBody>

          <h4 className="mb-3">
            📂 قائمة القضايا
          </h4>

          {/* 🔍 SEARCH */}
          <CRow className="mb-3">

            <CCol md={4}>

              <CFormInput
                placeholder="🔍 بحث..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </CCol>

          </CRow>

          {/* 📋 TABLE */}
          <CTable
            hover
            bordered
            responsive
          >

            <CTableHead>

              <CTableRow>

                <CTableHeaderCell>
                  🆔 ID القضية
                </CTableHeaderCell>

                <CTableHeaderCell>
                  🏛 المحكمة
                </CTableHeaderCell>

                <CTableHeaderCell>
                  ⚖️ كاتب الضبط
                </CTableHeaderCell>

                <CTableHeaderCell>
                  📌 الموضوع
                </CTableHeaderCell>

                <CTableHeaderCell>
                  🎨 الحالة
                </CTableHeaderCell>

                <CTableHeaderCell>
                  📌 القرار
                </CTableHeaderCell>

                <CTableHeaderCell>
                  🕒 وقت التلقي
                </CTableHeaderCell>

                <CTableHeaderCell>
                  ⚙️ الإجراءات
                </CTableHeaderCell>

              </CTableRow>

            </CTableHead>

            <CTableBody>

              {filtered.length === 0 ? (

                <CTableRow>

                  <CTableDataCell
                    colSpan={8}
                    className="text-center"
                  >
                    🚫 لا توجد قضايا
                  </CTableDataCell>

                </CTableRow>

              ) : (

                filtered.map((c) => (

                  <Fragment key={c.id}>

                    {/* MAIN ROW */}
                    <CTableRow>

                      <CTableDataCell>
                        {c.case_id}
                      </CTableDataCell>

                      <CTableDataCell>
                        {c.court}
                      </CTableDataCell>

                      <CTableDataCell>
                        {c.clerk || c.prosecution || '—'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {c.subject}
                      </CTableDataCell>

                      <CTableDataCell>

                        <CBadge
                          color={getStatusColor(c.status)}
                        >
                          {getStatusIcon(c.status)} {c.status}
                        </CBadge>

                      </CTableDataCell>

                      <CTableDataCell>
                        {c.decision_text || c.decision || '—'}
                      </CTableDataCell>

                      <CTableDataCell>
                        {c.received_time || c.created_at || '—'}
                      </CTableDataCell>

                      {/* ACTIONS */}
                      <CTableDataCell>

                        <CButton
                          size="sm"
                          color="info"
                          onClick={() =>
                            setExpandedId(
                              expandedId === c.id
                                ? null
                                : c.id
                            )
                          }
                        >
                          عرض
                        </CButton>

                        <CButton
                          size="sm"
                          color="primary"
                          className="mx-1"
                          onClick={() => editCase(c)}
                        >
                          تعديل
                        </CButton>

                        <CButton
                          size="sm"
                          color="danger"
                          onClick={() => deleteCase(c.id)}
                        >
                          حذف
                        </CButton>

                        <CButton
                          size="sm"
                          color="dark"
                          className="mx-1"
                          onClick={() => exportMemo(c)}
                        >
                          مذكرة
                        </CButton>

                      </CTableDataCell>

                    </CTableRow>

                    {/* EXPANDED */}
                    <CTableRow>

                      <CTableDataCell
                        colSpan={8}
                        className="p-0"
                      >

                        <CCollapse
                          visible={expandedId === c.id}
                        >

                          <div className="p-3 bg-light border-top">

                            <div>
                              <b>📁 الملف الأمني:</b>{' '}
                              {c.security_files || '—'}
                            </div>

                            <div>
                              <b>🧾 عدد التسجيل:</b>{' '}
                              {c.registrations || '—'}
                            </div>

                            <div>
                              <b>👤 الشاكي:</b>{' '}
                              {c.plaintiff?.fullName || '—'}
                            </div>

                            <div>
                              <b>⚠️ المظنون فيه:</b>{' '}
                              {c.suspect?.fullName || '—'}
                            </div>

                            <div>
                              <b>⚖️ التصنيف الجرمي:</b>{' '}
                              {c.crime_type || c.criminal_class || '—'}
                            </div>

                            <div>
                              <b>📝 آخر تعديل:</b>{' '}
                              {c.last_update || '—'}
                            </div>

                            <div className="mt-3">

                              <CButton
                                color="primary"
                                size="sm"
                                onClick={() => openCase(c)}
                              >
                                📂 فتح الملف الكامل
                              </CButton>

                            </div>

                          </div>

                        </CCollapse>

                      </CTableDataCell>

                    </CTableRow>

                  </Fragment>

                ))

              )}

            </CTableBody>

          </CTable>

        </CCardBody>

      </CCard>

    </div>

  )
}

export default CaseList





