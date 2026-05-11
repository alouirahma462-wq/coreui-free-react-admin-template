import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import FormWrapper from "../../components/FormWrapper"

import {
  CCard,
  CCardBody,
  CForm,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CModal,
  CModalBody,
  CToast,
  CToastHeader,
  CToastBody,
  CFormFeedback
} from '@coreui/react'

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
// 🧠 Helper Function
// =======================
const getTunisDateTime = () => {
  return new Date().toLocaleString('fr-TN', {
    timeZone: 'Africa/Tunis',
    dateStyle: 'short',
    timeStyle: 'short'
  })
}


// =======================
// 🧭 Stepper Component (FIXED)
// =======================
const STEPS = [
  "بيانات الملف",
  "تفاصيل الواقعة",
  "الأطراف",
  "القرار"
]

const Stepper = ({ step }) => {
  return (
    <div className="custom-stepper mb-4">
      <div className="stepper-line" />

      {STEPS.map((label, index) => {
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
const PersonForm = ({ title, type, formData, setFormData, errors, locations }) => {

  // =======================
  // 🧠 SAFE PERSON (FIXED EDIT MODE BUG)
  // =======================
  const rawPerson = formData?.[type] || {}

  const person = {
    fullName: rawPerson.fullName ?? '',
    gender: rawPerson.gender ?? '',
    nationality: rawPerson.nationality ?? '',
    birthDate: rawPerson.birthDate ?? '',
    birthState: rawPerson.birthState ?? '',
    birthDelegation: rawPerson.birthDelegation ?? '',
    resState: rawPerson.resState ?? '',
    resDelegation: rawPerson.resDelegation ?? '',
    education: rawPerson.education ?? '',
    job: rawPerson.job ?? '',
    notes: rawPerson.notes ?? '',
    statement: rawPerson.statement ?? '',
    aiSuggestion: rawPerson.aiSuggestion ?? ''
  }

  // =======================
  // 🧠 SAFE NORMALIZER (FIX SELECT BUGS)
  // =======================
  const normalize = (v) => (v ?? '').toString().trim().toLowerCase()

  const birthLocation = Array.isArray(locations)
    ? locations.find(
        l => normalize(l?.state) === normalize(person.birthState)
      )
    : null

  const resLocation = Array.isArray(locations)
    ? locations.find(
        l => normalize(l?.state) === normalize(person.resState)
      )
    : null

  // =======================
  // 🧠 FIXED VALIDATION KEY (IMPORTANT)
  // =======================
  const isInvalid = (field) => !!errors?.[`${type}.${field}`]

  // =======================
  // 🔁 SAFE UPDATE (NO RESET BUG)
  // =======================
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...(prev?.[type] || {}),
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
            value={person.fullName}
            invalid={isInvalid('fullName')}
            onChange={e => updateField('fullName', e.target.value)}
          />
        </CCol>

        {/* الجنس */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.gender`}
            label="الجنس"
            value={person.gender}
            invalid={isInvalid('gender')}
            onChange={e => updateField('gender', e.target.value)}
          >
            <option value="">-- اختر --</option>
            {genders?.map((g, i) => (
              <option key={i} value={g}>{g}</option>
            ))}
          </CFormSelect>
        </CCol>

        {/* الجنسية */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.nationality`}
            label="الجنسية"
            value={person.nationality}
            invalid={isInvalid('nationality')}
            onChange={e => updateField('nationality', e.target.value)}
          >
            <option value="">-- اختر --</option>
            {nationalities?.map((n, i) => (
              <option key={i} value={n}>{n}</option>
            ))}
          </CFormSelect>
        </CCol>

        {/* تاريخ الولادة */}
        <CCol xs={12} md={6}>
          <CFormInput
            type="date"
            name={`${type}.birthDate`}
            label="تاريخ الولادة"
            value={person.birthDate}
            onChange={e => updateField('birthDate', e.target.value)}
          />
        </CCol>

        {/* ولاية الولادة */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.birthState`}
            label="ولاية الولادة"
            value={person.birthState}
            onChange={e => updateField('birthState', e.target.value)}
          >
            <option value="">-- اختر --</option>
            {locations?.map((l, i) => (
              <option key={i} value={l?.state}>
                {l?.state}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        {/* معتمدية الولادة */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.birthDelegation`}
            label="معتمدية الولادة"
            value={person.birthDelegation}
            onChange={e => updateField('birthDelegation', e.target.value)}
          >
            <option value="">-- اختر --</option>
            {birthLocation?.delegations?.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </CFormSelect>
        </CCol>

        {/* ولاية السكن */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.resState`}
            label="ولاية السكن"
            value={person.resState}
            onChange={e => updateField('resState', e.target.value)}
          >
            <option value="">-- اختر --</option>
            {locations?.map((l, i) => (
              <option key={i} value={l?.state}>
                {l?.state}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        {/* معتمدية السكن */}
        <CCol xs={12} md={6}>
          <CFormSelect
            name={`${type}.resDelegation`}
            label="معتمدية السكن"
            value={person.resDelegation}
            onChange={e => updateField('resDelegation', e.target.value)}
          >
            <option value="">-- اختر --</option>
            {resLocation?.delegations?.map((d, i) => (
              <option key={i} value={d}>{d}</option>
            ))}
          </CFormSelect>
        </CCol>

        {/* التعليم */}
        <CCol xs={12} md={6}>
          <CFormInput
            name={`${type}.education`}
            label="المستوى التعليمي"
            value={person.education}
            onChange={e => updateField('education', e.target.value)}
          />
        </CCol>

        {/* المهنة */}
        <CCol xs={12} md={6}>
          <CFormInput
            name={`${type}.job`}
            label="المهنة"
            value={person.job}
            onChange={e => updateField('job', e.target.value)}
          />
        </CCol>

        {/* ملاحظات */}
        <CCol xs={12}>
          <CFormTextarea
            name={`${type}.notes`}
            label="ملاحظات"
            value={person.notes}
            onChange={e => updateField('notes', e.target.value)}
          />
        </CCol>

        {/* إفادة */}
        <CCol xs={12}>
          <CFormTextarea
            name={`${type}.statement`}
            label="الإفادة"
            value={person.statement}
            onChange={e => updateField('statement', e.target.value)}
          />
        </CCol>

        {/* AI */}
        <CCol xs={12}>
          <CFormTextarea
            name={`${type}.aiSuggestion`}
            label="اقتراحات الذكاء الاصطناعي"
            value={person.aiSuggestion}
            onChange={e => updateField('aiSuggestion', e.target.value)}
          />
        </CCol>

      </CRow>
    </div>
  )
}
const CaseForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
 const isEdit = !!id
const safeValue = (v) => (v ? String(v).trim() : '')

const safeDateValue = (v) =>
  (v ? String(v).split('T')[0] : '')

const safeArray = (arr) =>
  Array.isArray(arr) ? arr : []

  // =======================
  // 🧠 FIX: move OUTSIDE render cycle (stable reference)
  // =======================
  const initialFormState = useMemo(() => ({
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
  }), [])

  // =======================
  // STATE
  // =======================
  const [formData, setFormData] = useState(initialFormState)
  const [editData, setEditData] = useState(null)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  const timerRef = useRef(null)

  // =======================
  // 🆔 Case ID SAFE
  // =======================
const caseId = useMemo(() => {
  if (isEdit && formData?.case_id) return formData.case_id
  return 'CASE-' + Date.now()
}, [isEdit, formData?.case_id])
useEffect(() => {
  let isMounted = true

  const loadCase = async () => {
    setLoading(true)

    if (!id) {
      if (!isMounted) return

      setCaseFileNumber('CASE-' + Date.now())
      setRegistryNumber('REG-' + Date.now())
      setFormData(initialFormState)

      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('cases')
      .select('*')
      .eq('id', id)
      .single()

    if (!isMounted) return

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    if (data) {
      setEditData(data)

      const safeDate = (d) =>
        d ? String(d).split('T')[0] : ''

      const mappedData = {
        case_id: data.case_id ?? '',   // 🔥 ADD THIS (IMPORTANT FIX)
        court: data.court ?? '',
        source: data.source ?? '',
        fileType: data.file_type ?? '',
        fileDate: safeDate(data.file_date),
        clerk: data.clerk ?? '',
        notes: data.notes ?? '',
        documents: data.documents ?? '',
        subject: data.subject ?? '',
        crimeType: data.crime_type ?? '',
        crimePlace: data.crime_place ?? '',
        crimeDate: safeDate(data.crime_date),
        summary: data.summary ?? '',
        aiSuggestion: data.ai_suggestion ?? '',
        status: data.status ?? '',
        statusReason: data.status_reason ?? '',
        decisionText: data.decision_text ?? '',
        decisionDate: safeDate(data.decision_date),
        lawText: data.law_text ?? '',
        plaintiff: data.plaintiff ?? {},
        suspect: data.suspect ?? {}
      }

      setFormData(() => mappedData)

      setCaseFileNumber(data.security_files || '')
      setRegistryNumber(data.registrations || '')
    }

    setLoading(false)
  }

  loadCase()

  return () => {
    isMounted = false
  }
}, [id])
  const isInvalid = field => !!errors?.[field]

const validateStep = (step, formData = {}) => {
  const validationErrors = {}

  // 🧠 SAFE CHECK (covers string + null + undefined + arrays)
  const isEmpty = (v) => {
    if (v === undefined || v === null) return true

    if (typeof v === 'string') return v.trim() === ''

    if (Array.isArray(v)) return v.length === 0

    if (typeof v === 'object') return Object.keys(v).length === 0

    return false
  }

  // =========================
  // STEP 1
  // =========================
  if (step === 1) {
    const requiredFields = {
      court: "المحكمة مطلوبة",
      source: "مصدر الملف مطلوب",
      fileType: "نوع الملف مطلوب",
      fileDate: "تاريخ الملف مطلوب",
      clerk: "كاتب الضبط مطلوب",
      notes: "الملاحظات مطلوبة",
      documents: "الوثائق المصاحبة مطلوبة"
    }

    Object.entries(requiredFields).forEach(([field, msg]) => {
      if (isEmpty(formData?.[field])) {
        validationErrors[field] = msg
      }
    })
  }

  // =========================
  // STEP 2
  // =========================
  if (step === 2) {
    const requiredFields = {
      subject: "الموضوع مطلوب",
      crimeType: "التصنيف الجرمي مطلوب",
      crimePlace: "مكان الواقعة مطلوب",
      crimeDate: "تاريخ الواقعة مطلوب",
      summary: "ملخص الوقائع مطلوب",
      aiSuggestion: "اقتراح AI مطلوب"
    }

    Object.entries(requiredFields).forEach(([field, msg]) => {
      if (isEmpty(formData?.[field])) {
        validationErrors[field] = msg
      }
    })
  }

  // =========================
  // STEP 3
  // =========================
  if (step === 3) {
    const checkPerson = (p = {}, key) => {
      const required = {
        fullName: "الاسم الكامل مطلوب",
        gender: "الجنس مطلوب",
        nationality: "الجنسية مطلوبة",
        birthDate: "تاريخ الولادة مطلوب",
        birthState: "ولاية الولادة مطلوبة",
        birthDelegation: "معتمدية الولادة مطلوبة",
        resState: "ولاية السكن مطلوبة",
        resDelegation: "معتمدية السكن مطلوبة",
        education: "المستوى التعليمي مطلوب",
        job: "المهنة مطلوبة",
        notes: "ملاحظات مطلوبة",
        statement: "الإفادة مطلوبة"
      }

      Object.entries(required).forEach(([field, msg]) => {
        const value = p?.[field]

        if (isEmpty(value)) {
          validationErrors[`${key}.${field}`] = msg
        }
      })
    }

    checkPerson(formData?.plaintiff || {}, "plaintiff")
    checkPerson(formData?.suspect || {}, "suspect")
  }

  // =========================
  // STEP 4
  // =========================
  if (step === 4) {
    const requiredFields = {
      decisionText: "نص القرار مطلوب",
      decisionDate: "تاريخ القرار مطلوب",
      lawText: "النص القانوني مطلوب",
      status: "حالة القضية مطلوبة",
      statusReason: "سبب الحالة مطلوب"
    }

    Object.entries(requiredFields).forEach(([field, msg]) => {
      if (isEmpty(formData?.[field])) {
        validationErrors[field] = msg
      }
    })
  }

  return validationErrors
}

const handleNext = (nextStep) => {
  // 🟢 validate CURRENT step (correct behavior)
  const stepErrors = validateStep(step, formData)

  if (Object.keys(stepErrors).length > 0) {
    setErrors(stepErrors)

    const firstErrorKey = Object.keys(stepErrors)[0]

    // 🧠 safer selector (handles dots + special chars)
    const el =
      document.querySelector(`[name="${firstErrorKey}"]`) ||
      document.querySelector(`[name='${firstErrorKey}']`)

    if (el) {
      setTimeout(() => {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        })

        // ⚠️ focus only if possible
        if (typeof el.focus === "function") {
          el.focus()
        }
      }, 50)
    }

    return
  }

  setErrors({})
  setStep(nextStep)

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  })
}

// =======================
// ✅ STATES (FIXED SAFE EDIT MODE)
// =======================
const [showSuccessModal, setShowSuccessModal] = useState(false)
const [caseFileNumber, setCaseFileNumber] = useState('')
const [registryNumber, setRegistryNumber] = useState('')

const initializedRef = useRef(false)
const getTunisDate = () => {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'Africa/Tunis'
  })
}

const [toastVisible, setToastVisible] = useState(false)
const [toastMessage, setToastMessage] = useState('')

useEffect(() => {
  if (!isEdit || !editData) return

  // 🧠 يمنع إعادة التحميل أكثر من مرة
  if (initializedRef.current) return
  initializedRef.current = true

  const safeDate = (d) =>
    d ? String(d).split('T')[0] : ''

  const mapped = {
    court: editData.court ?? '',
    fileType: editData.file_type ?? '',
    source: editData.source ?? '',
    fileDate: safeDate(editData.file_date),

    clerk: editData.clerk ?? '',
    notes: editData.notes ?? '',
    documents: editData.documents ?? '',

    subject: editData.subject ?? '',
    crimeType: editData.crime_type ?? '',
    crimePlace: editData.crime_place ?? '',
    crimeDate: safeDate(editData.crime_date),

    summary: editData.summary ?? '',
    aiSuggestion: editData.ai_suggestion ?? '',

    status: editData.status ?? '',
    statusReason: editData.status_reason ?? '',

    decisionText: editData.decision_text ?? '',
    decisionDate: safeDate(editData.decision_date),
    lawText: editData.law_text ?? '',

    plaintiff: {
      ...(editData.plaintiff || {})
    },

    suspect: {
      ...(editData.suspect || {})
    }
  }

  setFormData(prev => ({
    ...prev,
    ...mapped
  }))
}, [isEdit, editData])

const handleSave = async () => {
  try {
    const safeJSON = (obj) => {
      try {
        return JSON.parse(JSON.stringify(obj || {}))
      } catch {
        return {}
      }
    }

    const safeDate = (d) =>
      d ? new Date(d).toISOString() : null

    const normalizedCase = {
      case_id: caseId,

      // 🧠 بيانات أساسية
      court: formData?.court || '',
      source: formData?.source || '',
      file_type: formData?.fileType || '',
      file_date: safeDate(formData?.fileDate),
      clerk: formData?.clerk || '',
      notes: formData?.notes || '',
      documents: formData?.documents || '',

      // 🧠 الواقعة
      subject: formData?.subject || '',
      crime_type: formData?.crimeType || '',
      crime_place: formData?.crimePlace || '',
      crime_date: safeDate(formData?.crimeDate),
      summary: formData?.summary || '',
      ai_suggestion: formData?.aiSuggestion || '',

      // 👥 JSONB SAFE
      plaintiff: safeJSON(formData?.plaintiff),
      suspect: safeJSON(formData?.suspect),

      // 📁 أرقام
      security_files: caseFileNumber || '',
      registrations: registryNumber || '',

      // ⚖️ القرار
      status: formData?.status || '',
      status_reason: formData?.statusReason || '',
      decision_text: formData?.decisionText || '',
      decision_date: safeDate(formData?.decisionDate),
      law_text: formData?.lawText || '',

      // 🕒 timestamps
      created_at: isEdit
        ? editData?.created_at
        : new Date().toISOString(),

      last_update: new Date().toISOString()
    }

    let response

    if (isEdit) {
      response = await supabase
        .from('cases')
        .update(normalizedCase)
        .eq('id', editData.id)
    } else {
      response = await supabase
        .from('cases')
        .insert([normalizedCase])
    }

    const { error } = response

    if (error) {
      console.error('Supabase error:', error)
      setToastMessage('❌ خطأ أثناء الحفظ')
      setToastVisible(true)
      return
    }

    setToastMessage(
      isEdit
        ? '✏️ تم تعديل القضية بنجاح'
        : '✅ تم حفظ القضية بنجاح'
    )

    setShowSuccessModal(true)

    setTimeout(() => {
      setShowSuccessModal(false)
      navigate('/cases') // 🔥 مهم: refresh list بعد الحفظ
    }, 1500)

  } catch (err) {
    console.error(err)
    setToastMessage('❌ خطأ غير متوقع')
    setToastVisible(true)
  }
}


const tunisTime = getTunisDateTime()

if (loading) {
  return <div>Loading...</div>
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
                        value={safeValue(formData?.court)}
                        invalid={!!errors?.court}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            court: e.target.value
                          }))
                        }
                      >
                        <option value="">-- اختر --</option>
                        {courts?.map((c, i) => (
                          <option key={i} value={c}>
                            {c}
                          </option>
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
                        label="عدد الملف الأمني"
                        value={safeValue(caseFileNumber)}
                        readOnly
                      />
                    </CCol>

                    {/* مصدر الملف */}
                    <CCol xs={12} md={6}>
                      <CFormSelect
                        name="source"
                        label="مصدر الملف"
                        value={safeValue(formData?.source)}
                        invalid={!!errors?.source}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            source: e.target.value
                          }))
                        }
                      >
                        <option value="">-- اختر --</option>
                        {sources?.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
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
                        value={safeValue(formData?.fileType)}
                        invalid={!!errors?.fileType}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            fileType: e.target.value
                          }))
                        }
                      >
                        <option value="">-- اختر --</option>
                        {fileTypes?.map((t, i) => (
                          <option key={i} value={t}>
                            {t}
                          </option>
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
                        label="تاريخ الملف"
                        value={safeDateValue(formData?.fileDate)}
                        invalid={!!errors?.fileDate}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            fileDate: e.target.value
                          }))
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
                        label="عدد التسجيل"
                        value={safeValue(registryNumber)}
                        readOnly
                      />
                    </CCol>

                    {/* وقت تونس */}
                    <CCol xs={12} md={6}>
                      <CFormInput
                        name="tunisTime"
                        label="تاريخ ووقت التلقي"
                        value={tunisTime}
                        readOnly
                      />
                    </CCol>

                    {/* كاتب الضبط */}
                    <CCol xs={12} md={6}>
                      <CFormInput
                        name="clerk"
                        label="كاتب الضبط"
                        value={safeValue(formData?.clerk)}
                        invalid={!!errors?.clerk}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            clerk: e.target.value
                          }))
                        }
                      />

                      <CFormFeedback invalid>
                        ❌ {errors?.clerk}
                      </CFormFeedback>
                    </CCol>

                    {/* الملاحظات */}
                    <CCol xs={12} md={6}>
                      <CFormTextarea
                        name="notes"
                        label="ملاحظات"
                        value={safeValue(formData?.notes)}
                        invalid={!!errors?.notes}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            notes: e.target.value
                          }))
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
                        label="الوثائق المصاحبة"
                        value={safeValue(formData?.documents)}
                        invalid={!!errors?.documents}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            documents: e.target.value
                          }))
                        }
                      />

                      <CFormFeedback invalid>
                        ❌ {errors?.documents}
                      </CFormFeedback>
                    </CCol>

                  </CRow>
                </CForm>

                {/* Navigation */}
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
            value={safeValue(formData?.subject)}
            invalid={!!errors?.subject}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                subject: e.target.value
              }))
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
            value={safeValue(formData?.crimeType)}
            invalid={!!errors?.crimeType}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                crimeType: e.target.value
              }))
            }
          >
            <option value="">-- اختر --</option>

            {Array.isArray(crimeCategories) &&
              crimeCategories.map((cat, i) => (
                <optgroup key={i} label={cat?.label || ''}>
                  {Array.isArray(cat?.options) &&
                    cat.options.map((o, j) => (
                      <option key={j} value={o}>
                        {o}
                      </option>
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
            value={safeValue(formData?.crimePlace)}
            invalid={!!errors?.crimePlace}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                crimePlace: e.target.value
              }))
            }
          />
          <CFormFeedback invalid>
            ❌ {errors?.crimePlace}
          </CFormFeedback>
        </CCol>

        {/* تاريخ الواقعة */}
        <CCol xs={12} md={6}>
          <CFormInput
            type="date"
            name="crimeDate"
            label="تاريخ الواقعة"
            value={safeDateValue(formData?.crimeDate)}
            invalid={!!errors?.crimeDate}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                crimeDate: e.target.value
              }))
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
            value={safeValue(formData?.summary)}
            invalid={!!errors?.summary}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                summary: e.target.value
              }))
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
            value={safeValue(formData?.aiSuggestion)}
            invalid={!!errors?.aiSuggestion}
            onChange={(e) =>
              setFormData(prev => ({
                ...prev,
                aiSuggestion: e.target.value
              }))
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
        formData={{
          ...formData,
          plaintiff: formData?.plaintiff || {}
        }}
        setFormData={setFormData}
        errors={errors || {}}
        locations={safeArray(locations)}
      />
    </div>

    {/* ⚠️ المظنون فيه */}
    <div className="mb-4">
      <PersonForm
        title="⚠️ المظنون فيه"
        type="suspect"
        formData={{
          ...formData,
          suspect: formData?.suspect || {}
        }}
        setFormData={setFormData}
        errors={errors || {}}
        locations={safeArray(locations)}
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

      {/* ID القضية */}
      <div className="person-card mb-3">
        <CFormInput
          name="caseId"
          value={safeValue(caseId)}
          label="ID القضية"
          readOnly
        />
      </div>

      <div className="person-card mb-3">

        <h6 className="section-title text-end mb-3">
          📌 الحالة والقرار
        </h6>

        {/* القرار */}
        <CFormTextarea
          name="decisionText"
          value={safeValue(formData?.decisionText)}
          label="نص القرار"
          invalid={!!errors?.decisionText}
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

        {/* تاريخ القرار */}
        <CFormInput
          name="decisionDate"
          type="date"
          value={safeDateValue(formData?.decisionDate)}
          label="تاريخ القرار"
          className="mt-3"
          invalid={!!errors?.decisionDate}
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

        {/* النص القانوني */}
        <CFormTextarea
          name="lawText"
          value={safeValue(formData?.lawText)}
          label="النص القانوني"
          className="mt-3"
          invalid={!!errors?.lawText}
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

        {/* حالة القضية */}
        <CFormSelect
          name="status"
          label="حالة القضية"
          value={safeValue(formData?.status)}
          className="mt-3"
          invalid={!!errors?.status}
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

        {/* سبب الحالة */}
        <CFormTextarea
          name="statusReason"
          value={safeValue(formData?.statusReason)}
          label="سبب الحالة"
          className="mt-3"
          invalid={!!errors?.statusReason}
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

            const firstErrorKey = Object.keys(stepErrors)[0]

            const el = document.querySelector(
              `[name="${CSS.escape(firstErrorKey)}"]`
            )

            if (el) {
              el.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              })
              el.focus()
            }

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
  visible={toastVisible}
  autohide
  delay={3000}
  onClose={() => setToastVisible(false)}
  className="position-fixed top-0 end-0 m-3"
>
  <CToastHeader closeButton>
    <strong className="me-auto">
      النظام
    </strong>
  </CToastHeader>

  <CToastBody>
    {toastMessage || ''}
  </CToastBody>
</CToast>

<CModal
  visible={showSuccessModal}
  alignment="center"
  backdrop="static"
  onClose={() => setShowSuccessModal(false)}
  className="success-modal"
>
  <CModalBody className="text-center p-5">

    {/* 🎉 تأثير */}
    <div className="confetti">
      🎉 🎊 ✨
    </div>

    {/* ✅ أيقونة */}
    <div className="check-wrapper">
      <div className="check-circle">
        <span className="check-icon">✔</span>
      </div>
    </div>

    {/* 📝 الرسالة */}
    <h4 className="mt-3 fw-bold">
      {isEdit
        ? 'تم تعديل القضية بنجاح'
        : 'تم حفظ القضية بنجاح'}
    </h4>

    <p className="text-muted">
      جاري الانتقال إلى صفحة القضايا...
    </p>

    {/* ⏳ Loader */}
    <div className="d-flex justify-content-center mt-3">
      <div
        className="spinner-border text-success"
        role="status"
      >
        <span className="visually-hidden">
          Loading...
        </span>
      </div>
    </div>

  </CModalBody>
</CModal>

        </div>
      </CCardBody>
    </CCard>
  </div>
</FormWrapper>
)
}

export default CaseForm




