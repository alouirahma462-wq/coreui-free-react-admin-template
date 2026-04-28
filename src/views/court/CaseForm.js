import { useState } from 'react'
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
  CButton
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
const PersonForm = ({ title }) => {
  const [resState, setResState] = useState('')
  const [birthState, setBirthState] = useState('')

  return (
    <div className="mb-4 p-3 border rounded">
      <h6>{title}</h6>

      <CRow>

        <CCol md={6}>
          <CFormInput label="الاسم الكامل" />
        </CCol>

        <CCol md={6}>
          <CFormSelect label="الجنس">
            {genders.map((g, i) => (
              <option key={i}>{g}</option>
            ))}
          </CFormSelect>
        </CCol>

        <CCol md={6}>
          <CFormSelect label="الجنسية">
            {nationalities.map((n, i) => (
              <option key={i}>{n}</option>
            ))}
          </CFormSelect>
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
          <CFormInput label="المستوى التعليمي" />
        </CCol>

        <CCol md={6}>
          <CFormInput label="المهنة" />
        </CCol>

        <CCol md={12}>
          <CFormTextarea label="ملاحظات إضافية" />
        </CCol>

        <CCol md={12}>
          <CFormTextarea label="الإفادة (حسب الدور)" />
        </CCol>

        <CCol md={12}>
          <CFormTextarea label="كشف التضارب في الإفادة (AI)" />
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

  const [caseFileNumber] = useState(generateCaseFileNumber())
  const [registryNumber] = useState(generateRegistryNumber())
  const [tunisTime] = useState(getTunisDateTime())

  const [caseId] = useState(generateCaseId())

  return (
    <CCard>
      <CCardBody>

        {/* ================= TABS ================= */}
        <CNav variant="tabs">

          <CNavItem>
            <CNavLink active={activeKey === 1} onClick={() => setActiveKey(1)}>
              📁 بيانات الملف
            </CNavLink>
          </CNavItem>

          <CNavItem>
            <CNavLink active={activeKey === 2} onClick={() => setActiveKey(2)}>
              📍 الواقعة
            </CNavLink>
          </CNavItem>

          <CNavItem>
            <CNavLink active={activeKey === 3} onClick={() => setActiveKey(3)}>
              👥 الأطراف
            </CNavLink>
          </CNavItem>

          <CNavItem>
            <CNavLink active={activeKey === 4} onClick={() => setActiveKey(4)}>
              ⚖️ الحالة والقرار
            </CNavLink>
          </CNavItem>

        </CNav>

        <CTabContent className="mt-3">

          {/* ================= TAB 1 ================= */}
          <CTabPane visible={activeKey === 1}>
            <CForm>
              <CRow>

                <CCol md={6}>
                  <CFormSelect label="المحكمة">
                    {courts.map((c, i) => (
                      <option key={i}>{c}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput value={caseFileNumber} label="عدد الملف الأمني" readOnly />
                </CCol>

                <CCol md={6}>
                  <CFormSelect label="مصدر الملف">
                    {sources.map((s, i) => (
                      <option key={i}>{s}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormSelect label="نوع الملف">
                    {fileTypes.map((t, i) => (
                      <option key={i}>{t}</option>
                    ))}
                  </CFormSelect>
                </CCol>

                <CCol md={6}>
                  <CFormInput type="date" label="تاريخ الملف" />
                </CCol>

                <CCol md={6}>
                  <CFormInput value={registryNumber} label="عدد التسجيل" readOnly />
                </CCol>

                <CCol md={6}>
                  <CFormInput value={tunisTime} label="تاريخ ووقت التلقي" readOnly />
                </CCol>

                <CCol md={6}>
                  <CFormInput label="كاتب الضبط" />
                </CCol>

                <CCol md={12}>
                  <CFormTextarea label="ملاحظات" />
                </CCol>

                <CCol md={12}>
                  <CFormTextarea label="الوثائق المصاحبة" />
                </CCol>

                <CCol md={12}>
                  <CFormTextarea label="كشف الوثائق المتضاربة أو الناقصة (AI)" />
                </CCol>

              </CRow>
            </CForm>
          </CTabPane>

          {/* ================= TAB 2 ================= */}
          <CTabPane visible={activeKey === 2}>
            <CForm>

              <CFormInput label="الموضوع" className="mb-3" />

              <CFormSelect label="التصنيف الجرمي" className="mb-3">
                {crimeCategories.map((cat, i) => (
                  <optgroup key={i} label={cat.label}>
                    {cat.options.map((o, j) => (
                      <option key={j}>{o}</option>
                    ))}
                  </optgroup>
                ))}
              </CFormSelect>

              <CFormInput label="مكان الواقعة" className="mb-3" />
              <CFormInput type="date" label="تاريخ الواقعة" className="mb-3" />
              <CFormTextarea label="ملخص الوقائع" className="mb-3" />
              <CFormTextarea label="اقتراح تصنيف جزائي (AI)" />

            </CForm>
          </CTabPane>

          {/* ================= TAB 3 ================= */}
          <CTabPane visible={activeKey === 3}>
            <PersonForm title="👤 الشاكي" />
            <PersonForm title="⚠️ المظنون فيه" />
          </CTabPane>

          {/* ================= TAB 4 ================= */}
          <CTabPane visible={activeKey === 4}>
            <CForm>

              <CFormInput
                value={caseId}
                label="عدد القضية (ID تلقائي)"
                readOnly
                className="mb-3"
              />

              <CFormTextarea label="نص القرار" className="mb-3" />
              <CFormInput type="date" label="تاريخ القرار" className="mb-3" />
              <CFormTextarea label="النص القانوني (AI)" className="mb-3" />

              {/* ================= الحالة الجديدة ================= */}
              <CFormSelect label="حالة القضية" className="mb-3">
                <option>تسجيل</option>
                <option>حفظ</option>
                <option>مجلس أطفال</option>
                <option>تحقيق</option>
                <option>جناحي الناحية</option>
                <option>مخالفات مضافة</option>
                <option>تعهد تنفيذ</option>
                <option>محال على قاضي الأسرة</option>
                <option>محال على القضاء المنفرد</option>
                <option>الصلح بالوساطة</option>
                <option>طور البحث</option>
              </CFormSelect>

              <CFormTextarea label="سبب الحالة" />

            </CForm>
          </CTabPane>

        </CTabContent>

        <div className="mt-3">
          <CButton color="primary">💾 حفظ الملف</CButton>
        </div>

      </CCardBody>
    </CCard>
  )
}

export default CaseForm


