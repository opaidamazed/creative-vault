/* ==========================================================
   Creative Vault — ملف الإعدادات
   كل اللي محتاج تعدله بعدين (روابط، أحجام، أعداد، إضافات جديدة)
   موجود هنا بس، من غير ما تلمس باقي الكود.
   ========================================================== */

window.VAULT_CONFIG = {

  siteName: "Creative Vault",
  tagline: "Your Creative Resources Hub",

  /* ---------- البنرات المتحركة في أول الموقع ---------- */
  banners: [
    { image: "assets/banner-1.webp", alt: "المكتبة الذكية للمؤثرات الصوتية" },
    { image: "assets/banner-2.webp", alt: "كل أدواتك الإبداعية في مكان واحد" },
    { image: "assets/banner-3.webp", alt: "إبداعاتك تستحق الأفضل دائماً" }
  ],
  bannerIntervalMs: 5000,

  /* ---------- المكتبات الثلاثة ----------
     url: حط هنا لينك التحميل (جوجل درايف أو أي مكان تاني)
     featured: true يظهر شارة "الأكثر تحميلاً" ويكبّر الكارت  */
  libraries: [
    {
      id: "music",
      title: "مكتبة الموسيقى",
      desc: "مجموعة مختارة من المقاطع الموسيقية المناسبة لمختلف أنواع الفيديوهات.",
      icon: "assets/icon-music.webp",
      count: "+200",
      countLabel: "مقطع",
      size: "1.8 GB",
      buttonText: "تحميل مكتبة الموسيقى",
      url: "#",   // <-- ضع لينك مكتبة الموسيقى هنا
      featured: false
    },
    {
      id: "sfx",
      title: "مكتبة المؤثرات الصوتية",
      desc: "مجموعة متنوعة من المؤثرات الصوتية لمشاريع المونتاج وصناعة المحتوى.",
      icon: "assets/icon-sfx.webp",
      count: "+500",
      countLabel: "مؤثر",
      size: "2.5 GB",
      buttonText: "تحميل مكتبة المؤثرات الصوتية",
      url: "#",   // <-- ضع لينك مكتبة المؤثرات هنا
      featured: true,
      badge: "الأكثر تحميلاً"
    },
    {
      id: "full",
      title: "المكتبة الكاملة",
      desc: "كل محتويات المكتبة الصوتية في ملف واحد لتحميل كل شيء مرة واحدة.",
      icon: "assets/icon-full.webp",
      count: "+700",
      countLabel: "ملف",
      size: "4.2 GB",
      buttonText: "تحميل المكتبة الكاملة",
      url: "#",   // <-- ضع لينك المكتبة الكاملة هنا
      featured: false
    }
  ],

  /* ---------- أحدث الإضافات ----------
     أضف عنصر جديد في أول القائمة وهيظهر أول واحد.
     thumb: صورة مصغرة (اختيارية) — لو فاضية بيظهر خلفية متدرجة
     isNew: true يظهر شارة NEW  */
  latest: [
    { title: "خامات بصرية عالية الجودة", size: "120 MB", thumb: "assets/latest-1.jpg", url: "#", isNew: true },
    { title: "مؤثرات دخان و ضباب",        size: "85 MB",  thumb: "assets/latest-2.jpg", url: "#" },
    { title: "إنتقالات مونتاج احترافية",  size: "320 MB", thumb: "assets/latest-3.jpg", url: "#" },
    { title: "مؤثرات طبيعية متنوعة",      size: "210 MB", thumb: "assets/latest-4.jpg", url: "#" }
  ],

  /* ---------- لماذا Creative Vault ---------- */
  features: [
    { icon: "headphones", title: "جودة عالية",       sub: "في جميع الملفات" },
    { icon: "bolt",       title: "تحميل سريع",       sub: "ومباشر" },
    { icon: "shield",     title: "أمن ومجاني",       sub: "100%" },
    { icon: "infinity",   title: "مكتبة متجددة",     sub: "بشكل مستمر" },
    { icon: "thumb",      title: "تصميم احترافي",    sub: "وسهل الاستخدام" }
  ],

  /* ---------- السوشيال (لينكات البنر الأخير والفوتر) ---------- */
  social: {
    youtube:   "#",
    facebook:  "#",
    instagram: "#",
    telegram:  "#"
  },

  aboutUrl: "#about",
  aboutBanner: "assets/about-banner.webp",
  contactUrl: "#"   // لينك التواصل (واتساب / تليجرام ...)
};
