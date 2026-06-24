# LGEMP Speculative Propulsion Research Portal (Railway Edition)

This directory contains a modern, responsive React + Vite + Tailwind CSS website compiling the scientific peer-reviews, expert board evaluations, quantitative scaling calculations, and physical engine redesigns for the Localized Gravitoelectromagnetic Metric Propulsion (LGEMP) project.

It is fully configured for deployment on **Railway** using an Express production server to serve the compiled static build and support SPA routing.

---

## 🛠️ Local Verification

To run and verify the website locally:

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Build the Production Bundle**:
   ```bash
   npm run build
   ```
3. **Start the Production Server**:
   ```bash
   npm start
   ```
   By default, the server will start on `http://localhost:8080` (or the port defined in the `PORT` environment variable).

---

## 🌐 Railway Deployment Guide

To deploy this project to Railway, follow these steps:

### 1. Repository Setup
1. Push the `propulsion-website` project to your GitHub repository.

### 2. Railway Project Creation
1. Go to the [Railway Console](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub**.
3. Select your repository.
4. If your repository contains multiple projects (monorepo), go to the Service's **Settings** tab:
   * **Root Directory**: Set to `propulsion-website`
   * **Build Command**: Set to `npm run build`
   * **Start Command**: Set to `npm start`
5. Railway's Nixpacks will automatically build the React assets and boot the Express server on `server.js` using the dynamic port allocated via `process.env.PORT`.

### 3. Environment Variables Config
Navigate to the **Variables** tab of your service on Railway and add the following variables:
* `NODE_ENV`: `production`
* `PORT`: (Leave empty, Railway binds this dynamically)
* `MONGO_URI`: Your production MongoDB Atlas connection string (e.g. `mongodb+srv://...`). Note: While this frontend app does not directly make DB queries, the backend uses it, and the frontend server prints validation logs on boot.

---

## 📋 Pre-Launch Verification Checklist

* [ ] **Local Build**: Run `npm run build` locally to ensure there are no syntax or typescript compilation errors.
* [ ] **Express Server check**: Run `npm start` and verify that the console outputs diagnostic values (e.g. `MONGO_URI exists`, `PORT = 8080`, `Propulsion Website is running on port 8080`).
* [ ] **Railway Variables Configuration**: Ensure `NODE_ENV` and your production credentials are set in the dashboard.
* [ ] **Deployment logs audit**: Verify the Nixpacks container starts cleanly on `0.0.0.0` inside Railway's deploy logs.
