/* ==========================================================
   إعدادات Firebase (Web App)
   خد القيم من: Firebase Console ← Project settings ← Your apps ← Web app
   ما تقلقش: مفتاح الـ Web مش سري، الحماية الحقيقية في firestore.rules.
   لو سيبت القيم دي كما هي، الموقع هيشتغل بالإعدادات اللي في config.js
   من غير لوحة تحكم ولا عدّاد تحميلات.
   ========================================================== */
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  appId: "YOUR_APP_ID"
};
