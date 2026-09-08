# JHSSI — Journal of Humanities & Social Sciences Invention

An international, peer-reviewed, open-access academic publishing platform with double-blind peer review, multi-role dashboards, telemetry, and global killswitch control.

---

## 🌟 Key Features

- **Double-Blind Peer Review**: Dual-manuscript upload (Identified copy for editorial archives, Anonymized blind copy for peer reviewers). Reviewers only see anonymized manuscripts.
- **Continuous Revision Feedback Loop**: Reviewers evaluate papers against a 4-point rubric (Originality, Methodology, Clarity, Significance) and submit constructive comments. Authors receive alerts and submit iterative revisions (`v2+`) until approved.
- **Editorial Confirmation & Publishing**: Managing editors/admins grant final approval, assign Volume, Issue, DOI, and publication dates. Published papers dynamically appear on the public **Current Issue** and **Archives** pages with citation copy tools and PDF downloads.
- **Admin Manual Publishing**: Dedicated workflow to publish research papers with custom publication dates (past, present, or scheduled).
- **Super Admin Command Center**:
  - Global Website Killswitch (Maintenance Mode) with visitor block screen and Super Admin bypass.
  - Real-time technical telemetry and system audit logs.
  - User directory & role management.
- **Clean & Uncluttered Dashboards**: Tabbed, accordion-driven interfaces for Author, Reviewer, Admin, and Super Admin.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack) & React 19
- **Language**: TypeScript
- **Database & ORM**: SQLite (`prisma/dev.db`) with Prisma ORM — Zero external database setup needed
- **Authentication**: NextAuth.js (JWT & Session callbacks) with bcryptjs
- **Styling**: Tailwind CSS & Lucide Icons

---

## 🚀 Quick Setup

### 1. Clone & Install
```bash
git clone https://github.com/parasnath215/Jhssi.git
cd Jhssi
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Database Migration & Seeding
```bash
npx prisma db push
node prisma/seed.mjs
node prisma/seed_superadmin.mjs
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Accounts

| Role | Email | Password | Workspace | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Author** | `author@jhssi.com` | `password123` | `/author/dashboard` | 1-click button on login |
| **Reviewer** | `reviewer@jhssi.com` | `password123` | `/reviewer/dashboard` | 1-click button on login |
| **Admin** | `admin@jhssi.com` | `password123` | `/admin/dashboard` | 1-click button on login |
| **Super Admin** | `superadmin@jhssi.com` | `superadmin123` | `/super-admin/dashboard` | **Hidden** from login screen |

---

## 📄 License
Academic Open Access Journal License.
