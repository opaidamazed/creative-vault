/* ==========================================================
   Creative Vault — ملف الإعدادات (القيم الافتراضية)
   -----------------------------------------------------------
   لو فعّلت Firebase ولوحة التحكم (/admin) هتتحكم في المكتبات
   والإضافات والسوشيال من اللوحة، والقيم اللي هنا بتبقى احتياطي
   بيظهر لو Firebase مش متفعل أو حصل فيه عطل.
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

  /* ---------- المكتبات الثلاثة ---------- */
  libraries: [
    {
      id: "music",
      order: 2,
      title: "مكتبة الموسيقى",
      desc: "مجموعة مختارة من المقاطع الموسيقية المناسبة لمختلف أنواع الفيديوهات.",
      icon: "assets/icon-music.webp",
      count: "50",
      countLabel: "ملف",
      size: "556 MB",
      buttonText: "تحميل مكتبة الموسيقى",
      url: "https://drive.google.com/file/d/1B-00UwQzO3VR5L_Vp32hHymRsX96onJs/view?usp=sharing",
      featured: false
    },
    {
      id: "sfx",
      order: 1,
      title: "مكتبة المؤثرات الصوتية",
      desc: "مجموعة متنوعة من المؤثرات الصوتية لمشاريع المونتاج وصناعة المحتوى.",
      icon: "assets/icon-sfx.webp",
      count: "208",
      countLabel: "ملف",
      size: "111 MB",
      buttonText: "تحميل مكتبة المؤثرات الصوتية",
      url: "https://drive.google.com/file/d/1Fepe34wAjnjGvxvr5LapwSJ3o4rWC-XW/view?usp=drive_link",
      featured: true,
      badge: "الأكثر تحميلاً"
    },
    {
      id: "full",
      order: 0,
      title: "المكتبة الكاملة",
      desc: "مكتبة المؤثرات والموسيقى معاً في مكان واحد لتحميل كل شيء مرة واحدة.",
      icon: "assets/icon-full.webp",
      count: "2",
      countLabel: "مجلدين",
      size: "671 MB",
      buttonText: "تحميل المكتبة الكاملة",
      // مجلد درايف مينفعش يتحمل مباشرة، فالمكتبة الكاملة = تحميل ملفّي الموسيقى والمؤثرات مع بعض
      // (لو عندك ملف واحد فيه المكتبة كلها، حط لينكه هنا بدالهم)
      url: [
        "https://drive.google.com/file/d/1B-00UwQzO3VR5L_Vp32hHymRsX96onJs/view?usp=sharing",
        "https://drive.google.com/file/d/1Fepe34wAjnjGvxvr5LapwSJ3o4rWC-XW/view?usp=drive_link"
      ].join("\n"),
      featured: false
    }
  ],

  /* ملحوظة تظهر تحت كروت المكتبات */
  sizeNote: "الأحجام المذكورة قبل فك الضغط.",

  /* ---------- أحدث الإضافات ----------
     فاضية دلوقتي: القسم بيتخفى لحد ما تضيف أول ملحق من لوحة التحكم
     (أو من هنا بنفس الشكل):
     { id:"x1", title:"اسم الملحق", size:"120 MB", url:"...", thumb:"assets/x.webp",
       category:"sfx", isNew:true, createdAt: 1730000000000 }  */
  latest: [],

  /* ---------- لماذا Creative Vault ---------- */
  features: [
    { icon: "headphones", title: "جودة عالية",    sub: "في جميع الملفات" },
    { icon: "bolt",       title: "تحميل سريع",    sub: "ومباشر" },
    { icon: "shield",     title: "أمن ومجاني",    sub: "100%" },
    { icon: "infinity",   title: "مكتبة متجددة",  sub: "بشكل مستمر" },
    { icon: "thumb",      title: "تصميم احترافي", sub: "وسهل الاستخدام" }
  ],

  /* ---------- السوشيال ---------- */
  social: {
    youtube:   "#",
    facebook:  "#",
    instagram: "#",
    telegram:  "#"
  },

  aboutUrl: "about",
  aboutBanner: "assets/about-banner.webp",
  /* لينك تواصل إضافي اختياري (واتساب / تليجرام): بيظهر كزرار في صفحة "تواصل معنا" */
  contactUrl: "#",

  /* صفحة تواصل معنا: الإيميل اللي بتوصله الرسايل */
  contact: { email: "obaidamazed@gmail.com" }
};
