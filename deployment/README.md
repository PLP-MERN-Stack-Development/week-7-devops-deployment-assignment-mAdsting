# Deployment Guide

This directory contains deployment configuration files and scripts for deploying the MERN Bug Tracker application.

## Backend Deployment

### Render (Recommended)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following environment variables:
   - `NODE_ENV=production`
   - `MONGODB_URI=your-mongodb-atlas-connection-string`
   - `JWT_SECRET=your-secure-jwt-secret`
   - `FRONTEND_PRODUCTION_URL=https://your-frontend-domain.com`
4. Set build command: `npm install`
5. Set start command: `npm start`

### Railway
1. Create a new project on Railway
2. Connect your GitHub repository
3. Set environment variables as above
4. Railway will automatically detect and deploy your Node.js app

### Heroku
1. Create a new app on Heroku
2. Connect your GitHub repository
3. Set environment variables using `heroku config:set`
4. Deploy using `git push heroku main`

## Frontend Deployment

### Vercel (Recommended)
1. Import your GitHub repository to Vercel
2. Set the following environment variables:
   - `VITE_API_URL=https://your-backend-domain.com`
3. Vercel will automatically build and deploy your React app

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables as needed

### GitHub Pages
1. Enable GitHub Pages in your repository settings
2. Set source to GitHub Actions
3. Use the provided GitHub Actions workflow for deployment

## Environment Variables

Make sure to set the following environment variables in your deployment platform:

### Backend
- `NODE_ENV=production`
- `MONGODB_URI=your-mongodb-atlas-connection-string`
- `JWT_SECRET=your-secure-jwt-secret`
- `FRONTEND_PRODUCTION_URL=https://your-frontend-domain.com`

### Frontend
- `VITE_API_URL=https://your-backend-domain.com`

## Health Checks

After deployment, test your endpoints:
- Backend health: `GET /health`
- API endpoint: `GET /api/bugs`

## Monitoring

Consider setting up:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Performance monitoring (New Relic, DataDog)
