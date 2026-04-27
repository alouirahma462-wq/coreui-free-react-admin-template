import {
  CNavItem,
  CNavTitle
} from '@coreui/react'

import {
  cilFolder,
  cilList,
  cilLibrary,
  cilBell,
  cilBalanceScale,
  cilBrain,
  cilChart,
  cilBolt,
  cilSearch,
  cilNotes,
  cilEnvelopeOpen,
  cilWarning,
  cilShare,
  cilFingerprint
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const courtNav = [

  // ================= HEADER =================
  {
    component: CNavTitle,
    name: "🏛️ النظام القضائي الذكي",
  },

  // =========================================================
  // 🟦 كتابة ضبط النيابة
  // =========================================================
  {
    component: CNavTitle,
    name: "🟦 كتابة ضبط النيابة",
  },

  {
    component: CNavItem,
    name: "إدارة الملفات القضائية",
    to: "/court/files",
    icon: <CIcon icon={cilFolder} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "متابعة الملفات",
    to: "/court/tracking",
    icon: <CIcon icon={cilList} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "الأرشفة القضائية",
    to: "/court/archive",
    icon: <CIcon icon={cilLibrary} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "إدارة الإشعارات",
    to: "/court/notifications",
    icon: <CIcon icon={cilBell} className="nav-icon" />,
  },

  // =========================================================
  // 🟨 وكيل الجمهورية
  // =========================================================
  {
    component: CNavTitle,
    name: "🟨 وكيل الجمهورية (القضاة وأعضاء النيابة)",
  },

  {
    component: CNavItem,
    name: "لوحة القضايا",
    to: "/prosecutor/dashboard",
    icon: <CIcon icon={cilBalanceScale} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "التحليل الذكي للقضايا",
    to: "/prosecutor/analysis",
    icon: <CIcon icon={cilBrain} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "القرارات والإجراءات",
    to: "/prosecutor/decisions",
    icon: <CIcon icon={cilNotes} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "المراسلات والتفاعل مع الإشعارات",
    to: "/prosecutor/communications",
    icon: <CIcon icon={cilEnvelopeOpen} className="nav-icon" />,
  },

  // =========================================================
  // 🚀 الذكاء القضائي
  // =========================================================
  {
    component: CNavTitle,
    name: "🚀 الذكاء القضائي (AI)",
  },

  {
    component: CNavItem,
    name: "مساعد المحكمة الذكي",
    to: "/ai/assistant",
    icon: <CIcon icon={cilBrain} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "ذكاء القضايا",
    to: "/ai/intelligence",
    icon: <CIcon icon={cilChart} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "التوقعات القضائية",
    to: "/ai/predictions",
    icon: <CIcon icon={cilBolt} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "البحث القانوني الذكي",
    to: "/ai/search",
    icon: <CIcon icon={cilSearch} className="nav-icon" />,
  },

  // =========================================================
  // ⚙️ أدوات متقدمة
  // =========================================================
  {
    component: CNavTitle,
    name: "⚙️ أدوات متقدمة",
  },

  {
    component: CNavItem,
    name: "بناء الملف التلقائي",
    to: "/tools/auto-builder",
    icon: <CIcon icon={cilFolder} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "التنبيهات الذكية",
    to: "/tools/alerts",
    icon: <CIcon icon={cilWarning} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "توزيع القضايا",
    to: "/tools/distribution",
    icon: <CIcon icon={cilShare} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "تلخيص الملفات",
    to: "/tools/summarization",
    icon: <CIcon icon={cilNotes} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "الذاكرة القضائية",
    to: "/tools/memory",
    icon: <CIcon icon={cilLibrary} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "كشف التلاعب",
    to: "/tools/fraud",
    icon: <CIcon icon={cilWarning} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "الربط بين المحاكم",
    to: "/tools/cross-court",
    icon: <CIcon icon={cilShare} className="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "كشف الأنماط الإجرامية",
    to: "/tools/crime-patterns",
    icon: <CIcon icon={cilFingerprint} className="nav-icon" />,
  },

]

export default courtNav



