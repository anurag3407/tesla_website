<div align="center">
  <h1>🚀 TESLA Technical Club Website</h1>
  <p>The official web platform for the TESLA Technical Club. Built with Next.js 16, Supabase (PostgreSQL), and Tailwind CSS.</p>
</div>

---

## 🌟 About the Project
This is a full-stack, highly interactive web application designed to serve as the central hub for the **TESLA Technical Club** at NIT Patna. It manages club operations, event registrations, alumni networking, resources, gallery showcases, and multi-role dashboards.

### ✨ Key Features
- **Dynamic Public Pages**: Brutalist terminal & glassmorphic UI for Home, About, Events, Team, Blogs, Gallery, Developers, and Alumni.
- **Supabase PostgreSQL & Storage**: Modern relational database with Row Level Security (RLS) and storage buckets.
- **6-Day Auto-Pause Prevention Heartbeat**: Automated cron engine (GitHub Actions + Vercel Cron) that pings Supabase every 6th day to keep free-tier clusters active 24/7 without manual intervention.
- **Member & Admin Dashboards**: Role-based access control (Admin, PI, President, OfficeBearer, TeamLeader, TeamMember, Alumni).
- **Automated Vitest Test Harness**: 40+ unit and integration test cases guarding auth, APIs, and security rules.
- **PWA Ready**: Progressive Web App with manifest and touch icon configurations.

---

## 🛠 Tech Stack
- **Frontend**: Next.js 16.2 (App Router), React 19, Tailwind CSS v4, Framer Motion, Three.js
- **Database & Storage**: **Supabase** (PostgreSQL, Storage, RLS)
- **Keep-Alive Engine**: GitHub Actions (`.github/workflows/supabase-keep-alive.yml`) + Vercel Cron (`vercel.json`)
- **Testing**: Vitest (`npm run test`)
- **Security**: Jose, bcryptjs, jsonwebtoken (JWT), Edge Proxy Middleware

---

## 🚀 Supabase Setup & Migration

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Note your **Project URL**, **Anon Key**, and **Service Role Key** under `Project Settings` → `API`.

### 2. Apply the Database Schema
1. Open the **SQL Editor** in your Supabase dashboard.
2. Copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. (Optional) Run [`supabase/seed.sql`](supabase/seed.sql) to create the default admin user and initial teams.

### 3. Environment Variables
Add the following to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

CRON_SECRET=your-random-cron-secret
JWT_SECRET=your-secure-jwt-secret-at-least-32-chars
```

---

## 🛡️ 6-Day Supabase Keep-Alive Engine

Supabase free-tier projects automatically pause after 7 days of inactivity. To eliminate this issue permanently:

1. **GitHub Actions (`.github/workflows/supabase-keep-alive.yml`)**:
   - Runs on schedule: `0 3 */6 * *` (Every 6th day).
   - Executes an authenticated POST request to `/api/cron/keep-alive`.
   - In your GitHub repository settings, add `CRON_SECRET` and `NEXT_PUBLIC_SITE_URL` to **Repository Secrets**.

2. **Vercel Cron (`vercel.json`)**:
   - Pings `/api/cron/keep-alive?source=vercel_cron` every 5 days.

3. **Manual / CLI Ping**:
   - Test or trigger the keep-alive ping anytime via npm:
   ```bash
   npm run ping:supabase
   ```
   - Or use the "Ping Supabase Now" button inside the **Admin Overview Panel**.

---

## 💻 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/anurag3407/tesla_website.git
   cd tesla_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser.

4. **Run Tests & Linter**
   ```bash
   npm run test
   npm run lint
   ```

---

## 🤝 Contributing
Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting a Pull Request.
