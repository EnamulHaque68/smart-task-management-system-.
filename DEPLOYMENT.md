# 🚀 Live Deployment Guide — TaskFlow

This project is configured for cloud deployment with:
- **Backend & Database:** [Render.com](https://render.com) (Node.js Web Service + Managed PostgreSQL)
- **Frontend:** [Vercel](https://vercel.com) (React + Vite SPA)

---

## Step 1: Push Code to GitHub

Open your terminal in the project root and run:
```powershell
git push -u origin main
```
> **Note:** A browser window will pop up asking to authorize Git Credential Manager with your GitHub account (`EnamulHaque68`). Click **Authorize** to finish pushing.

---

## Step 2: Deploy Database on Render (Free)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **PostgreSQL**.
2. **Name:** `taskflow-db`
3. **Database:** `bright_mind_db`
4. **User:** `postgres`
5. **Plan:** Free
6. Click **Create Database**.
7. Once created, copy the **Internal Database URL** (or External Database URL if deploying backend elsewhere).

---

## Step 3: Deploy Backend on Render

1. On Render, click **New +** -> **Web Service**.
2. Connect your GitHub repository: `EnamulHaque68/smart-task-management-system-`.
3. Set the following settings:
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
4. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `DATABASE_URL` = *(Paste the Render PostgreSQL connection string from Step 2)*
   - `JWT_SECRET` = `bright_mind_task_secret_key_2026_super_secure`
   - `JWT_EXPIRES_IN` = `7d`
   - `CLIENT_URL` = `*` *(or your Vercel URL once deployed)*
5. Click **Deploy Web Service**.
6. **Database Tables Auto-Initialize:**
   - The server is built to automatically detect missing tables and execute migrations & seed demo data on first startup!
   - Alternatively, if using **Neon PostgreSQL** (console.neon.tech), you can open the **SQL Editor** in Neon and paste the contents of `server/migrations/neon_complete_setup.sql`, then click **Run**.
7. Copy your backend live URL (e.g. `https://taskflow-server-xxxx.onrender.com`).

---

## Step 4: Deploy Frontend on Vercel (Free)

1. Go to [Vercel Dashboard](https://vercel.com/) and click **Add New...** -> **Project**.
2. Import repository: `smart-task-management-system-`.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and select `client`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://taskflow-server-xxxx.onrender.com` *(Your Render backend URL without trailing slash)*
5. Click **Deploy**.
6. Your TaskFlow application is now **LIVE** on the internet! 🎉

---

## 🔑 Default Login Credentials:
- **Email:** `demo@brightmind.com`
- **Password:** `password123`
