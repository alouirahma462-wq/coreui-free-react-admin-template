const courtNav = [
  // ================= SYSTEM HEADER =================
  {
    component: "CNavTitle",
    name: "🏛️ النظام القضائي الموحد"
  },

  // =========================================================
  // 🏛️ ROLE 1: كاتب ضبط النيابة
  // =========================================================
  {
    component: "CNavTitle",
    name: "📌 كاتب ضبط النيابة"
  },

  {
    component: "CNavGroup",
    name: "1️⃣ التسجيل الإداري للقضايا",
    items: [
      {
        component: "CNavItem",
        name: "تسجيل القضايا الواردة",
        to: "/court/registry/create"
      },
      {
        component: "CNavItem",
        name: "تحديث وتعديل القضايا",
        to: "/court/registry/edit"
      }
    ]
  },

  {
    component: "CNavGroup",
    name: "2️⃣ تتبع القضايا",
    items: [
      {
        component: "CNavItem",
        name: "عرض مسار القضايا",
        to: "/court/cases/tracking"
      },
      {
        component: "CNavItem",
        name: "تحديث مراحل القضية",
        to: "/court/cases/update"
      }
    ]
  },

  {
    component: "CNavGroup",
    name: "3️⃣ الأرشيف والوثائق",
    items: [
      {
        component: "CNavItem",
        name: "رفع الوثائق",
        to: "/court/archive/upload"
      },
      {
        component: "CNavItem",
        name: "عرض الوثائق",
        to: "/court/archive"
      },
      {
        component: "CNavItem",
        name: "فلترة الأرشيف",
        to: "/court/archive/filter"
      }
    ]
  },

  {
    component: "CNavGroup",
    name: "4️⃣ الإشعارات",
    items: [
      {
        component: "CNavItem",
        name: "إدارة الإشعارات",
        to: "/court/notifications"
      },
      {
        component: "CNavItem",
        name: "إرسال إشعارات",
        to: "/court/notifications/send"
      }
    ]
  },

  // =========================================================
  // ⚖️ ROLE 2: وكيل الجمهورية
  // =========================================================
  {
    component: "CNavTitle",
    name: "⚖️ وكيل الجمهورية (القضاة + النيابة)"
  },

  {
    component: "CNavGroup",
    name: "1️⃣ متابعة القضايا",
    items: [
      {
        component: "CNavItem",
        name: "تتبع مسار القضايا",
        to: "/prosecutor/cases/tracking"
      },
      {
        component: "CNavItem",
        name: "فلترة القضايا",
        to: "/prosecutor/cases/filter"
      }
    ]
  },

  {
    component: "CNavGroup",
    name: "2️⃣ الأرشيف",
    items: [
      {
        component: "CNavItem",
        name: "عرض الأرشيف",
        to: "/prosecutor/archive"
      }
    ]
  },

  {
    component: "CNavGroup",
    name: "3️⃣ القرارات والإجراءات",
    items: [
      {
        component: "CNavItem",
        name: "إصدار قرارات قضائية",
        to: "/prosecutor/decisions/create"
      },
      {
        component: "CNavItem",
        name: "مراجعة الإجراءات",
        to: "/prosecutor/procedures"
      }
    ]
  },

  {
    component: "CNavGroup",
    name: "4️⃣ الإشعارات",
    items: [
      {
        component: "CNavItem",
        name: "التفاعل مع الإشعارات",
        to: "/prosecutor/notifications"
      }
    ]
  },

  {
    component: "CNavGroup",
    name: "5️⃣ المراسلات الرسمية",
    items: [
      {
        component: "CNavItem",
        name: "استقبال المكاتيب",
        to: "/prosecutor/correspondence/inbox"
      },
      {
        component: "CNavItem",
        name: "تنفيذ الأوامر",
        to: "/prosecutor/correspondence/execution"
      }
    ]
  }
]

export default courtNav

