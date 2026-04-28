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
  CModalTitle
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

// =======================
// 👤 Form الأطراف
// =======================
const PersonForm = ({ title, type, formData, setFormData }) => {
  const [resState, setResState] = useState('')
  const [birthState, setBirthState] = useState('')

  const person = formData?.[type] || {}

  return (
    <div className="mb-4 p-3 border rounded">
      <h6>{title}</h6>

      <CRow>

        <CCol md={6}>
          <CFormInput
            label="الاسم الكامل"
            value={person.fullName || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [type]: { ...person, fullName: e.target.value }
              })
            }
          />
        </CCol>

        <CCol md={6}>
          <CFormSelect
            label="الجنس"
            value={person.gender || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [type]: { ...person, gender: e.target.value }
              })
            }
          >
            {genders.map((g, i) => (
              <option key={i}>{g}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormSelect
            label="الجنسية"
            value={person.nationality || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [type]: { ...person, nationality: e.target.value }
              })
            }
          >
            {nationalities.map((n, i) => (
              <option key={i}>{n}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormInput
            type="date"
            label="تاريخ الولادة"
            value={person.birthDate || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [type]: { ...person, birthDate: e.target.value }
              })
            }
          />
        </CCol>

        <CCol md={6}>
          <CFormSelect label="مكان الولادة (ولاية)" onChange={(e) => setBirthState(e.target.value)}>
            <option value="">-- اختر --</option>
            {locations.map((l, i) => (
              <option key={i}>{l.state}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormSelect label="مكان الولادة (معتمدية)">
            <option value="">-- اختر --</option>
            {locations.find(l => l.state === birthState)?.delegations.map((d, i) => (
              <option key={i}>{d}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormSelect label="مكان السكن (ولاية)" onChange={(e) => setResState(e.target.value)}>
            <option value="">-- اختر --</option>
            {locations.map((l, i) => (
              <option key={i}>{l.state}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormSelect label="مكان السكن (معتمدية)">
            <option value="">-- اختر --</option>
            {locations.find(l => l.state === resState)?.delegations.map((d, i) => (
              <option key={i}>{d}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormInput
            label="المستوى التعليمي"
            value={person.education || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [type]: { ...person, education: e.target.value }
              })
            }
          />
        </CCol>

        <CCol md={6}>
          <CFormInput
            label="المهنة"
            value={person.job || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [type]: { ...person, job: e.target.value }
              })
            }
          />
        </CCol>

        <CCol md={12}>
          <CFormTextarea
            label="ملاحظات إضافية"
            value={person.notes || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [type]: { ...person, notes: e.target.value }
              })
            }
          />
        </CCol>

        <CCol md={12}>
          <CFormTextarea
            label="الإفادة (حسب الدور)"
            value={person.statement || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                [type]: { ...person, statement: e.target.value }
              })
            }
          />
        </CCol>

        <CCol md={12}>
          <CFormTextarea label="اقتراحات الذكاء الاصطناعي" />
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
  const firstRender = useRef(true)

  const [caseFileNumber] = useState(generateCaseFileNumber())
  const [registryNumber] = useState(generateRegistryNumber())
  const [tunisTime] = useState(getTunisDateTime())
  const [caseId] = useState(generateCaseId())

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

      // 👤 plaintiff flatten
      plaintiffGender: formData.plaintiff?.gender,
      plaintiffNationality: formData.plaintiff?.nationality,
      plaintiffBirthDate: formData.plaintiff?.birthDate,
      plaintiffState: formData.plaintiff?.birthState,
      plaintiffResState: formData.plaintiff?.resState,

      // 👤 suspect flatten
      suspectGender: formData.suspect?.gender,
      suspectNationality: formData.suspect?.nationality,
      suspectBirthDate: formData.suspect?.birthDate,
      suspectState: formData.suspect?.birthState,
      suspectResState: formData.suspect?.resState,
    }

    const existing = JSON.parse(localStorage.getItem('cases')) || []
    existing.push(normalizedCase)

    localStorage.setItem('cases', JSON.stringify(existing))

    alert('✅ تم حفظ القضية بنجاح')
  }
  return (
    <CCard>
      <CCardBody>

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
            <CForm>
              <CRow>
                <CCol md={6}>
                  <CFormSelect
                    label="المحكمة"
                    onChange={(e) => setFormData({ ...formData, court: e.target.value })}
                  >
                    {courts.map((c, i) => (
                      <option key={i}>{c}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput value={caseFileNumber} label="عدد الملف الأمني" readOnly />
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    label="مصدر الملف"
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  >
                    {sources.map((s, i) => (
                      <option key={i}>{s}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormSelect
                    label="نوع الملف"
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                  >
                    {fileTypes.map((t, i) => (
                      <option key={i}>{t}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput type="date"
                    onChange={(e) => setFormData({ ...formData, fileDate: e.target.value })}
                    label="تاريخ الملف"
                  />
                </CCol>

                <CCol md={6}>
                  <CFormInput value={registryNumber} label="عدد التسجيل" readOnly />
                </CCol>

                <CCol md={6}>
                  <CFormInput value={tunisTime} label="تاريخ ووقت التلقي" readOnly />
                </CCol>

                <CCol md={6}>
                  <CFormInput
                    onChange={(e) => setFormData({ ...formData, clerk: e.target.value })}
                    label="كاتب الضبط"
                  />
                </CCol>

                <CCol md={12}>
                  <CFormTextarea
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    label="ملاحظات"
                  />
                </CCol>

                <CCol md={12}>
                  <CFormTextarea
                    onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
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
                label="الموضوع"
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />

              <CFormSelect
                label="التصنيف الجرمي"
                onChange={(e) => setFormData({ ...formData, crimeType: e.target.value })}
              >
                {crimeCategories.map((cat, i) => (
                  <optgroup key={i} label={cat.label}>
                    {cat.options.map((o, j) => (
                      <option key={j}>{o}</option>
                    ))}
                  </optgroup>
                ))}
              </CFormSelect>

              <CFormInput
                label="مكان الواقعة"
                onChange={(e) => setFormData({ ...formData, crimePlace: e.target.value })}
              />

              <CFormInput
                type="date"
                onChange={(e) => setFormData({ ...formData, crimeDate: e.target.value })}
                label="تاريخ الواقعة"
              />

              <CFormTextarea
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                label="ملخص الوقائع"
              />

              <CFormTextarea
                onChange={(e) => setFormData({ ...formData, aiSuggestion: e.target.value })}
                label="اقتراح تصنيف جزائي (AI)"
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

    <CFormInput
      value={caseId}
      label="ID القضية"
      readOnly
      className="mb-3"
    />

    <CFormTextarea
      onChange={(e) => setFormData({ ...formData, decisionText: e.target.value })}
      label="نص القرار"
    />

    <CFormInput
      type="date"
      onChange={(e) => setFormData({ ...formData, decisionDate: e.target.value })}
      label="تاريخ القرار"
    />

    <CFormTextarea
      onChange={(e) => setFormData({ ...formData, lawText: e.target.value })}
      label="النص القانوني"
    />

    <CFormSelect
      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      label="حالة القضية"
    >
      <option>تسجيل</option>
      <option>حفظ</option>
      <option>مجلس</option>
      <option>أطفال</option>
      <option>تحقيق</option>
      <option>جناحي الناحية</option>
      <option>مخالفات</option>
      <option>مضافة</option>
      <option>تعهد</option>
      <option>تنفيذ</option>
      <option>محال على قاضي الأسرة</option>
      <option>محال على القضاء المنفرد</option>
      <option>الصلح بالوساطة</option>
      <option>طور البحث</option>
      <option>تخلي</option>
    </CFormSelect>

    <CFormTextarea
      onChange={(e) => setFormData({ ...formData, statusReason: e.target.value })}
      label="سبب الحالة"
    />

    {/* ✅ زر الحفظ الصحيح */}
    <CButton color="success" className="mt-3 w-100" onClick={handleSave}>
      💾 حفظ القضية
    </CButton>

  </CForm>
</CTabPane>


        </CTabContent>

      </CCardBody>
    </CCard>
  )
}

export default CaseForm




