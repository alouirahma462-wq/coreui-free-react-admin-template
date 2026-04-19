const inspectionNav = [
  // ================= HEADER =================
  {
    component: "CNavTitle",
    name: "🏛️ لوحة التفقد والإشراف العام"
  },

  // =========================================================
  // 1️⃣ الرقابة على القضايا
  // =========================================================
  {
    component: "CNavGroup",
    name: "📊 الرقابة على القضايا",
    items: [
      {
        component: "CNavItem",
        name: "فلترة القضايا حسب المعطيات",
        to: "/inspection/cases/filter"
      },
      {
        component: "CNavItem",
        name: "الاطلاع على الوثائق",
        to: "/inspection/documents"
      },
      {
        component: "CNavItem",
        name: "متابعة مسار القضايا",
        to: "/inspection/cases/tracking"
      }
    ]
  },

  // =========================================================
  // 2️⃣ المراسيم والمكاتيب
  // =========================================================
  {
    component: "CNavGroup",
    name: "📜 المراسيم والمكاتيب والتوجيهات",
    items: [
      {
        component: "CNavItem",
        name: "إصدار المراسيم",
        to: "/inspection/decrees"
      },
      {
        component: "CNavItem",
        name: "إصدار المكاتيب",
        to: "/inspection/circulars"
      },
      {
        component: "CNavItem",
        name: "إصدار التوجيهات",
        to: "/inspection/directives"
      }
    ]
  },

  // =========================================================
  // 3️⃣ إدارة المستخدمين
  // =========================================================
  {
    component: "CNavGroup",
    name: "👤 إدارة المستخدمين والصلاحيات",
    items: [
      {
        component: "CNavItem",
        name: "إضافة مستخدم",
        to: "/inspection/users/create"
      },
      {
        component: "CNavItem",
        name: "تعديل المستخدمين",
        to: "/inspection/users/edit"
      },
      {
        component: "CNavItem",
        name: "حذف مستخدم",
        to: "/inspection/users/delete"
      },
      {
        component: "CNavItem",
        name: "إدارة الأدوار والصلاحيات",
        to: "/inspection/roles"
      }
    ]
  },

  // =========================================================
  // 4️⃣ مراقبة النظام
  // =========================================================
  {
    component: "CNavGroup",
    name: "🧾 مراقبة النظام (Logs)",
    items: [
      {
        component: "CNavItem",
        name: "سجلات النظام",
        to: "/inspection/logs"
      },
      {
        component: "CNavItem",
        name: "تتبع العمليات",
        to: "/inspection/activity"
      },
      {
        component: "CNavItem",
        name: "نشاط المستخدمين",
        to: "/inspection/users/activity"
      }
    ]
  },

  // =========================================================
  // 5️⃣ التدخل القضائي
  // =========================================================
  {
    component: "CNavGroup",
    name: "⚖️ التدخل القضائي",
    items: [
      {
        component: "CNavItem",
        name: "تعديل القضايا",
        to: "/inspection/cases/edit"
      },
      {
        component: "CNavItem",
        name: "إعادة فتح القضايا",
        to: "/inspection/cases/reopen"
      },
      {
        component: "CNavItem",
        name: "قفل القضايا",
        to: "/inspection/cases/close"
      }
    ]
  },

  // =========================================================
  // 6️⃣ الإشعارات
  // =========================================================
  {
    component: "CNavGroup",
    name: "🔔 الإشعارات والتواصل",
    items: [
      {
        component: "CNavItem",
        name: "إرسال إشعارات عامة",
        to: "/inspection/notifications"
      },
      {
        component: "CNavItem",
        name: "إشعارات القضاة والنيابة",
        to: "/inspection/notifications/judges"
      },
      {
        component: "CNavItem",
        name: "استقبال الردود",
        to: "/inspection/notifications/responses"
      }
    ]
  },

  // =========================================================
  // 7️⃣ التقارير والتحليل
  // =========================================================
  {
    component: "CNavGroup",
    name: "📈 التقارير والتحليل الذكي",
    items: [
      {
        component: "CNavItem",
        name: "تصدير PDF / Excel",
        to: "/inspection/reports/export"
      },
      {
        component: "CNavItem",
        name: "تحليل حسب المحاكم",
        to: "/inspection/reports/courts"
      },
      {
        component: "CNavItem",
        name: "تحليل حسب القضاة",
        to: "/inspection/reports/judges"
      },
      {
        component: "CNavItem",
        name: "متوسط مدة المعالجة",
        to: "/inspection/reports/avg-time"
      },
      {
        component: "CNavItem",
        name: "حجم العمل",
        to: "/inspection/reports/workload"
      },
      {
        component: "CNavItem",
        name: "تحليل شهري للقضايا",
        to: "/inspection/reports/monthly"
      }
    ]
  },

  // =========================================================
  // 8️⃣ الذكاء الاصطناعي
  // =========================================================
  {
    component: "CNavGroup",
    name: "🤖 الذكاء الاصطناعي والتحليل المتقدم",
    items: [
      {
        component: "CNavItem",
        name: "Data Pipeline",
        to: "/inspection/ai/pipeline"
      },
      {
        component: "CNavItem",
        name: "كشف الأنماط",
        to: "/inspection/ai/patterns"
      },
      {
        component: "CNavItem",
        name: "تحليل زمني",
        to: "/inspection/ai/timeline"
      },
      {
        component: "CNavItem",
        name: "خريطة المحاكم",
        to: "/inspection/ai/map"
      }
    ]
  }
]

export default inspectionNav
