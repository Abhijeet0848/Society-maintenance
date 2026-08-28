# ☁️ 100% Cloudflare Fullstack Deployment Guide

This guide gives you the exact steps to deploy the entire project (Frontend + API Backend + MongoDB Atlas connection) completely on **Cloudflare**.

---

## 🏗️ How 100% Cloudflare Fullstack Works

```
                        ┌────────────────────────────────────────────────────────┐
                        │              Cloudflare Edge Network                   │
                        │                                                        │
User Browser ──────────>│  1. Static Assets (Vite React)  --> / (Cloudflare Pages)
                        │  2. API Requests (/api/*)       --> /api (Functions)   │
                        └───────────────────────┬────────────────────────────────┘
                                                │
                                                ▼
                                    MongoDB Atlas Cloud
                            (cluster1.ph5nmmj.mongodb.net)
```

1. **Frontend & Backend under 1 Domain**: No CORS issues. Both static UI and API routes run directly under your `https://vrundavan-society.pages.dev` (or custom domain).
2. **Edge Node Compatibility**: Powered by Cloudflare's `nodejs_compat` runtime flag configured in [`wrangler.toml`](file:///E:/Society%20maintenance/Society-maintenance/wrangler.toml).

---

## 🚀 Step-by-Step Deployment on Cloudflare Pages

### Step 1: Push Code to GitHub / GitLab
Make sure all recent changes and configurations are committed and pushed:
```bash
git add .
git commit -m "Configure 100% Cloudflare Pages fullstack deployment"
git push origin main
```

---

### Step 2: Create a Cloudflare Pages Project
1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository: `Abhijeet0848/Society-maintenance`.
4. Configure the build settings:
   - **Project Name**: `vrundavan-society`
   - **Production Branch**: `main`
   - **Framework preset**: `Vite`
   - **Root directory**: `client`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

---

### Step 3: Configure Environment Variables & Node Compatibility
1. Under **Environment variables (Advanced)** in the Cloudflare Pages creation screen, add:
   - `MONGODB_URI`:
     ```
     mongodb+srv://gautamabhijeet050_db_user:XA5pl6w7dkRmP0Rp@cluster1.ph5nmmj.mongodb.net/society-maintenance?retryWrites=true&w=majority&appName=Cluster1
     ```
   - `JWT_SECRET`:
     ```
     vrundavan_super_secret_jwt_key_2026_secure
     ```
   - `NODE_VERSION`: `20`

2. Under **Settings** > **Functions** > **Compatibility flags**:
   - Add: `nodejs_compat`
   - Compatibility date: `2024-09-23` (or latest)

---

### Step 4: Deploy & Access Your Live App!
1. Click **Save and Deploy**.
2. Cloudflare will build the Vite assets, package the Edge functions, and assign your live production URL:
   ```
   https://vrundavan-society.pages.dev
   ```
3. Your application is now 100% live on Cloudflare with global edge distribution, automatic SSL certificate, DDoS protection, and connected to your MongoDB Atlas cluster!
