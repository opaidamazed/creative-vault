# Creative Vault

<p align="center">
  <img src="assets/logo.png" alt="Creative Vault logo" width="112">
</p>

<h3 align="center">Your Creative Resources Hub</h3>

<p align="center">
  A curated library of creative resources for designers, video editors, and content creators.
  <br>
  <strong>One place. Useful assets. More room to create.</strong>
</p>

<p align="center">
  <a href="https://github.com/opaidamazed/creative-vault/stargazers"><img src="https://img.shields.io/github/stars/opaidamazed/creative-vault?style=for-the-badge&color=22c55e" alt="GitHub stars"></a>
  <a href="https://github.com/opaidamazed/creative-vault/network/members"><img src="https://img.shields.io/github/forks/opaidamazed/creative-vault?style=for-the-badge" alt="GitHub forks"></a>
  <a href="https://github.com/opaidamazed/creative-vault/issues"><img src="https://img.shields.io/github/issues/opaidamazed/creative-vault?style=for-the-badge" alt="GitHub issues"></a>
  <img src="https://img.shields.io/badge/HTML-CSS-JavaScript-informational?style=for-the-badge" alt="HTML CSS JavaScript">
</p>

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-setup--deployment">Setup</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Overview

**Creative Vault** is a lightweight, responsive web library built to make useful creative resources easier to discover and download. It brings sound effects, music, and other design or video-editing assets together in one organized place.

The project focuses on a clean browsing experience, clear resource information, and simple content management without requiring a complex backend or build pipeline.

**Creative Vault مش مجرد روابط تحميل؛ هو مكان منظم للمصادر الإبداعية، هدفه يسهّل على المصممين وصناع المحتوى الوصول للأدوات والملفات اللي يحتاجوها.**

## 🚀 Features

- **Resource libraries** — dedicated cards for curated collections such as sound effects, music, and the complete library.
- **Resource details** — individual pages with descriptions, metadata, and a list of included contents.
- **Search and browsing** — search, categories, and sorting for the latest resources.
- **Admin dashboard** — manage libraries, new resources, download links, descriptions, and site social links.
- **Firebase integration** — Firestore data, Google authentication for the admin dashboard, and download counters.
- **Fallback configuration** — the public site can use local default data when Firebase is not configured or unavailable.
- **Responsive interface** — designed for desktop and mobile screens, with an RTL Arabic interface and a purple/green visual identity.
- **Simple deployment** — static HTML, CSS, and JavaScript; no build step required.

**الموقع بيدعم العربية، وواجهة الاستخدام مصممة باتجاه RTL، مع تجربة بسيطة على الموبايل والكمبيوتر.**

## 🧰 Built With

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure |
| CSS3 | Responsive layout and visual styling |
| Vanilla JavaScript | UI, navigation, search, and resource rendering |
| Firebase Authentication | Admin sign-in with Google |
| Cloud Firestore | Libraries, latest resources, settings, and counters |
| GitHub Pages | Static website hosting |

## 📁 Project Structure

```text
creative-vault/
├── index.html              # Home page
├── library.html            # All libraries and resources
├── details.html            # Library/resource details
├── about.html              # About the project
├── contact.html            # Contact form
├── admin.html              # Admin dashboard
├── SETUP-AR.md             # Arabic Firebase and deployment guide
├── firestore.rules         # Firestore security rules template
├── assets/                 # Logo, banners, icons, and images
├── css/
│   ├── style.css           # Main theme and shared styles
│   ├── pages.css           # Shared inner-page styles
│   ├── admin.css           # Admin dashboard styles
│   └── details.css         # Resource details page styles
└── js/
    ├── config.js           # Default site content and settings
    ├── firebase-config.js  # Firebase web app configuration
    ├── data.js             # Data layer and Firebase integration
    ├── common.js           # Shared UI, cards, and download-link handling
    ├── app.js              # Home page behavior
    ├── library.js          # Library page behavior
    ├── details.js          # Resource details behavior
    └── admin.js            # Admin dashboard behavior
```

## ⚙️ Setup & Deployment

### 1. Get the project

```bash
git clone https://github.com/opaidamazed/creative-vault.git
cd creative-vault
```

### 2. Run locally

You can open `index.html` directly to preview the default configuration. To test Firebase features, run a local HTTP server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

### 3. Configure Firebase (optional)

1. Create a Firebase project.
2. Enable **Cloud Firestore** and **Google Authentication**.
3. Add your Firebase web app values to `js/firebase-config.js`.
4. Configure `firestore.rules` and replace `ADMIN_EMAIL_HERE` with the admin Google account email.
5. Open `admin.html` and sign in with the authorized account.

For the full walkthrough, see **[SETUP-AR.md](SETUP-AR.md)**.

### 4. Deploy with GitHub Pages

1. Push the project to your GitHub repository.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**, then choose `main` and `/ (root)` (or the branch used by your deployment).
4. Save and wait for GitHub Pages to publish the site.
5. If Firebase is enabled, add your published domain to Firebase Authentication's authorized domains.

## 🗂️ Managing Resources

Resource information can be managed from the admin dashboard when Firebase is configured. Each library or resource can have a title, description, size, image, contents list, and download URL.

For downloadable archives, upload each ZIP as an asset in a GitHub Release, then copy its asset URL into the corresponding **Download URL** field in the dashboard. Keep each library's release/tag and asset URL organized so updates can be made independently.

**نصيحة تنظيمية:** خليك محافظ على اسم واضح لكل ملف ZIP ولكل Release؛ ده هيسهّل تحديث مكتبة واحدة من غير التأثير على باقي المكتبات.

## 🤝 Contributing

Suggestions, bug reports, and improvements are welcome.

1. Fork the repository.
2. Create a branch for your change.
3. Make your update and test it locally.
4. Open a pull request with a clear description.

For bugs or feature ideas, please [open an issue](https://github.com/opaidamazed/creative-vault/issues).

## ⭐ Support the Project

If Creative Vault is useful to you, please consider giving the repository a **Star**. It helps more creators discover the project and encourages continued development.

<p align="center">
  <a href="https://github.com/opaidamazed/creative-vault">
    <img src="https://img.shields.io/badge/⭐%20Star%20Creative%20Vault-on%20GitHub-22c55e?style=for-the-badge" alt="Star Creative Vault on GitHub">
  </a>
</p>

**لو شايف إن الفكرة مفيدة، اعمل Star ⭐ وشارك المشروع مع أي مصمم أو صانع محتوى ممكن يستفيد منه. دعمك بيفرق وبيساعد المشروع يكبر.**

## 📄 License

No license file is currently included. Unless a license is added to this repository, the project should not be assumed to grant broad reuse, redistribution, or modification permissions.

---

<p align="center">
  Made for creators, by creators.
  <br>
  <strong>Creative Vault</strong>
</p>
