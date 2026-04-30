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
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
// =======================
// 🧠 IMAGE LOADER (PUT HERE)
// =======================
const loadImage = (url) =>
  new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = url
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL("image/png"))
    }
  })
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
const pdfData = useMemo(() => {
  return {
    fileInfo: {
      court: caseData.court,
      fileNumber: caseData.caseFileNumber,
      registry: caseData.registryNumber,
      fileType: caseData.fileType,
      source: caseData.source,
      fileDate: caseData.fileDate
    },

    crime: {
      subject: caseData.subject,
      crimeType: caseData.crimeType,
      place: caseData.crimePlace,
      date: caseData.crimeDate,
      summary: caseData.summary
    },

    parties: {
      plaintiff: caseData.plaintiff,
      suspect: caseData.suspect
    },

    decision: {
      status: caseData.status,
      decisionText: caseData.decisionText,
      lawText: caseData.lawText
    }
  }
}, [caseData])

// ================= PDF EXPORT =================
const exportPDF = async () => {
  const doc = new jsPDF()

  const logo = await loadImage("/logo.png")
  const stamp = await loadImage("/stamp.png")

  // ✅ رقم حكم رسمي (أفضل من Date.now)
  const caseNumber = `TN-MJ-${new Date().getFullYear()}-${caseFileNumber}`

  // 🔐 رابط التحقق (يعتمد على caseId الداخلي)
  const qrData = `https://case-system.tn/case/${caseId}`

  // ================= COVER PAGE =================
  doc.setFontSize(20)
  doc.setFont("helvetica", "bold")
  doc.text("الجمهورية التونسية", 105, 50, { align: "center" })
  doc.text("وزارة العدل", 105, 60, { align: "center" })
  doc.text("ملف قضية رسمي", 105, 75, { align: "center" })

  doc.setFontSize(12)
  doc.text(`رقم الحكم: ${caseNumber}`, 105, 90, { align: "center" })

  // 🔐 QR CODE
  const qrImage = await QRCode.toDataURL(qrData)
  doc.addImage(qrImage, "PNG", 85, 100, 40, 40)

  doc.addPage()

  // ================= HEADER =================
  doc.addImage(logo, "PNG", 10, 5, 25, 25)

  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text("الجمهورية التونسية", 105, 15, { align: "center" })
  doc.text("وزارة العدل", 105, 23, { align: "center" })
  doc.text("مذكرة قضية رسمية", 105, 32, { align: "center" })

  doc.line(10, 38, 200, 38)

  let y = 45

  // ================= helper =================
  const section = (title, body) => {
    doc.setFontSize(13)
    doc.setFont("helvetica", "bold")
    doc.text(title, 14, y)
    y += 5

    autoTable(doc, {
      startY: y,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [30, 30, 30], textColor: 255 },
      body,
    })

    y = doc.lastAutoTable.finalY + 8
  }

  // ================= TAB 1 =================
  section("📁 بيانات الملف", [
    ["المحكمة", formData.court],
    ["عدد الملف", caseFileNumber],
    ["المصدر", formData.source],
    ["نوع الملف", formData.fileType],
    ["تاريخ الملف", formData.fileDate],
    ["كاتب الضبط", formData.clerk],
    ["ملاحظات", formData.notes],
    ["الوثائق", formData.documents],
  ])

  // ================= TAB 2 =================
  section("📍 الواقعة", [
    ["الموضوع", formData.subject],
    ["التصنيف الجرمي", formData.crimeType],
    ["المكان", formData.crimePlace],
    ["التاريخ", formData.crimeDate],
    ["الملخص", formData.summary],
    ["AI اقتراح", formData.aiSuggestion],
  ])

  // ================= TAB 3 =================
  section("👤 الشاكي", [
    ["الاسم الكامل", formData.plaintiff?.fullName],
    ["الجنس", formData.plaintiff?.gender],
    ["الجنسية", formData.plaintiff?.nationality],
    ["تاريخ الولادة", formData.plaintiff?.birthDate],
    ["ولاية الولادة", formData.plaintiff?.birthState],
    ["معتمدية الولادة", formData.plaintiff?.birthDelegation],
    ["ولاية السكن", formData.plaintiff?.resState],
    ["معتمدية السكن", formData.plaintiff?.resDelegation],
    ["التعليم", formData.plaintiff?.education],
    ["المهنة", formData.plaintiff?.job],
    ["ملاحظات", formData.plaintiff?.notes],
    ["إفادة", formData.plaintiff?.statement],
    ["AI", formData.plaintiff?.aiSuggestion],
  ])

  section("⚠️ المظنون فيه", [
    ["الاسم الكامل", formData.suspect?.fullName],
    ["الجنس", formData.suspect?.gender],
    ["الجنسية", formData.suspect?.nationality],
    ["تاريخ الولادة", formData.suspect?.birthDate],
    ["ولاية الولادة", formData.suspect?.birthState],
    ["معتمدية الولادة", formData.suspect?.birthDelegation],
    ["ولاية السكن", formData.suspect?.resState],
    ["معتمدية السكن", formData.suspect?.resDelegation],
    ["التعليم", formData.suspect?.education],
    ["المهنة", formData.suspect?.job],
    ["ملاحظات", formData.suspect?.notes],
    ["إفادة", formData.suspect?.statement],
    ["AI", formData.suspect?.aiSuggestion],
  ])

  // ================= TAB 4 =================
  section("⚖️ القرار", [
    ["ID القضية", caseId],
    ["رقم الحكم", caseNumber],
    ["الحالة", formData.status],
    ["تاريخ القرار", formData.decisionDate],
    ["نص القرار", formData.decisionText],
    ["النص القانوني", formData.lawText],
    ["سبب الحالة", formData.statusReason],
  ])

  // ================= 🧠 AI SUMMARY PAGE =================
  doc.addPage()

  doc.setFontSize(16)
  doc.text("🧠 AI SUMMARY", 105, 20, { align: "center" })

  doc.setFontSize(11)
  doc.text(
    `
القضية: ${formData.subject || ""}
التصنيف: ${formData.crimeType || ""}
الحالة: ${formData.status || ""}

توصية AI:
- متابعة القضية قانونياً
- مراجعة الأدلة والوقائع
    `,
    20,
    40
  )

  // ================= 🕵️ AUDIT PAGE =================
  doc.addPage()

  doc.setFontSize(16)
  doc.text("🕵️ Audit Trail", 105, 20, { align: "center" })

  let ay = 40

  const audit = [
    `إنشاء القضية: ${new Date().toLocaleString()}`,
    `حفظ البيانات`,
    `تحديث الحالة: ${formData.status}`,
    `توليد رقم حكم: ${caseNumber}`,
  ]

  audit.forEach((a) => {
    doc.text(`• ${a}`, 20, ay)
    ay += 10
  })

  // ================= FOOTER =================
  doc.addImage(stamp, "PNG", 145, 250, 45, 45)

  doc.setFontSize(12)
  doc.text("✍️ توقيع إلكتروني معتمد", 20, 255)

  doc.setFontSize(10)
  doc.text("النظام القضائي - إدارة القضايا", 20, 262)

  doc.setFontSize(9)
  doc.text(`ID: ${caseId}`, 20, 270)

  doc.text("Generated by Case Management System", 14, 290)

  // ================= SAVE =================
  doc.save(`case-${caseFileNumber}.pdf`)
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
