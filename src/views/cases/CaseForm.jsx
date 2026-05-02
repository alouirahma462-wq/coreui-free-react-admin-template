import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import FormWrapper from "../../components/FormWrapper"

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
// 🧭 Stepper Component
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
const active = step === current
const done = step >= current


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

const getTunisDateTime = () =>
  new Date().toLocaleString('fr-TN', {
    timeZone: 'Africa/Tunis'
  })

const generateCaseId = () =>
  'CASE-' + Date.now()

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

  return (
 <div className="person-card">

    {/* 🧾 عنوان الشخص */}
    <h6 className="section-title">{title}</h6>

    <CRow className="g-3">

      {/* الاسم الكامل */}
      <CCol xs={12} md={6}>
        <CFormInput
          label="الاسم الكامل"
          value={person.fullName || ''}
          invalid={!!errors?.[`${type}.fullName`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                fullName: e.target.value
              }
            }))
          }
        />
        <CFormFeedback invalid>
          ❌ {errors?.[`${type}.fullName`]}
        </CFormFeedback>
      </CCol>

      {/* الجنس */}
      <CCol xs={12} md={6}>
        <CFormSelect
          label="الجنس"
          value={person.gender || ''}
          invalid={!!errors?.[`${type}.gender`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                gender: e.target.value
              }
            }))
          }
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
          label="الجنسية"
          value={person.nationality || ''}
          invalid={!!errors?.[`${type}.nationality`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                nationality: e.target.value
              }
            }))
          }
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
          label="تاريخ الولادة"
          value={person.birthDate || ''}
          invalid={!!errors?.[`${type}.birthDate`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                birthDate: e.target.value
              }
            }))
          }
        />

        <CFormFeedback invalid>
          ❌ {errors?.[`${type}.birthDate`]}
        </CFormFeedback>
      </CCol>

      {/* ولاية الولادة */}
      <CCol xs={12} md={6}>
        <CFormSelect
          label="مكان الولادة (ولاية)"
          value={person.birthState || ''}
          invalid={!!errors?.[`${type}.birthState`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                birthState: e.target.value
              }
            }))
          }
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
          label="مكان الولادة (معتمدية)"
          value={person.birthDelegation || ''}
          invalid={!!errors?.[`${type}.birthDelegation`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                birthDelegation: e.target.value
              }
            }))
          }
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
          label="مكان السكن (ولاية)"
          value={person.resState || ''}
          invalid={!!errors?.[`${type}.resState`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                resState: e.target.value
              }
            }))
          }
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
          label="مكان السكن (معتمدية)"
          value={person.resDelegation || ''}
          invalid={!!errors?.[`${type}.resDelegation`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                resDelegation: e.target.value
              }
            }))
          }
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
          label="المستوى التعليمي"
          value={person.education || ''}
          invalid={!!errors?.[`${type}.education`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                education: e.target.value
              }
            }))
          }
        />

        <CFormFeedback invalid>
          ❌ {errors?.[`${type}.education`]}
        </CFormFeedback>
      </CCol>

      {/* المهنة */}
      <CCol xs={12} md={6}>
        <CFormInput
          label="المهنة"
          value={person.job || ''}
          invalid={!!errors?.[`${type}.job`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                job: e.target.value
              }
            }))
          }
        />

        <CFormFeedback invalid>
          ❌ {errors?.[`${type}.job`]}
        </CFormFeedback>
      </CCol>

      {/* ملاحظات */}
      <CCol xs={12}>
        <CFormTextarea
          label="ملاحظات إضافية"
          value={person.notes || ''}
          invalid={!!errors?.[`${type}.notes`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                notes: e.target.value
              }
            }))
          }
        />

        <CFormFeedback invalid>
          ❌ {errors?.[`${type}.notes`]}
        </CFormFeedback>
      </CCol>

      {/* الإفادة */}
      <CCol xs={12}>
        <CFormTextarea
          label="الإفادة (حسب الدور)"
          value={person.statement || ''}
          invalid={!!errors?.[`${type}.statement`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                statement: e.target.value
              }
            }))
          }
        />

        <CFormFeedback invalid>
          ❌ {errors?.[`${type}.statement`]}
        </CFormFeedback>
      </CCol>

      {/* 🤖 اقتراحات الذكاء الاصطناعي (الإضافة الجديدة) */}
      <CCol xs={12}>
        <CFormTextarea
          label="اقتراحات الذكاء الاصطناعي"
          value={person.aiSuggestion || ''}
          invalid={!!errors?.[`${type}.aiSuggestion`]}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              [type]: {
                ...(prev[type] || {}),
                aiSuggestion: e.target.value
              }
            }))
          }
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
const [step, setStep] = useState(1)
const [errors, setErrors] = useState({})  
const timerRef = useRef(null) 
useEffect(() => {
  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }
}, [])
  
const validateStep = (step, formData) => {
  const validationErrors = {}

  // =========================
  // 🟦 STEP 1
  // =========================
  if (step === 1) {
    if (!formData.court) errors.court = "المحكمة مطلوبة"
    if (!formData.source) errors.source = "مصدر الملف مطلوب"
    if (!formData.fileType) errors.fileType = "نوع الملف مطلوب"
    if (!formData.fileDate) errors.fileDate = "تاريخ الملف مطلوب"
    if (!formData.clerk) errors.clerk = "كاتب الضبط مطلوب"
    if (!formData.notes) errors.notes = "الملاحظات مطلوبة"
    if (!formData.documents) errors.documents = "الوثائق المصاحبة مطلوبة"
  }

  // =========================
  // 🟦 STEP 2
  // =========================
  if (step === 2) {
    if (!formData.subject) errors.subject = "الموضوع مطلوب"
    if (!formData.crimeType) errors.crimeType = "التصنيف الجرمي مطلوب"
    if (!formData.crimePlace) errors.crimePlace = "مكان الواقعة مطلوب"
    if (!formData.crimeDate) errors.crimeDate = "تاريخ الواقعة مطلوب"
    if (!formData.summary) errors.summary = "ملخص الوقائع مطلوب"
    if (!formData.aiSuggestion) errors.aiSuggestion = "اقتراح AI مطلوب"
  }

  // =========================
  // 🟦 STEP 3
  // =========================
  if (step === 3) {

    const checkPerson = (p = {}, key) => {
      if (!p?.fullName) errors[`${key}.fullName`] = "الاسم الكامل مطلوب"
      if (!p?.gender) errors[`${key}.gender`] = "الجنس مطلوب"
      if (!p?.nationality) errors[`${key}.nationality`] = "الجنسية مطلوبة"
      if (!p?.birthDate) errors[`${key}.birthDate`] = "تاريخ الولادة مطلوب"
      if (!p?.birthState) errors[`${key}.birthState`] = "ولاية الولادة مطلوبة"
      if (!p?.birthDelegation) errors[`${key}.birthDelegation`] = "معتمدية الولادة مطلوبة"
      if (!p?.resState) errors[`${key}.resState`] = "ولاية السكن مطلوبة"
      if (!p?.resDelegation) errors[`${key}.resDelegation`] = "معتمدية السكن مطلوبة"
      if (!p?.education) errors[`${key}.education`] = "المستوى التعليمي مطلوب"
      if (!p?.job) errors[`${key}.job`] = "المهنة مطلوبة"
      if (!p?.notes) errors[`${key}.notes`] = "ملاحظات مطلوبة"
      if (!p?.statement) errors[`${key}.statement`] = "الإفادة مطلوبة"

      // ⚠️ تم حذف aiSuggestion من STEP 3 لأنه غالباً خطأ تصميم
    }
checkPerson(formData.plaintiff || {}, "plaintiff")
checkPerson(formData.suspect || {}, "suspect")

  }

  // =========================
  // 🟦 STEP 4
  // =========================
  if (step === 4) {
    if (!formData.decisionText) errors.decisionText = "نص القرار مطلوب"
    if (!formData.decisionDate) errors.decisionDate = "تاريخ القرار مطلوب"
    if (!formData.lawText) errors.lawText = "النص القانوني مطلوب"
    if (!formData.status) errors.status = "حالة القضية مطلوبة"
    if (!formData.statusReason) errors.statusReason = "سبب الحالة مطلوب"
  }

  return errors
}

const handleNext = (nextStep) => {
  const stepErrors = validateStep(step, formData)

  if (Object.keys(stepErrors).length > 0) {
    setErrors(stepErrors)
   const scrollTop = () =>
  window.scrollTo({ top: 0, behavior: 'smooth' })

    return
  }

  setErrors({})
  setStep(nextStep)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
  
const [showSuccessModal, setShowSuccessModal] = useState(false)
const [caseFileNumber] = useState(generateCaseFileNumber())
const [registryNumber] = useState(generateRegistryNumber())
const [tunisTime] = useState(getTunisDateTime())
const [caseId] = useState(generateCaseId())
const [toastVisible, setToastVisible] = useState(false)
const [toastMessage, setToastMessage] = useState('') 

  const [formData, setFormData] = useState({
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
  })

const handleSave = () => {
  try {
    const existing = JSON.parse(localStorage.getItem('cases') || '[]')

    const normalizedCase = {
      ...formData,
      caseFileNumber,
      registryNumber,
      caseId,
      fileDate: formData.fileDate,
      subject: formData.subject,
      status: formData.status,
      source: formData.source,
      fileType: formData.fileType,
      createdAt: tunisTime,

      plaintiffGender: formData.plaintiff?.gender,
      plaintiffNationality: formData.plaintiff?.nationality,
      plaintiffBirthDate: formData.plaintiff?.birthDate,
      plaintiffState: formData.plaintiff?.birthState,
      plaintiffResState: formData.plaintiff?.resState,

      suspectGender: formData.suspect?.gender,
      suspectNationality: formData.suspect?.nationality,
      suspectBirthDate: formData.suspect?.birthDate,
      suspectState: formData.suspect?.birthState,
      suspectResState: formData.suspect?.resState,
    }

    existing.push(normalizedCase)
    localStorage.setItem('cases', JSON.stringify(existing))

    setToastMessage('✅ تم حفظ القضية بنجاح')
    setToastVisible(true)

    // 🟢 تأكيد نجاح + مودال
    setShowSuccessModal(true)

    // 🔥 تنظيف أي timeout قديم قبل إنشاء جديد
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(() => {
      setShowSuccessModal(false)
      navigate('/cases')
    }, 2500)

    // ♻️ reset form
    setFormData({
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
    })

  } catch (err) {
    console.error('Save Error:', err)
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
  <>
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
              label="المحكمة"
              value={formData.court || ''}
              invalid={!!errors?.court}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, court: e.target.value }))
              }
            >
              <option value="">-- اختر --</option>
              {courts.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </CFormSelect>

            {errors?.court && (
              <CFormFeedback invalid>
                ❌ {errors.court}
              </CFormFeedback>
            )}
          </CCol>

          {/* عدد الملف الأمني */}
          <CCol xs={12} md={6}>
            <CFormInput
              value={caseFileNumber}
              label="عدد الملف الأمني"
              readOnly
            />
          </CCol>

          {/* مصدر الملف */}
          <CCol xs={12} md={6}>
            <CFormSelect
              label="مصدر الملف"
              value={formData.source || ''}
              invalid={!!errors?.source}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, source: e.target.value }))
              }
            >
              <option value="">-- اختر --</option>
              {sources.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </CFormSelect>

            {errors?.source && (
              <CFormFeedback invalid>
                ❌ {errors.source}
              </CFormFeedback>
            )}
          </CCol>

          {/* نوع الملف */}
          <CCol xs={12} md={6}>
            <CFormSelect
              label="نوع الملف"
              value={formData.fileType || ''}
              invalid={!!errors?.fileType}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, fileType: e.target.value }))
              }
            >
              <option value="">-- اختر --</option>
              {fileTypes.map((t, i) => (
                <option key={i} value={t}>{t}</option>
              ))}
            </CFormSelect>

            {errors?.fileType && (
              <CFormFeedback invalid>
                ❌ {errors.fileType}
              </CFormFeedback>
            )}
          </CCol>

          {/* تاريخ الملف */}
          <CCol xs={12} md={6}>
            <CFormInput
              type="date"
              value={formData.fileDate || ''}
              label="تاريخ الملف"
              invalid={!!errors?.fileDate}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, fileDate: e.target.value }))
              }
            />

            {errors?.fileDate && (
              <CFormFeedback invalid>
                ❌ {errors.fileDate}
              </CFormFeedback>
            )}
          </CCol>

          {/* عدد التسجيل */}
          <CCol xs={12} md={6}>
            <CFormInput value={registryNumber} label="عدد التسجيل" readOnly />
          </CCol>

          {/* تاريخ ووقت التلقي */}
          <CCol xs={12} md={6}>
            <CFormInput value={tunisTime} label="تاريخ ووقت التلقي" readOnly />
          </CCol>

          {/* كاتب الضبط */}
          <CCol xs={12} md={6}>
            <CFormInput
              value={formData.clerk || ''}
              label="كاتب الضبط"
              invalid={!!errors?.clerk}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, clerk: e.target.value }))
              }
            />

            {errors?.clerk && (
              <CFormFeedback invalid>
                ❌ {errors.clerk}
              </CFormFeedback>
            )}
          </CCol>

          {/* ملاحظات */}
          <CCol xs={12} md={6}>
            <CFormTextarea
              value={formData.notes || ''}
              label="ملاحظات"
              invalid={!!errors?.notes}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, notes: e.target.value }))
              }
            />

            {errors?.notes && (
              <CFormFeedback invalid>
                ❌ {errors.notes}
              </CFormFeedback>
            )}
          </CCol>

          {/* الوثائق */}
          <CCol xs={12} md={6}>
            <CFormTextarea
              value={formData.documents || ''}
              label="الوثائق المصاحبة"
              invalid={!!errors?.documents}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, documents: e.target.value }))
              }
            />

            {errors?.documents && (
              <CFormFeedback invalid>
                ❌ {errors.documents}
              </CFormFeedback>
            )}
          </CCol>

        </CRow>
      </CForm>

      <div className="d-flex justify-content-end mt-4">
        <CButton color="primary" onClick={() => handleNext(2)}>
          التالي ➡
        </CButton>
      </div>

    </div>
  </>
)}

{step === 2 && (
  <>
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
              label="الموضوع"
              value={formData.subject || ''}
              invalid={!!errors?.subject}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, subject: e.target.value }))
              }
            />
            {errors?.subject && (
              <CFormFeedback invalid>
                ❌ {errors.subject}
              </CFormFeedback>
            )}
          </CCol>

          {/* التصنيف الجرمي */}
          <CCol xs={12} md={6}>
            <CFormSelect
              label="التصنيف الجرمي"
              value={formData.crimeType || ''}
              invalid={!!errors?.crimeType}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, crimeType: e.target.value }))
              }
            >
              <option value="">-- اختر --</option>
              {crimeCategories.map((cat, i) => (
                <optgroup key={i} label={cat.label}>
                  {cat.options.map((o, j) => (
                    <option key={j} value={o}>{o}</option>
                  ))}
                </optgroup>
              ))}
            </CFormSelect>

            {errors?.crimeType && (
              <CFormFeedback invalid>
                ❌ {errors.crimeType}
              </CFormFeedback>
            )}
          </CCol>

          {/* مكان الواقعة */}
          <CCol xs={12} md={6}>
            <CFormInput
              label="مكان الواقعة"
              value={formData.crimePlace || ''}
              invalid={!!errors?.crimePlace}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, crimePlace: e.target.value }))
              }
            />
            {errors?.crimePlace && (
              <CFormFeedback invalid>
                ❌ {errors.crimePlace}
              </CFormFeedback>
            )}
          </CCol>

          {/* تاريخ الواقعة */}
          <CCol xs={12} md={6}>
            <CFormInput
              type="date"
              label="تاريخ الواقعة"
              value={formData.crimeDate || ''}
              invalid={!!errors?.crimeDate}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, crimeDate: e.target.value }))
              }
            />
            {errors?.crimeDate && (
              <CFormFeedback invalid>
                ❌ {errors.crimeDate}
              </CFormFeedback>
            )}
          </CCol>

          {/* ملخص الوقائع */}
          <CCol xs={12}>
            <CFormTextarea
              label="ملخص الوقائع"
              value={formData.summary || ''}
              invalid={!!errors?.summary}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, summary: e.target.value }))
              }
            />
            {errors?.summary && (
              <CFormFeedback invalid>
                ❌ {errors.summary}
              </CFormFeedback>
            )}
          </CCol>

          {/* AI */}
          <CCol xs={12}>
            <CFormTextarea
              label="اقتراح الذكاء الاصطناعي"
              value={formData.aiSuggestion || ''}
              invalid={!!errors?.aiSuggestion}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, aiSuggestion: e.target.value }))
              }
            />
            {errors?.aiSuggestion && (
              <CFormFeedback invalid>
                ❌ {errors.aiSuggestion}
              </CFormFeedback>
            )}
          </CCol>

        </CRow>
      </CForm>

      {/* 🔘 الأزرار */}
      <div className="d-flex justify-content-between mt-4">

        <CButton
          color="secondary"
          onClick={() => setStep(1)}
        >
          ⬅ رجوع
        </CButton>

        <CButton
          color="primary"
          onClick={() => handleNext(3)}
        >
          التالي ➡
        </CButton>

      </div>

    </div>
  </>
)}


{step === 3 && (
  <>
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

{/* 🔘 Navigation (محسّن) */}
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
  </>
)}   
{step === 4 && (
  <>
    <CForm>

      {/* 🧾 هيدر احترافي */}
      <div className="form-header text-end mb-3">
        <h4>⚖️ القرار والحالة النهائية</h4>
        <span>تسجيل الحكم + الحالة القانونية للقضية</span>
      </div>

      {/* 🆔 بطاقة ID القضية */}
      <div className="person-card mb-3">
        <CFormInput
          value={caseId}
          label="ID القضية"
          readOnly
        />
      </div>

      {/* 📌 الحالة والقرار */}
      <div className="person-card mb-3">

        <h6 className="section-title text-end mb-3">
          📌 الحالة والقرار
        </h6>

        {/* 📄 القرار */}
        <CFormTextarea
          value={formData.decisionText || ''}
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

        {/* 📅 التاريخ */}
        <CFormInput
          type="date"
          value={formData.decisionDate || ''}
          label="تاريخ القرار"
          invalid={!!errors?.decisionDate}
          className="mt-3"
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

        {/* ⚖️ النص القانوني */}
        <CFormTextarea
          value={formData.lawText || ''}
          label="النص القانوني"
          invalid={!!errors?.lawText}
          className="mt-3"
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

        {/* 📌 الحالة */}
        <CFormSelect
          label="حالة القضية"
          value={formData.status || ''}
          invalid={!!errors?.status}
          className="mt-3"
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

        {/* 🧾 سبب الحالة */}
        <CFormTextarea
          value={formData.statusReason || ''}
          label="سبب الحالة"
          invalid={!!errors?.statusReason}
          className="mt-3"
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

    {/* NAV STEP 4 */}
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
        color="success"
        className="px-4 d-flex align-items-center gap-2"
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
        💾 حفظ القضية
      </CButton>

    </div>
  </>
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
        </div> {/* ⬅️ هذا إغلاق form-container */}

      </CCardBody>
      </CCard>

    </div>
   </FormWrapper>
)
}


export default CaseForm




