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
  cilChart,
  cilBolt,
  cilSearch,
  cilNotes,
  cilEnvelopeOpen,
  cilWarning,
  cilShare,
  cilFingerprint
} from '@coreui/icons'

const courtNav = [

  // ================= HEADER =================
  {
    component: CNavTitle,
    name: "🏛️ النظام القضائي الذكي",
  },

  // 🟦 كتابة ضبط النيابة
  {
    component: CNavTitle,
    name: "🟦 كتابة ضبط النيابة",
  },

  {
    component: CNavItem,
    name: "إدارة الملفات القضائية",
    to: "/court/files",
    icon: cilFolder,
    badge: {
      color: 'info',
      text: '128'
    }
  },

  {
    component: CNavItem,
    name: "متابعة الملفات",
    to: "/court/tracking",
    icon: cilList,
    badge: {
      color: 'warning',
      text: '12 عاجل'
    }
  },

  {
    component: CNavItem,
    name: "الأرشفة القضائية",
    to: "/court/archive",
    icon: cilLibrary,
  },

  {
    component: CNavItem,
    name: "إدارة الإشعارات",
    to: "/court/notifications",
    icon: cilBell,
    badge: {
      color: 'danger',
      text: '5'
    }
  },

  // 🟨 وكيل الجمهورية
  {
    component: CNavTitle,
    name: "🟨 وكيل الجمهورية (القضاة وأعضاء النيابة)",
  },

  {
    component: CNavItem,
    name: "لوحة القضايا",
    to: "/prosecutor/dashboard",
    icon: cilBalanceScale,
  },

  {
    component: CNavItem,
    name: "التحليل الذكي للقضايا",
    to: "/prosecutor/analysis",
    icon: cilChart,
    badge: {
      color: 'info',
      text: 'AI'
    }
  },

  {
    component: CNavItem,
    name: "القرارات والإجراءات",
    to: "/prosecutor/decisions",
    icon: cilNotes,
  },

  {
    component: CNavItem,
    name: "المراسلات والتفاعل مع الإشعارات",
    to: "/prosecutor/communications",
    icon: cilEnvelopeOpen,
  },

  // 🚀 الذكاء القضائي (AI Layer)
  {
    component: CNavTitle,
    name: "🚀 الذكاء القضائي (AI)",
  },

  {
    component: CNavItem,
    name: "مساعد المحكمة الذكي",
    to: "/ai/assistant",
    icon: cilChart,
    badge: {
      color: 'success',
      text: 'Live'
    }
  },

  {
    component: CNavItem,
    name: "ذكاء القضايا",
    to: "/ai/intelligence",
    icon: cilChart,
  },

  {
    component: CNavItem,
    name: "التوقعات القضائية",
    to: "/ai/predictions",
    icon: cilBolt,
  },

  {
    component: CNavItem,
    name: "البحث القانوني الذكي",
    to: "/ai/search",
    icon: cilSearch,
  },

  // ⚙️ أدوات متقدمة
  {
    component: CNavTitle,
    name: "⚙️ أدوات متقدمة",
  },

  {
    component: CNavItem,
    name: "بناء الملف التلقائي",
    to: "/tools/auto-builder",
    icon: cilFolder,
  },

  {
    component: CNavItem,
    name: "التنبيهات الذكية",
    to: "/tools/alerts",
    icon: cilWarning,
    badge: {
      color: 'danger',
      text: '!'
    }
  },

  {
    component: CNavItem,
    name: "توزيع القضايا",
    to: "/tools/distribution",
    icon: cilShare,
    badge: {
      color: 'warning',
      text: 'ضغط'
    }
  },

  {
    component: CNavItem,
    name: "تلخيص الملفات",
    to: "/tools/summarization",
    icon: cilNotes,
  },

  {
    component: CNavItem,
    name: "الذاكرة القضائية",
    to: "/tools/memory",
    icon: cilLibrary,
  },

  {
    component: CNavItem,
    name: "كشف التلاعب",
    to: "/tools/fraud",
    icon: cilWarning,
    badge: {
      color: 'danger',
      text: 'AI'
    }
  },

  {
    component: CNavItem,
    name: "الربط بين المحاكم",
    to: "/tools/cross-court",
    icon: cilShare,
  },

  {
    component: CNavItem,
    name: "كشف الأنماط الإجرامية",
    to: "/tools/crime-patterns",
    icon: cilFingerprint,
    badge: {
      color: 'info',
      text: 'Smart'
    }
  },

]

export default courtNav





