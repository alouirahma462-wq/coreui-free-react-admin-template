import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom' 
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
  CToastBody
} from '@coreui/react'

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
    <div className="filter-box mb-3">

      <h6>{title}</h6>

      <CRow className="g-3">

        {/* ===================== */}
        {/* الاسم الكامل */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormInput
            label="الاسم الكامل"
            value={person.fullName || ''}
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
          {errors?.[`${type}.fullName`] && (
            <div className="text-danger">{errors[`${type}.fullName`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* الجنس */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormSelect
            label="الجنس"
            value={person.gender || ''}
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
          {errors?.[`${type}.gender`] && (
            <div className="text-danger">{errors[`${type}.gender`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* الجنسية */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormSelect
            label="الجنسية"
            value={person.nationality || ''}
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
          {errors?.[`${type}.nationality`] && (
            <div className="text-danger">{errors[`${type}.nationality`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* تاريخ الولادة */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormInput
            type="date"
            label="تاريخ الولادة"
            value={person.birthDate || ''}
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
          {errors?.[`${type}.birthDate`] && (
            <div className="text-danger">{errors[`${type}.birthDate`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* ولاية الولادة */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormSelect
            label="مكان الولادة (ولاية)"
            value={person.birthState || ''}
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
          {errors?.[`${type}.birthState`] && (
            <div className="text-danger">{errors[`${type}.birthState`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* معتمدية الولادة */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormSelect
            label="مكان الولادة (معتمدية)"
            value={person.birthDelegation || ''}
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
          {errors?.[`${type}.birthDelegation`] && (
            <div className="text-danger">{errors[`${type}.birthDelegation`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* ولاية السكن */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormSelect
            label="مكان السكن (ولاية)"
            value={person.resState || ''}
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
          {errors?.[`${type}.resState`] && (
            <div className="text-danger">{errors[`${type}.resState`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* معتمدية السكن */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormSelect
            label="مكان السكن (معتمدية)"
            value={person.resDelegation || ''}
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
          {errors?.[`${type}.resDelegation`] && (
            <div className="text-danger">{errors[`${type}.resDelegation`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* التعليم */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormInput
            label="المستوى التعليمي"
            value={person.education || ''}
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
          {errors?.[`${type}.education`] && (
            <div className="text-danger">{errors[`${type}.education`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* المهنة */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormInput
            label="المهنة"
            value={person.job || ''}
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
          {errors?.[`${type}.job`] && (
            <div className="text-danger">{errors[`${type}.job`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* ملاحظات */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormTextarea
            label="ملاحظات إضافية"
            value={person.notes || ''}
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
          {errors?.[`${type}.notes`] && (
            <div className="text-danger">{errors[`${type}.notes`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* الإفادة */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormTextarea
            label="الإفادة (حسب الدور)"
            value={person.statement || ''}
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
          {errors?.[`${type}.statement`] && (
            <div className="text-danger">{errors[`${type}.statement`]}</div>
          )}
        </CCol>

        {/* ===================== */}
        {/* AI */}
        {/* ===================== */}
        <CCol xs={12} md={6}>
          <CFormTextarea
            label="اقتراحات الذكاء الاصطناعي"
            value={person.aiSuggestion || ''}
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
          {errors?.[`${type}.aiSuggestion`] && (
            <div className="text-danger">{errors[`${type}.aiSuggestion`]}</div>
          )}
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
const validateStep = (step, formData) => {
  let errors = {}

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

    if (!caseFileNumber) errors.caseFileNumber = "عدد الملف الأمني غير متوفر"
    if (!registryNumber) errors.registryNumber = "عدد التسجيل غير متوفر"
    if (!tunisTime) errors.tunisTime = "تاريخ ووقت التلقي غير متوفر"
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
    const checkPerson = (p, key) => {
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
      if (!p?.aiSuggestion) errors[`${key}.aiSuggestion`] = "اقتراح AI مطلوب"
    }

    checkPerson(formData.plaintiff, "plaintiff")
    checkPerson(formData.suspect, "suspect")
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

  // =======================
  // 💾 SAVE FUNCTION (ADDED)
  // =======================
const handleSave = () => {
  try {
    const raw = localStorage.getItem('cases')

    let existing = []

    try {
      existing = raw ? JSON.parse(raw) : []
    } catch (e) {
      existing = []
    }

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
    console.error(err)
  }
}

 return (
  <div className="case-page">

    <CCard className="case-card">
      <CCardBody>
<div className="mb-3">

  <div className="d-flex justify-content-between mb-1">
    <small>المرحلة {step} من 4</small>
    <small>{Math.round((step / 4) * 100)}%</small>
  </div>

  <div className="progress">
    <div
      className="progress-bar"
      style={{
        width: `${(step / 4) * 100}%`
      }}
    />
  </div>

</div>
{step === 1 && (
  <>
    <CForm>
      <CRow className="g-3">

        <CCol xs={12} md={6}>
          <CFormSelect
            label="المحكمة"
            value={formData.court || ''}
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
            <small className="text-danger d-block mt-1">
              {errors.court}
            </small>
          )}
        </CCol>

        <CCol xs={12} md={6}>
          <CFormInput value={caseFileNumber} label="عدد الملف الأمني" readOnly />
        </CCol>

        <CCol xs={12} md={6}>
          <CFormSelect
            label="مصدر الملف"
            value={formData.source || ''}
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
            <small className="text-danger d-block mt-1">
              {errors.source}
            </small>
          )}
        </CCol>

        <CCol xs={12} md={6}>
          <CFormSelect
            label="نوع الملف"
            value={formData.fileType || ''}
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
            <small className="text-danger d-block mt-1">
              {errors.fileType}
            </small>
          )}
        </CCol>

        <CCol xs={12} md={6}>
          <CFormInput
            type="date"
            value={formData.fileDate || ''}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, fileDate: e.target.value }))
            }
            label="تاريخ الملف"
          />

          {errors?.fileDate && (
            <small className="text-danger d-block mt-1">
              {errors.fileDate}
            </small>
          )}
        </CCol>

        <CCol xs={12} md={6}>
          <CFormInput value={registryNumber} label="عدد التسجيل" readOnly />
        </CCol>

        <CCol xs={12} md={6}>
          <CFormInput value={tunisTime} label="تاريخ ووقت التلقي" readOnly />
        </CCol>

        <CCol xs={12} md={6}>
          <CFormInput
            value={formData.clerk || ''}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, clerk: e.target.value }))
            }
            label="كاتب الضبط"
          />

          {errors?.clerk && (
            <small className="text-danger d-block mt-1">
              {errors.clerk}
            </small>
          )}
        </CCol>

        <CCol xs={12} md={6}>
          <CFormTextarea
            value={formData.notes || ''}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, notes: e.target.value }))
            }
            label="ملاحظات"
          />

          {errors?.notes && (
            <small className="text-danger d-block mt-1">
              {errors.notes}
            </small>
          )}
        </CCol>

        <CCol xs={12} md={6}>
          <CFormTextarea
            value={formData.documents || ''}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, documents: e.target.value }))
            }
            label="الوثائق المصاحبة"
          />

          {errors?.documents && (
            <small className="text-danger d-block mt-1">
              {errors.documents}
            </small>
          )}
        </CCol>

      </CRow>
    </CForm>

    <div className="d-flex justify-content-end mt-4">
      <CButton color="primary" onClick={() => handleNext(2)}>
        التالي ➡
      </CButton>
    </div>
  </>
)}


{step === 2 && (
  <>
    <CForm>

      <CFormInput
        value={formData.subject || ''}
        label="الموضوع"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, subject: e.target.value }))
        }
      />
      {errors?.subject && <small className="text-danger d-block mt-1">{errors.subject}</small>}

      <CFormSelect
        label="التصنيف الجرمي"
        value={formData.crimeType || ''}
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
      {errors?.crimeType && <small className="text-danger d-block mt-1">{errors.crimeType}</small>}

      <CFormInput
        value={formData.crimePlace || ''}
        label="مكان الواقعة"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, crimePlace: e.target.value }))
        }
      />
      {errors?.crimePlace && <small className="text-danger d-block mt-1">{errors.crimePlace}</small>}

      <CFormInput
        type="date"
        value={formData.crimeDate || ''}
        label="تاريخ الواقعة"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, crimeDate: e.target.value }))
        }
      />
      {errors?.crimeDate && <small className="text-danger d-block mt-1">{errors.crimeDate}</small>}

      <CFormTextarea
        value={formData.summary || ''}
        label="ملخص الوقائع"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, summary: e.target.value }))
        }
      />
      {errors?.summary && <small className="text-danger d-block mt-1">{errors.summary}</small>}

      <CFormTextarea
        value={formData.aiSuggestion || ''}
        label="اقتراح AI"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, aiSuggestion: e.target.value }))
        }
      />
      {errors?.aiSuggestion && <small className="text-danger d-block mt-1">{errors.aiSuggestion}</small>}

    </CForm>

    <div className="d-flex justify-content-between mt-4">
      <CButton color="secondary" onClick={() => setStep(1)}>⬅ السابق</CButton>
      <CButton color="primary" onClick={() => handleNext(3)}>التالي ➡</CButton>
    </div>
  </>
)}

{step === 3 && (
  <>
    <PersonForm
      title="👤 الشاكي"
      type="plaintiff"
      formData={formData}
      setFormData={setFormData}
      errors={errors}
    />

    <PersonForm
      title="⚠️ المظنون فيه"
      type="suspect"
      formData={formData}
      setFormData={setFormData}
      errors={errors}
    />

    {/* NAV STEP 3 */}
    <div className="d-flex justify-content-between mt-4">

      <CButton color="secondary" onClick={() => setStep(2)}>
        ⬅ السابق
      </CButton>

      <CButton
        color="primary"
        onClick={() => {
          const stepErrors = validateStep(3, formData)

          if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors)
            return
          }

          setErrors({})
          setStep(4)

          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      >
        التالي ➡
      </CButton>

    </div>
  </>
)}

{step === 4 && (
  <>
    <CForm>

      <CFormInput
        value={caseId}
        label="ID القضية"
        readOnly
        className="mb-3"
      />

      <CFormTextarea
        value={formData.decisionText || ''}
        label="نص القرار"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, decisionText: e.target.value }))
        }
        invalid={!!errors.decisionText}
      />
      {errors?.decisionText && (
        <small className="text-danger d-block mt-1">
          {errors.decisionText}
        </small>
      )}

      <CFormInput
        type="date"
        value={formData.decisionDate || ''}
        label="تاريخ القرار"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, decisionDate: e.target.value }))
        }
        invalid={!!errors.decisionDate}
      />
      {errors?.decisionDate && (
        <small className="text-danger d-block mt-1">
          {errors.decisionDate}
        </small>
      )}

      <CFormTextarea
        value={formData.lawText || ''}
        label="النص القانوني"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, lawText: e.target.value }))
        }
        invalid={!!errors.lawText}
      />
      {errors?.lawText && (
        <small className="text-danger d-block mt-1">
          {errors.lawText}
        </small>
      )}

      <CFormSelect
        label="حالة القضية"
        value={formData.status || ''}
        onChange={(e) =>
          setFormData(prev => ({ ...prev, status: e.target.value }))
        }
        invalid={!!errors.status}
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
      {errors?.status && (
        <small className="text-danger d-block mt-1">
          {errors.status}
        </small>
      )}

      <CFormTextarea
        value={formData.statusReason || ''}
        label="سبب الحالة"
        onChange={(e) =>
          setFormData(prev => ({ ...prev, statusReason: e.target.value }))
        }
        invalid={!!errors.statusReason}
      />
      {errors?.statusReason && (
        <small className="text-danger d-block mt-1">
          {errors.statusReason}
        </small>
      )}

    </CForm>

    {/* NAV STEP 4 */}
    <div className="d-flex justify-content-between mt-4">

      <CButton color="secondary" onClick={() => setStep(3)}>
        ⬅ السابق
      </CButton>

      <CButton
        color="success"
        onClick={() => {
          const stepErrors = validateStep(4, formData)

          if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
          }

          setErrors({})
          handleSave()
          setShowSuccessModal(true)
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
>
  <CModalHeader>
    <CModalTitle>نجاح العملية</CModalTitle>
  </CModalHeader>

  <CModalBody>
    <div>
      ✅ تم حفظ القضية بنجاح
      <br />
      يمكنك الآن الانتقال إلى عرض القضايا
    </div>

    <div className="mt-3 d-flex justify-content-end gap-2">

      {/* زر إغلاق فقط */}
      <CButton
        color="secondary"
        onClick={() => setShowSuccessModal(false)}
      >
        إغلاق
      </CButton>

      {/* زر الذهاب للكيس ليست */}
      <CButton
        color="primary"
        onClick={() => {
          setShowSuccessModal(false)
         navigate('/cases')// 👈 عدلي المسار إذا مختلف عندك
        }}
      >
        عرض القضايا
      </CButton>

    </div>
  </CModalBody>
</CModal>

        </CCardBody>
      </CCard>

    </div>
  )
}

export default CaseForm




