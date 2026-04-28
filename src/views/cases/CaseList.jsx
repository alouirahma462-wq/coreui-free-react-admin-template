import { useEffect, useState } from 'react'
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
  CFormSelect,
  CBadge,
  CRow,
  CCol
} from '@coreui/react'

// =======================
// 🧠 قاموس الحالات (محدث بالكامل)
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

  // ➕ الإضافات المطلوبة
  criminal: { label: 'جناحي الناحية', color: 'danger', icon: '⚖️' },
  family_judge: { label: 'محال على قاضي الأسرة', color: 'info', icon: '👨‍⚖️' },
  single_judge: { label: 'محال على القضاء المنفرد', color: 'primary', icon: '⚖️' },
  mediation: { label: 'الصلح بالوساطة', color: 'success', icon: '🤝' }
}

// =======================
// 🎨 الحالة -> لون
// =======================
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

  const [cases, setCases] = useState([])

  // 🔍 Filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [source, setSource] = useState('')
  const [type, setType] = useState('')
  const [crime, setCrime] = useState('')
  const [gender, setGender] = useState('')
  const [nationality, setNationality] = useState('')
  const [location, setLocation] = useState('')
  const [date, setDate] = useState('')
  const [month, setMonth] = useState('')

  // 📥 load
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('cases')) || []
    setCases(data)
  }, [])

  // =======================
  // 🧠 FILTER ENGINE (ذكي + متعدد)
  // =======================
  const filtered = cases.filter(c => {

    const matchSearch =
      (c.subject || '').includes(search) ||
      (c.caseFileNumber || '').includes(search)

    const matchStatus = !status || c.status === status
    const matchSource = !source || c.source === source
    const matchType = !type || c.fileType === type
    const matchCrime = !crime || c.crimeType === crime
    const matchGender = !gender || c.gender === gender
    const matchNationality = !nationality || c.nationality === nationality
    const matchLocation =
      !location ||
      (c.birthState === location || c.resState === location)

    const matchDate = !date || c.fileDate === date

    const matchMonth =
      !month || (c.fileDate || '').slice(5, 7) === month

    return (
      matchSearch &&
      matchStatus &&
      matchSource &&
      matchType &&
      matchCrime &&
      matchGender &&
      matchNationality &&
      matchLocation &&
      matchDate &&
      matchMonth
    )
  })

  // ================= OPEN =================
  const openCase = (caseData) => {
    localStorage.setItem('selectedCase', JSON.stringify(caseData))
    window.location.href = '/#/case-detail'
  }

  return (
    <CCard className="shadow-sm">
      <CCardBody>

        <h4 className="mb-3">📂 قائمة القضايا القضائية</h4>

        {/* ================= FILTERS ================= */}
        <CRow className="g-2 mb-3">

          <CCol md={3}>
            <CFormInput placeholder="🔍 بحث..." onChange={(e) => setSearch(e.target.value)} />
          </CCol>

          <CCol md={3}>
            <CFormSelect onChange={(e) => setStatus(e.target.value)}>
              <option value="">كل الحالات</option>
              {Object.values(CASE_STATUS).map((s, i) => (
                <option key={i}>{s.label}</option>
              ))}
            </CFormSelect>
          </CCol>

          <CCol md={3}>
            <CFormInput type="date" onChange={(e) => setDate(e.target.value)} />
          </CCol>

          <CCol md={3}>
            <CFormSelect onChange={(e) => setMonth(e.target.value)}>
              <option value="">كل الأشهر</option>
              <option value="01">يناير</option>
              <option value="02">فيفري</option>
              <option value="03">مارس</option>
              <option value="04">أفريل</option>
              <option value="05">ماي</option>
              <option value="06">جوان</option>
              <option value="07">جويلية</option>
              <option value="08">أوت</option>
              <option value="09">سبتمبر</option>
              <option value="10">أكتوبر</option>
              <option value="11">نوفمبر</option>
              <option value="12">ديسمبر</option>
            </CFormSelect>
          </CCol>

        </CRow>

        {/* ================= TABLE ================= */}
        <CTable hover responsive striped>

          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>📁 الملف</CTableHeaderCell>
              <CTableHeaderCell>📌 الموضوع</CTableHeaderCell>
              <CTableHeaderCell>⚖️ الحالة</CTableHeaderCell>
              <CTableHeaderCell>📅 التاريخ</CTableHeaderCell>
              <CTableHeaderCell>⚙️</CTableHeaderCell>
            </CTableRow>
          </CTableHead>

          <CTableBody>
            {filtered.map((c, i) => (
              <CTableRow key={i}>

                <CTableDataCell>
                  <strong>{c.caseFileNumber}</strong>
                </CTableDataCell>

                <CTableDataCell>{c.subject}</CTableDataCell>

                <CTableDataCell>
                  <CBadge color={getStatusColor(c.status)}>
                    {getStatusIcon(c.status)} {c.status}
                  </CBadge>
                </CTableDataCell>

                <CTableDataCell>{c.fileDate}</CTableDataCell>

                <CTableDataCell>
                  <CButton size="sm" color="info" onClick={() => openCase(c)}>
                    فتح
                  </CButton>
                </CTableDataCell>

              </CTableRow>
            ))}
          </CTableBody>

        </CTable>

      </CCardBody>
    </CCard>
  )
}

export default CaseList
