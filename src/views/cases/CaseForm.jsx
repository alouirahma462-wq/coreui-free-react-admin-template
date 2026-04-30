import { useState, useEffect, useRef } from 'react'
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

const PersonForm = ({ title, type, formData, setFormData }) => {

  const person = formData?.[type] || {}

  // ✅ حماية كاملة من crash
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

        {/* الاسم */}
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
        </CCol>

        {/* الجنس */}
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
        </CCol>

        {/* الجنسية */}
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
        </CCol>

        {/* تاريخ الولادة */}
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
        </CCol>

        {/* ولاية الولادة */}
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
        </CCol>

        {/* معتمدية الولادة */}
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
        </CCol>

        {/* ولاية السكن */}
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
        </CCol>

        {/* معتمدية السكن */}
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
        </CCol>

        {/* التعليم */}
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
        </CCol>

        {/* المهنة */}
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
        </CCol>

        {/* ملاحظات */}
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
        </CCol>

        {/* إفادة */}
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
        </CCol>

        {/* AI */}
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
        </CCol>

      </CRow>

    </div>
  )
}

// =======================
// 🧾 CaseForm
// =======================
const CaseForm = () => {

const [activeKey, setActiveKey] = useState(1)
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

    setActiveKey(1)

  } catch (err) {
    console.error(err)
  }
}

 return (
  <div className="case-page">

    <CCard className="case-card">
      <CCardBody>

        

      

{/* ================= TAB 1 ================= */}
<CTabPane visible={activeKey === 1}>
  <CForm>
    <CRow className="g-3">

      <CCol xs={12} md={6}>
        <CFormSelect
          label="المحكمة"
          value={formData.court || ''}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              court: e.target.value
            }))
          }
        >
          <option value="">-- اختر --</option>
          {courts.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </CFormSelect>
      </CCol>

      <CCol xs={12} md={6}>
        <CFormInput value={caseFileNumber} label="عدد الملف الأمني" readOnly />
      </CCol>

      <CCol xs={12} md={6}>
        <CFormSelect
          label="مصدر الملف"
          value={formData.source || ''}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              source: e.target.value
            }))
          }
        >
          <option value="">-- اختر --</option>
          {sources.map((s, i) => (
            <option key={i} value={s}>{s}</option>
          ))}
        </CFormSelect>
      </CCol>

      <CCol xs={12} md={6}>
        <CFormSelect
          label="نوع الملف"
          value={formData.fileType || ''}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              fileType: e.target.value
            }))
          }
        >
          <option value="">-- اختر --</option>
          {fileTypes.map((t, i) => (
            <option key={i} value={t}>{t}</option>
          ))}
        </CFormSelect>
      </CCol>

      <CCol xs={12} md={6}>
        <CFormInput
          type="date"
          value={formData.fileDate || ''}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              fileDate: e.target.value
            }))
          }
          label="تاريخ الملف"
        />
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
            setFormData(prev => ({
              ...prev,
              clerk: e.target.value
            }))
          }
          label="كاتب الضبط"
        />
      </CCol>

      <CCol xs={12} md={6}>
        <CFormTextarea
          value={formData.notes || ''}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              notes: e.target.value
            }))
          }
          label="ملاحظات"
        />
      </CCol>

      <CCol xs={12} md={6}>
        <CFormTextarea
          value={formData.documents || ''}
          onChange={(e) =>
            setFormData(prev => ({
              ...prev,
              documents: e.target.value
            }))
          }
          label="الوثائق المصاحبة"
        />
      </CCol>

    </CRow>
  </CForm>
</CTabPane>

{/* ================= TAB 2 ================= */}
<CTabPane visible={activeKey === 2}>
  <CForm>

    <CFormInput
      value={formData.subject || ''}
      label="الموضوع"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          subject: e.target.value
        }))
      }
    />

    <CFormSelect
      label="التصنيف الجرمي"
      value={formData.crimeType || ''}
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          crimeType: e.target.value
        }))
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

    <CFormInput
      value={formData.crimePlace || ''}
      label="مكان الواقعة"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          crimePlace: e.target.value
        }))
      }
    />

    <CFormInput
      type="date"
      value={formData.crimeDate || ''}
      label="تاريخ الواقعة"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          crimeDate: e.target.value
        }))
      }
    />

    <CFormTextarea
      value={formData.summary || ''}
      label="ملخص الوقائع"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          summary: e.target.value
        }))
      }
    />

    <CFormTextarea
      value={formData.aiSuggestion || ''}
      label="اقتراح تصنيف جزائي (AI)"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          aiSuggestion: e.target.value
        }))
      }
    />

  </CForm>
</CTabPane>

{/* ================= TAB 3 ================= */}
<CTabPane visible={activeKey === 3}>
  <PersonForm title="👤 الشاكي" type="plaintiff" formData={formData} setFormData={setFormData} />
  <PersonForm title="⚠️ المظنون فيه" type="suspect" formData={formData} setFormData={setFormData} />
</CTabPane>

{/* ================= TAB 4 ================= */}
<CTabPane visible={activeKey === 4}>
  <CForm>

    <CFormInput value={caseId} label="ID القضية" readOnly className="mb-3" />

    <CFormTextarea
      value={formData.decisionText || ''}
      label="نص القرار"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          decisionText: e.target.value
        }))
      }
    />

    <CFormInput
      type="date"
      value={formData.decisionDate || ''}
      label="تاريخ القرار"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          decisionDate: e.target.value
        }))
      }
    />

    <CFormTextarea
      value={formData.lawText || ''}
      label="النص القانوني"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          lawText: e.target.value
        }))
      }
    />

    <CFormSelect
      label="حالة القضية"
      value={formData.status || ''}
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

    <CFormTextarea
      value={formData.statusReason || ''}
      label="سبب الحالة"
      onChange={(e) =>
        setFormData(prev => ({
          ...prev,
          statusReason: e.target.value
        }))
      }
    />

  <CButton
  type="button"
  color="success"
  size="lg"
  className="w-100 mt-4"
  onClick={handleSave}
>
      💾 حفظ القضية
    </CButton>

  </CForm>
</CTabPane>


       

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

        </CCardBody>
      </CCard>

    </div>
  )
}

export default CaseForm




