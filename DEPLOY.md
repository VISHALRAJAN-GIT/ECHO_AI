# ECHO_AI - Deployment Guide

## Local Development

```bash
cd frontend
npm install
npm run dev
```

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

---

## Deploy to Render

### Option 1: Static Site (Recommended)

1. Go to [render.com](https://render.com) and sign up
2. Click **"New Static Site"**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Click **"Create Static Site"**

### Option 2: Web Service

1. Go to [render.com](https://render.com) and sign up
2. Click **"New Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Set environment variables if needed
6. Click **"Create Web Service"**

---

## Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site"** → **"Deploy manually"**
3. Drag and drop the `dist` folder
4. Your site will be live!

Or connect via GitHub for automatic deployments.

---

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**

---

## Admin Credentials

- **Email:** admin@echoai.com
- **Password:** admin123

---

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- React Router
- Lucide Icons
- localStorage (for data persistence)

## Important Notes

- This is a client-side only app (no backend)
- All data is stored in browser's localStorage
- For production with real database, you'll need to add a backend
