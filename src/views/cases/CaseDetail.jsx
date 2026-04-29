import { useEffect, useState, useMemo } from 'react'

import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CRow,
  CCol,
  CFormInput,
  CFormTextarea,
  CBadge,
  CButton
} from '@coreui/react'

// =======================
// 🧾 Case Detail
// =======================
const CaseDetail = () => {

  const [activeKey, setActiveKey] = useState(1)
  const [caseData, setCaseData] = useState({})
  const [history, setHistory] = useState([])
  const [auditTrail, setAuditTrail] = useState([])
  const [aiResult, setAiResult] = useState('')

  // ================= LOAD =================
useEffect(() => {
  try {
    const raw = localStorage.getItem('selectedCase')
    const data = raw ? JSON.parse(raw) : {}

    setCaseData(data || {})

    setHistory([
      {
        action: 'إنشاء القضية',
        date: data?.createdAt || '',
        type: 'create'
      },
      {
        action: 'تعديل الحالة',
        date: data?.createdAt || '',
        type: 'update'
      }
    ])

    setAuditTrail([
      {
        user: 'system',
        action: 'إنشاء',
        before: null,
        after: data?.status || '',
        time: data?.createdAt || ''
      }
    ])

  } catch (err) {
    console.error('JSON error:', err)
    setCaseData({})
    setHistory([])
    setAuditTrail([])
  }
}, [])

// ================= AI SUMMARY =================
const aiSummary = useMemo(() => {
  if (!caseData) return ''

  return `
🧠 ملخص ذكي:

📌 القضية: ${caseData.subject || 'غير محدد'}
📅 تاريخ التسجيل: ${caseData.fileDate || 'غير متوفر'}

⚖️ التصنيف: ${caseData.crimeType || 'غير محدد'}
📊 الحالة الحالية: ${caseData.status || 'غير محدد'}

━━━━━━━━━━━━━━━━━━
⚖️ التوصية:
متابعة الإجراء حسب المعطيات المتوفرة.
`
}, [
  caseData.subject,
  caseData.fileDate,
  caseData.crimeType,
  caseData.status
])


  // ================= AI REAL (READY) =================
  const getAIAnalysis = async () => {
    // 🔥 جاهز تربطيه بـ OpenAI
    const fake = `
🤖 تحليل متقدم:

- الجريمة المحتملة: ${caseData.crimeType}
- درجة الخطورة: متوسطة
- توصية: إحالة على التحقيق

📌 ملخص:
${caseData.summary}
`
    setAiResult(fake)
  }

  // ================= PDF EXPORT =================
  const exportPDF = () => {

    const content = `
******** وزارة العدل ********

📄 مذكرة قضية رسمية

رقم الملف: ${caseData.caseFileNumber}
عدد التسجيل: ${caseData.registryNumber}

📌 الموضوع:
${caseData.subject}

⚖️ الحالة:
${caseData.status}

📍 الوقائع:
${caseData.summary}

👤 الشاكي:
${caseData.plaintiff?.fullName}

⚠️ المظنون فيه:
${caseData.suspect?.fullName}

📝 القرار:
${caseData.decisionText}

-----------------------------
🖊️ الإمضاء:
....................
`

    const blob = new Blob([content], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'case-report.pdf'
    a.click()
  }

  // ================= TIMELINE COLOR =================
  const getColor = (type) => {
    if (type === 'create') return 'green'
    if (type === 'update') return 'orange'
    return 'gray'
  }

  return (
    <CCard>
      <CCardBody>

        <h4 className="mb-3">📂 تفاصيل القضية</h4>

        {/* ================= ACTIONS ================= */}
        <div className="mb-3 d-flex gap-2">
          <CButton color="dark" onClick={exportPDF}>📄 تصدير PDF</CButton>
          <CButton color="info" onClick={getAIAnalysis}>🤖 تحليل AI</CButton>
        </div>

        {/* ================= TABS ================= */}
        <CNav variant="tabs">
          <CNavItem>
            <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>📁 بيانات الملف</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>📍 الواقعة</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeKey === 3} onClick={() => setActiveKey(3)}>👥 الأطراف</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink active={activeKey === 4} onClick={() => setActiveKey(4)}>⚖️ الحالة والقرار</CNavLink>
          </CNavItem>
        </CNav>

        <CTabContent className="mt-3">

          {/* ================= TAB 1 ================= */}
          <CTabPane visible={activeKey === 1}>
            <CRow>
              <CCol md={6}><CFormInput value={caseData.court} label="المحكمة" readOnly /></CCol>
              <CCol md={6}><CFormInput value={caseData.caseFileNumber} label="عدد الملف" readOnly /></CCol>
              <CCol md={6}><CFormInput value={caseData.source} label="المصدر" readOnly /></CCol>
              <CCol md={6}><CFormInput value={caseData.fileType} label="نوع الملف" readOnly /></CCol>
              <CCol md={6}><CFormInput value={caseData.fileDate} label="تاريخ الملف" readOnly /></CCol>
              <CCol md={6}><CFormInput value={caseData.registryNumber} label="عدد التسجيل" readOnly /></CCol>
              <CCol md={12}><CFormTextarea value={caseData.notes} label="ملاحظات" readOnly /></CCol>
            </CRow>
          </CTabPane>

          {/* ================= TAB 2 ================= */}
          <CTabPane visible={activeKey === 2}>
            <CFormInput value={caseData.subject} label="الموضوع" readOnly />
            <CFormInput value={caseData.crimeType} label="التصنيف" readOnly />
            <CFormInput value={caseData.crimePlace} label="المكان" readOnly />
            <CFormInput value={caseData.crimeDate} label="التاريخ" readOnly />
            <CFormTextarea value={caseData.summary} label="الملخص" readOnly />
          </CTabPane>

          {/* ================= TAB 3 ================= */}
          <CTabPane visible={activeKey === 3}>
            <h6>👤 الشاكي</h6>
            <CFormInput value={caseData.plaintiff?.fullName} label="الاسم" readOnly />
            <CFormInput value={caseData.plaintiffGender} label="الجنس" readOnly />

            <h6 className="mt-3">⚠️ المظنون فيه</h6>
            <CFormInput value={caseData.suspect?.fullName} label="الاسم" readOnly />
            <CFormInput value={caseData.suspectGender} label="الجنس" readOnly />
          </CTabPane>

          {/* ================= TAB 4 ================= */}
          <CTabPane visible={activeKey === 4}>
            <CBadge color="info">{caseData.status}</CBadge>
            <CFormTextarea value={caseData.decisionText} label="القرار" readOnly />
            <CFormTextarea value={caseData.lawText} label="النص القانوني" readOnly />
          </CTabPane>

        </CTabContent>

        {/* ================= AI ================= */}
        <CCard className="mt-4">
          <CCardBody>
            <h5>🤖 AI Summary</h5>
            <pre>{aiResult || generateAISummary()}</pre>
          </CCardBody>
        </CCard>

        {/* ================= HISTORY ================= */}
        <CCard className="mt-4">
          <CCardBody>
            <h5>📜 سجل التعديلات</h5>
            {history.map((h, i) => (
              <div key={i}>
                • {h.action} - {h.date}
              </div>
            ))}
          </CCardBody>
        </CCard>

        {/* ================= TIMELINE ================= */}
        <CCard className="mt-4">
          <CCardBody>
            <h5>⏱️ Timeline</h5>
            {history.map((h, i) => (
              <div key={i} style={{
                borderLeft: `4px solid ${getColor(h.type)}`,
                paddingLeft: 10,
                marginBottom: 10
              }}>
                <strong>{h.action}</strong>
                <div>{h.date}</div>
              </div>
            ))}
          </CCardBody>
        </CCard>

        {/* ================= AUDIT ================= */}
        <CCard className="mt-4">
          <CCardBody>
            <h5>🕵️ Audit Trail</h5>
            {auditTrail.map((a, i) => (
              <div key={i}>
                👤 {a.user} | {a.action} | {a.time}
                <div>قبل: {a.before}</div>
                <div>بعد: {a.after}</div>
                <hr />
              </div>
            ))}
          </CCardBody>
        </CCard>

      </CCardBody>
    </CCard>
  )
}

export default CaseDetail
