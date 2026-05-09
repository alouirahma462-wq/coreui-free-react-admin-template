import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import FormWrapper from "../../components/FormWrapper"
const getTunisDateTime = () => {
  const now = new Date()
  return now.toLocaleString('fr-TN', {
    timeZone: 'Africa/Tunis'
  })
}
import {
  CCard,
  CCardBody,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CToast,
  CToastHeader,
  CToastBody,
  CFormFeedback
} from '@coreui/react'

// =======================
// 🧭 Stepper Component (FIXED)
// =======================
const Stepper = ({ step }) => {
  const steps = [
    "بيانات الملف",
    "تفاصيل الواقعة",
    "الأطراف",
    "القرار"
  ]

  return (
    <div className="custom-stepper mb-4">

      <div className="stepper-line" />

      {steps.map((label, index) => {
        const current = index + 1
        const active = step === current
        const done = step > current

        return (
          <div key={index} className="step-item">

            <div className={`step-circle ${active ? "active" : ""} ${done ? "done" : ""}`}>
              {done ? "✔" : current}
            </div>

            <small className={`step-label ${active ? "active" : ""}`}>
              {label}
            </small>

          </div>
        )
      })}
    </div>
  )
}


// =======================
// 📦 import الداتا كاملة
// =======================
import {
  courts,
  fileTypes,
  sources,
  crimeCategories,
  genders,
  nationalities,
  locations
} from '../../data/caseData'

// =======================
// 🧠 أدوات مساعدة
// =======================
const generateCaseFileNumber = () => 'CF-' + Date.now()

const generateRegistryNumber = () =>
  'REG-' + Math.floor(Math.random() * 1000000)

const getNowTimestamp = () => new Date().toISOString()

const generateCaseId = () => 'CASE-' + Date.now()

const PersonForm = ({ title, type, formData, setFormData, errors }) => {

  const person = formData?.[type] || {}

  const birthLocation = Array.isArray(locations)
    ? locations.find(l =>
        l?.state?.trim()?.toLowerCase() === person?.birthState?.trim()?.toLowerCase()
      )
    : null

  const resLocation = Array.isArray(locations)
    ? locations.find(l =>
        l?.state?.trim()?.toLowerCase() === person?.resState?.trim()?.toLowerCase()
      )
    : null

  const isInvalid = (field) => !!errors?.[field]

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...(prev[type] || {}),
        [field]: value
      }
    }))
  }

  return (
    <div className="person-card">

      <h6 className="section-title">{title}</h6>

      <CRow className="g-3">

        {/* الاسم الكامل */}
        <CCol xs={12} md={6}>
          <CFormInput
            name={`${type}.fullName`}
            label="الاسم الكامل"
            value={person.fullName || ''}
            invalid={isInvalid(`${type}.fullName`)}
            onChange={(e) => updateField("fullName", e.target.value)}
          />
          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.fullName`]}
          </CFormFeedback>
        </CCol>

        {/* الجنس */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.gender`}
            label="الجنس"
            value={person.gender || ''}
            invalid={isInvalid(`${type}.gender`)}
            onChange={(e) => updateField("gender", e.target.value)}
          >
            <option value="">-- اختر --</option>
            {genders?.map((g, i) => (
              <option key={i} value={g}>{g}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.gender`]}
          </CFormFeedback>
        </CCol>

        {/* الجنسية */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.nationality`}
            label="الجنسية"
            value={person.nationality || ''}
            invalid={isInvalid(`${type}.nationality`)}
            onChange={(e) => updateField("nationality", e.target.value)}
          >
            <option value="">-- اختر --</option>
            {nationalities?.map((n, i) => (
              <option key={i} value={n}>{n}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.nationality`]}
          </CFormFeedback>
        </CCol>

        {/* تاريخ الولادة */}
        <CCol xs={12} md={6}>
          <CFormInput
            type="date"
            name={`${type}.birthDate`}
            label="تاريخ الولادة"
            value={person.birthDate || ''}
            invalid={isInvalid(`${type}.birthDate`)}
            onChange={(e) => updateField("birthDate", e.target.value)}
          />
          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.birthDate`]}
          </CFormFeedback>
        </CCol>

        {/* ولاية الولادة */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.birthState`}
            label="ولاية الولادة"
            value={person.birthState || ''}
            invalid={isInvalid(`${type}.birthState`)}
            onChange={(e) => updateField("birthState", e.target.value)}
          >
            <option value="">-- اختر --</option>
            {locations?.map((l, i) => (
              <option key={i} value={l?.state}>{l?.state}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.birthState`]}
          </CFormFeedback>
        </CCol>

        {/* معتمدية الولادة */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.birthDelegation`}
            label="معتمدية الولادة"
            value={person.birthDelegation || ''}
            invalid={isInvalid(`${type}.birthDelegation`)}
            onChange={(e) => updateField("birthDelegation", e.target.value)}
          >
            <option value="">-- اختر --</option>
            {birthLocation?.delegations?.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.birthDelegation`]}
          </CFormFeedback>
        </CCol>

        {/* ولاية السكن */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.resState`}
            label="ولاية السكن"
            value={person.resState || ''}
            invalid={isInvalid(`${type}.resState`)}
            onChange={(e) => updateField("resState", e.target.value)}
          >
            <option value="">-- اختر --</option>
            {locations?.map((l, i) => (
              <option key={i} value={l?.state}>{l?.state}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.resState`]}
          </CFormFeedback>
        </CCol>

        {/* معتمدية السكن */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.resDelegation`}
            label="معتمدية السكن"
            value={person.resDelegation || ''}
            invalid={isInvalid(`${type}.resDelegation`)}
            onChange={(e) => updateField("resDelegation", e.target.value)}
          >
            <option value="">-- اختر --</option>
            {resLocation?.delegations?.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.resDelegation`]}
          </CFormFeedback>
        </CCol>

        {/* التعليم */}
        <CCol xs={12} md={6}>
          <CFormInput
            name={`${type}.education`}
            label="المستوى التعليمي"
            value={person.education || ''}
            invalid={isInvalid(`${type}.education`)}
            onChange={(e) => updateField("education", e.target.value)}
          />
          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.education`]}
          </CFormFeedback>
        </CCol>

        {/* المهنة */}
        <CCol xs={12} md={6}>
          <CFormInput
            name={`${type}.job`}
            label="المهنة"
            value={person.job || ''}
            invalid={isInvalid(`${type}.job`)}
            onChange={(e) => updateField("job", e.target.value)}
          />
          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.job`]}
          </CFormFeedback>
        </CCol>

        {/* الملاحظات */}
        <CCol xs={12}>
          <CFormTextarea
            name={`${type}.notes`}
            label="ملاحظات"
            value={person.notes || ''}
            invalid={isInvalid(`${type}.notes`)}
            onChange={(e) => updateField("notes", e.target.value)}
          />
          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.notes`]}
          </CFormFeedback>
        </CCol>

        {/* الإفادة */}
        <CCol xs={12}>
          <CFormTextarea
            name={`${type}.statement`}
            label="الإفادة"
            value={person.statement || ''}
            invalid={isInvalid(`${type}.statement`)}
            onChange={(e) => updateField("statement", e.target.value)}
          />
          <CFormFeedback invalid>
            ❌ {errors?.[`${type}.statement`]}
          </CFormFeedback>
        </CCol>

  {/* 🤖 اقتراحات الذكاء الاصطناعي */}
<CCol xs={12}>
  <CFormTextarea
    name={`${type}.aiSuggestion`}
    label="اقتراحات الذكاء الاصطناعي"
    value={person.aiSuggestion || ''}
    invalid={isInvalid(`${type}.aiSuggestion`)}
    onChange={(e) => updateField("aiSuggestion", e.target.value)}
  />

  <CFormFeedback invalid>
    ❌ {errors?.[`${type}.aiSuggestion`]}
  </CFormFeedback>
</CCol>

      </CRow>
    </div>
  )
}

// =======================
// 🧾 CaseForm
// =======================
const CaseForm = () => {
const navigate = useNavigate()
const location = useLocation()
const location = useLocation()

const editData = location.state?.caseData || null
const isEdit = !!editData
const [caseId] = useState(() =>
  isEdit ? String(editData?.caseId) : String(generateCaseId())
)
const [step, setStep] = useState(1)
const [errors, setErrors] = useState({})  
const timerRef = useRef(null) 
useEffect(() => {

  const loadCase = async () => {

    // لو جاية من navigation state
    if (editData) {

      setFormData(prev => ({
        ...prev,
        ...editData
      }))

      return
    }

    // لو فتح الصفحة مباشرة
    if (id) {

      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single()

      if (!error && data) {

        setFormData(prev => ({
          ...prev,
          ...data
        }))
      }
    }
  }

  loadCase()

}, [id])
const isInvalid = (field) => !!errors?.[field]
const validateStep = (step, formData) => {
  const validationErrors = {}

  // =========================
  // STEP 1
  // =========================
  if (step === 1) {
    if (!formData.court) validationErrors.court = "المحكمة مطلوبة"
    if (!formData.source) validationErrors.source = "مصدر الملف مطلوب"
    if (!formData.fileType) validationErrors.fileType = "نوع الملف مطلوب"
    if (!formData.fileDate) validationErrors.fileDate = "تاريخ الملف مطلوب"
    if (!formData.clerk) validationErrors.clerk = "كاتب الضبط مطلوب"
    if (!formData.notes) validationErrors.notes = "الملاحظات مطلوبة"
    if (!formData.documents) validationErrors.documents = "الوثائق المصاحبة مطلوبة"
  }

  // =========================
  // STEP 2
  // =========================
  if (step === 2) {
    if (!formData.subject) validationErrors.subject = "الموضوع مطلوب"
    if (!formData.crimeType) validationErrors.crimeType = "التصنيف الجرمي مطلوب"
    if (!formData.crimePlace) validationErrors.crimePlace = "مكان الواقعة مطلوب"
    if (!formData.crimeDate) validationErrors.crimeDate = "تاريخ الواقعة مطلوب"
    if (!formData.summary) validationErrors.summary = "ملخص الوقائع مطلوب"
    if (!formData.aiSuggestion) validationErrors.aiSuggestion = "اقتراح AI مطلوب"
  }

  // =========================
  // STEP 3
  // =========================
  if (step === 3) {

    const checkPerson = (p = {}, key) => {
      if (!p?.fullName) validationErrors[`${key}.fullName`] = "الاسم الكامل مطلوب"
      if (!p?.gender) validationErrors[`${key}.gender`] = "الجنس مطلوب"
      if (!p?.nationality) validationErrors[`${key}.nationality`] = "الجنسية مطلوبة"
      if (!p?.birthDate) validationErrors[`${key}.birthDate`] = "تاريخ الولادة مطلوب"
      if (!p?.birthState) validationErrors[`${key}.birthState`] = "ولاية الولادة مطلوبة"
      if (!p?.birthDelegation) validationErrors[`${key}.birthDelegation`] = "معتمدية الولادة مطلوبة"
      if (!p?.resState) validationErrors[`${key}.resState`] = "ولاية السكن مطلوبة"
      if (!p?.resDelegation) validationErrors[`${key}.resDelegation`] = "معتمدية السكن مطلوبة"
      if (!p?.education) validationErrors[`${key}.education`] = "المستوى التعليمي مطلوب"
      if (!p?.job) validationErrors[`${key}.job`] = "المهنة مطلوبة"
      if (!p?.notes) validationErrors[`${key}.notes`] = "ملاحظات مطلوبة"
      if (!p?.statement) validationErrors[`${key}.statement`] = "الإفادة مطلوبة"
    }

    checkPerson(formData.plaintiff || {}, "plaintiff")
    checkPerson(formData.suspect || {}, "suspect")
  }

  // =========================
  // STEP 4
  // =========================
  if (step === 4) {
    if (!formData.decisionText) validationErrors.decisionText = "نص القرار مطلوب"
    if (!formData.decisionDate) validationErrors.decisionDate = "تاريخ القرار مطلوب"
    if (!formData.lawText) validationErrors.lawText = "النص القانوني مطلوب"
    if (!formData.status) validationErrors.status = "حالة القضية مطلوبة"
    if (!formData.statusReason) validationErrors.statusReason = "سبب الحالة مطلوب"
  }

  return validationErrors
}


const handleNext = (nextStep) => {
  const stepErrors = validateStep(step, formData)

  const keys = Object.keys(stepErrors)

  if (keys.length > 0) {
    setErrors(stepErrors)

    // 🔥 يركز على أول input فيه خطأ
    const firstErrorKey = keys[0]
    const el = document.querySelector(`[name="${firstErrorKey}"]`)

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.focus()
    }

    return
  }

  setErrors({})
  setStep(nextStep)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const [showSuccessModal, setShowSuccessModal] = useState(false)
const [caseFileNumber] = useState(() =>
  isEdit
    ? editData?.securityFiles || generateCaseFileNumber()
    : generateCaseFileNumber()
)

const [registryNumber] = useState(() =>
  isEdit
    ? editData?.registrations || generateRegistryNumber()
    : generateRegistryNumber()
)
const [tunisTime] = useState(getTunisDateTime())
const [toastVisible, setToastVisible] = useState(false)
const [toastMessage, setToastMessage] = useState('')

const initialFormState = {
  court: '',
  fileType: '',
  source: '',
  fileDate: '',
  clerk: '',
  notes: '',
  documents: '',
  subject: '',
  crimeType: '',
  crimePlace: '',
  crimeDate: '',
  summary: '',
  aiSuggestion: '',
  status: '',
  statusReason: '',
  decisionText: '',
  decisionDate: '',
  lawText: '',
  plaintiff: {},
  suspect: {}
}
const [formData, setFormData] = useState(initialFormState)
const fieldProps = (field) => ({
  invalid: isInvalid(field)
}) 
useEffect(() => {
  if (isEdit && editData) {
    setFormData({
      ...initialFormState,
      ...editData
    })
  }
}, [isEdit, editData])
const handleSave = async () => {
  try {
    const plaintiff = formData.plaintiff || {}
    const suspect = formData.suspect || {}

    const normalizedCase = {
      case_id: caseId,

      // File Info
      court: formData.court,
      source: formData.source,
      file_type: formData.fileType,
      file_date: formData.fileDate,
      clerk: formData.clerk,
      notes: formData.notes,
      documents: formData.documents,

      // Crime
      subject: formData.subject,
      crime_type: formData.crimeType,
      crime_place: formData.crimePlace,
      crime_date: formData.crimeDate,
      summary: formData.summary,
      ai_suggestion: formData.aiSuggestion,

      // Parties
      plaintiff,
      suspect,
      parties: {
        plaintiffName: plaintiff.fullName || '',
        suspectName: suspect.fullName || ''
      },

      // Decision
      decision_text: formData.decisionText,
      decision_date: formData.decisionDate,
      law_text: formData.lawText,
      status: formData.status,
      status_reason: formData.statusReason,

      // Numbers
      security_files: caseFileNumber,
      registrations: registryNumber,

      // Mapping
      prosecution: formData.clerk,
      decision: formData.decisionText,
      criminal_class: formData.crimeType,

      // timestamps
      created_at: isEdit ? editData.created_at : getNowTimestamp(),
      received_time: isEdit ? editData.received_time : getNowTimestamp(),
      last_update: getNowTimestamp(),
    }

    const { error } = isEdit
      ? await supabase
          .from('cases')
          .update(normalizedCase)
          .eq('id', editData.id)
      : await supabase
          .from('cases')
          .insert([normalizedCase])

  if (error) {
  console.error('Supabase error:', error)
  setToastMessage('❌ خطأ أثناء الحفظ')
  setToastVisible(true)
  return
}

setToastMessage(
  isEdit ? '✏️ تم تعديل القضية بنجاح' : '✅ تم حفظ القضية بنجاح'
)

setShowSuccessModal(true)

setTimeout(() => {
  setShowSuccessModal(false)
  navigate('/cases')
}, 2000)  } catch (err) {
    console.error(err)
  }
}
return (
 <FormWrapper>
    <div className="form-bg">
      <CCard className="glass-card">
        <CCardBody>

          <div className="form-container">

            <Stepper step={step} />

            {/* Progress */}
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <small>المرحلة {step} من 4</small>
                <small>{Math.round((step / 4) * 100)}%</small>
              </div>

              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${(step / 4) * 100}%` }}
                />
              </div>
            </div>
{step === 1 && (
  <div className="filter-box mb-4">

    {/* 🧾 عنوان المرحلة */}
    <div className="form-header">
      <h4>📁 بيانات الملف</h4>
      <span>المحكمة + مصدر الملف + المعلومات الأساسية</span>
    </div>

    <CForm>
      <CRow className="g-3">

        {/* المحكمة */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name="court"
            label="المحكمة"
            value={formData.court || ''}
            {...fieldProps("court")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, court: e.target.value }))
            }
          >
            <option value="">-- اختر --</option>
            {courts.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.court}
          </CFormFeedback>
        </CCol>

        {/* عدد الملف الأمني */}
        <CCol xs={12} md={6}>
          <CFormInput
            name="caseFileNumber"
            value={caseFileNumber}
            label="عدد الملف الأمني"
            readOnly
          />
        </CCol>

        {/* مصدر الملف */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name="source"
            label="مصدر الملف"
            value={formData.source || ''}
            {...fieldProps("source")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, source: e.target.value }))
            }
          >
            <option value="">-- اختر --</option>
            {sources.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.source}
          </CFormFeedback>
        </CCol>

        {/* نوع الملف */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name="fileType"
            label="نوع الملف"
            value={formData.fileType || ''}
            {...fieldProps("fileType")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, fileType: e.target.value }))
            }
          >
            <option value="">-- اختر --</option>
            {fileTypes.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.fileType}
          </CFormFeedback>
        </CCol>

        {/* تاريخ الملف */}
        <CCol xs={12} md={6}>
          <CFormInput
            name="fileDate"
            type="date"
            value={formData.fileDate || ''}
            label="تاريخ الملف"
            {...fieldProps("fileDate")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, fileDate: e.target.value }))
            }
          />

          <CFormFeedback invalid>
            ❌ {errors?.fileDate}
          </CFormFeedback>
        </CCol>

        {/* عدد التسجيل */}
        <CCol xs={12} md={6}>
          <CFormInput
            name="registryNumber"
            value={registryNumber}
            label="عدد التسجيل"
            readOnly
          />
        </CCol>

        {/* تاريخ ووقت التلقي */}
        <CCol xs={12} md={6}>
          <CFormInput
            name="tunisTime"
            value={tunisTime}
            label="تاريخ ووقت التلقي"
            readOnly
          />
        </CCol>

        {/* كاتب الضبط */}
        <CCol xs={12} md={6}>
          <CFormInput
            name="clerk"
            value={formData.clerk || ''}
            label="كاتب الضبط"
            {...fieldProps("clerk")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, clerk: e.target.value }))
            }
          />

          <CFormFeedback invalid>
            ❌ {errors?.clerk}
          </CFormFeedback>
        </CCol>

        {/* ملاحظات */}
        <CCol xs={12} md={6}>
          <CFormTextarea
            name="notes"
            value={formData.notes || ''}
            label="ملاحظات"
            {...fieldProps("notes")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, notes: e.target.value }))
            }
          />

          <CFormFeedback invalid>
            ❌ {errors?.notes}
          </CFormFeedback>
        </CCol>

        {/* الوثائق */}
        <CCol xs={12} md={6}>
          <CFormTextarea
            name="documents"
            value={formData.documents || ''}
            label="الوثائق المصاحبة"
            {...fieldProps("documents")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, documents: e.target.value }))
            }
          />

          <CFormFeedback invalid>
            ❌ {errors?.documents}
          </CFormFeedback>
        </CCol>

      </CRow>
    </CForm>

    {/* زر التالي */}
    <div className="d-flex justify-content-end mt-4">
      <CButton color="primary" onClick={() => handleNext(2)}>
        التالي ➡
      </CButton>
    </div>

  </div>
  )}
{step === 2 && (
  <div className="filter-box mb-4">

    {/* 🧾 عنوان المرحلة */}
    <div className="form-header text-end">
      <h4>📌 تفاصيل الواقعة</h4>
      <span>وصف الجريمة + التصنيف + المكان والزمان</span>
    </div>

    <CForm>
      <CRow className="g-3">

        {/* الموضوع */}
        <CCol xs={12}>
          <CFormInput
            name="subject"
            label="الموضوع"
            value={formData.subject || ''}
            {...fieldProps("subject")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, subject: e.target.value }))
            }
          />
          <CFormFeedback invalid>
            ❌ {errors?.subject}
          </CFormFeedback>
        </CCol>

        {/* التصنيف الجرمي */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name="crimeType"
            label="التصنيف الجرمي"
            value={formData.crimeType || ''}
            {...fieldProps("crimeType")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, crimeType: e.target.value }))
            }
          >
            <option value="">-- اختر --</option>
            {crimeCategories?.map((cat, i) => (
              <optgroup key={i} label={cat.label}>
                {cat.options?.map((o, j) => (
                  <option key={j} value={o}>{o}</option>
                ))}
              </optgroup>
            ))}
          </CFormSelect>

          <CFormFeedback invalid>
            ❌ {errors?.crimeType}
          </CFormFeedback>
        </CCol>

        {/* مكان الواقعة */}
        <CCol xs={12} md={6}>
          <CFormInput
            name="crimePlace"
            label="مكان الواقعة"
            value={formData.crimePlace || ''}
            {...fieldProps("crimePlace")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, crimePlace: e.target.value }))
            }
          />
          <CFormFeedback invalid>
            ❌ {errors?.crimePlace}
          </CFormFeedback>
        </CCol>

        {/* تاريخ الواقعة */}
        <CCol xs={12} md={6}>
          <CFormInput
            name="crimeDate"
            type="date"
            label="تاريخ الواقعة"
            value={formData.crimeDate || ''}
            {...fieldProps("crimeDate")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, crimeDate: e.target.value }))
            }
          />
          <CFormFeedback invalid>
            ❌ {errors?.crimeDate}
          </CFormFeedback>
        </CCol>

        {/* ملخص الوقائع */}
        <CCol xs={12}>
          <CFormTextarea
            name="summary"
            label="ملخص الوقائع"
            value={formData.summary || ''}
            {...fieldProps("summary")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, summary: e.target.value }))
            }
          />
          <CFormFeedback invalid>
            ❌ {errors?.summary}
          </CFormFeedback>
        </CCol>

        {/* AI */}
        <CCol xs={12}>
          <CFormTextarea
            name="aiSuggestion"
            label="اقتراح الذكاء الاصطناعي"
            value={formData.aiSuggestion || ''}
            {...fieldProps("aiSuggestion")}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, aiSuggestion: e.target.value }))
            }
          />
          <CFormFeedback invalid>
            ❌ {errors?.aiSuggestion}
          </CFormFeedback>
        </CCol>

      </CRow>
    </CForm>

    {/* 🔘 الأزرار */}
    <div className="d-flex justify-content-between mt-4">
      <CButton color="secondary" onClick={() => setStep(1)}>
        ⬅ رجوع
      </CButton>

      <CButton color="primary" onClick={() => handleNext(3)}>
        التالي ➡
      </CButton>
    </div>

  </div>
)}
  
{step === 3 && (
  <div>

    {/* 🧾 عنوان المرحلة */}
    <div className="form-header text-end mb-3">
      <h4>👥 الأطراف</h4>
      <span>بيانات الشاكي والمظنون فيه</span>
    </div>

    {/* 👤 الشاكي */}
    <div className="mb-4">
      <PersonForm
        title="👤 الشاكي"
        type="plaintiff"
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </div>

    {/* ⚠️ المظنون فيه */}
    <div className="mb-4">
      <PersonForm
        title="⚠️ المظنون فيه"
        type="suspect"
        formData={formData}
        setFormData={setFormData}
        errors={errors}
      />
    </div>

    {/* 🔘 Navigation */}
    <div className="d-flex justify-content-between align-items-center mt-4 px-2">

      <CButton
        color="secondary"
        className="px-4"
        onClick={() => setStep(2)}
      >
        ⬅ السابق
      </CButton>

      <div className="step-indicator">
        <span>خطوة 3 / 4</span>
      </div>

      <CButton
        color="primary"
        className="px-4"
        onClick={() => handleNext(4)}
      >
        التالي ➡
      </CButton>

    </div>

  </div>
)}
{step === 4 && (
  <div>

    <CForm>

      <div className="form-header text-end mb-3">
        <h4>⚖️ القرار والحالة النهائية</h4>
        <span>تسجيل الحكم + الحالة القانونية للقضية</span>
      </div>

      <div className="person-card mb-3">
        <CFormInput
          name="caseId"
          value={caseId}
          label="ID القضية"
          readOnly
        />
      </div>

      <div className="person-card mb-3">

        <h6 className="section-title text-end mb-3">
          📌 الحالة والقرار
        </h6>

        <CFormTextarea
          name="decisionText"
          value={formData.decisionText || ''}
          label="نص القرار"
          {...fieldProps("decisionText")}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              decisionText: e.target.value
            }))
          }
        />
        <CFormFeedback invalid>
          ✖ {errors?.decisionText}
        </CFormFeedback>

        <CFormInput
          name="decisionDate"
          type="date"
          value={formData.decisionDate || ''}
          label="تاريخ القرار"
          className="mt-3"
          {...fieldProps("decisionDate")}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              decisionDate: e.target.value
            }))
          }
        />
        <CFormFeedback invalid>
          ✖ {errors?.decisionDate}
        </CFormFeedback>

        <CFormTextarea
          name="lawText"
          value={formData.lawText || ''}
          label="النص القانوني"
          className="mt-3"
          {...fieldProps("lawText")}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              lawText: e.target.value
            }))
          }
        />
        <CFormFeedback invalid>
          ✖ {errors?.lawText}
        </CFormFeedback>

        <CFormSelect
          name="status"
          label="حالة القضية"
          value={formData.status || ''}
          className="mt-3"
          {...fieldProps("status")}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              status: e.target.value
            }))
          }
        >
          <option value="">-- اختر --</option>
          <option value="تسجيل">تسجيل</option>
          <option value="حفظ">حفظ</option>
          <option value="مجلس">مجلس</option>
          <option value="أطفال">أطفال</option>
          <option value="تحقيق">تحقيق</option>
          <option value="جناحي الناحية">جناحي الناحية</option>
          <option value="مخالفات">مخالفات</option>
          <option value="مضافة">مضافة</option>
          <option value="تعهد">تعهد</option>
          <option value="تنفيذ">تنفيذ</option>
          <option value="محال على قاضي الأسرة">محال على قاضي الأسرة</option>
          <option value="محال على القضاء المنفرد">محال على القضاء المنفرد</option>
          <option value="الصلح بالوساطة">الصلح بالوساطة</option>
          <option value="طور البحث">طور البحث</option>
          <option value="تخلي">تخلي</option>
        </CFormSelect>

        <CFormFeedback invalid>
          ✖ {errors?.status}
        </CFormFeedback>

        <CFormTextarea
          name="statusReason"
          value={formData.statusReason || ''}
          label="سبب الحالة"
          className="mt-3"
          {...fieldProps("statusReason")}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              statusReason: e.target.value
            }))
          }
        />
        <CFormFeedback invalid>
          ✖ {errors?.statusReason}
        </CFormFeedback>

      </div>

    </CForm>

    {/* 🔘 Navigation + Save */}
    <div className="d-flex justify-content-between align-items-center mt-4 px-2">

      <CButton
        color="secondary"
        className="px-4"
        onClick={() => setStep(3)}
      >
        ⬅ السابق
      </CButton>

      <div className="step-indicator">
        خطوة 4 / 4
      </div>

      <CButton
        color={isEdit ? "warning" : "success"}
        className="px-4"
        onClick={() => {
          const stepErrors = validateStep(4, formData)

          if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
          }

          setErrors({})
          handleSave()
        }}
      >
        {isEdit ? "✏️ حفظ التعديل" : "💾 إضافة القضية"}
      </CButton>

    </div>

  </div>
)}

  <CToast
  autohide={true}
  visible={toastVisible}
  onClose={() => setToastVisible(false)}
  delay={3000}
  className="position-fixed top-0 end-0 m-3"
>
  <CToastHeader closeButton>
    <strong className="me-auto">النظام</strong>
  </CToastHeader>

  <CToastBody>
    {toastMessage}
  </CToastBody>
</CToast>
<CModal
  visible={showSuccessModal}
  onClose={() => setShowSuccessModal(false)}
  alignment="center"
  backdrop="static"
  className="success-modal"
>
  <CModalBody className="text-center p-5">

    {/* 🎉 Confetti بسيط */}
    <div className="confetti">🎉🎊✨</div>

    {/* ✅ Animated Check */}
    <div className="check-wrapper">
      <div className="check-circle">
        <span className="check-icon">✔</span>
      </div>
    </div>

    {/* الرسالة */}
    <h4 className="mt-3 fw-bold">
      تم حفظ القضية بنجاح
    </h4>

    <p className="text-muted">
      جاري الانتقال إلى صفحة عرض القضايا...
    </p>

    {/* Spinner */}
              <div className="d-flex justify-content-center mt-3">
                <div className="spinner-border text-success" />
              </div>

            </CModalBody>
          </CModal>

        </div> {/* form-container */}

      </CCardBody>
    </CCard>

  </div> {/* form-bg */}

</FormWrapper>
)

}

export default CaseForm




