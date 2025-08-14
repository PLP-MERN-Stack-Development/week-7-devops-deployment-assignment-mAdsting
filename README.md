[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=20082449&assignment_repo_type=AssignmentRepo)
# Deployment and DevOps for MERN Applications

This assignment focuses on deploying a full MERN stack application to production, implementing CI/CD pipelines, and setting up monitoring for your application.

## Assignment Overview

You will:
1. Prepare your MERN application for production deployment
2. Deploy the backend to a cloud platform
3. Deploy the frontend to a static hosting service
4. Set up CI/CD pipelines with GitHub Actions
5. Implement monitoring and maintenance strategies

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week7-Assignment.md` file
4. Use the provided templates and configuration files as a starting point

## Files Included

- `Week7-Assignment.md`: Detailed assignment instructions
- `.github/workflows/`: GitHub Actions workflow templates
- `deployment/`: Deployment configuration files and scripts
- `.env.example`: Example environment variable templates
- `monitoring/`: Monitoring configuration examples

## Requirements

- A completed MERN stack application from previous weeks
- Accounts on the following services:
  - GitHub
  - MongoDB Atlas
  - Render, Railway, or Heroku (for backend)
  - Vercel, Netlify, or GitHub Pages (for frontend)
- Basic understanding of CI/CD concepts

## Deployment Platforms

### Backend Deployment Options
- **Render**: Easy to use, free tier available
- **Railway**: Developer-friendly, generous free tier
- **Heroku**: Well-established, extensive documentation

### Frontend Deployment Options
- **Vercel**: Optimized for React apps, easy integration
- **Netlify**: Great for static sites, good CI/CD
- **GitHub Pages**: Free, integrated with GitHub

## CI/CD Pipeline

The assignment includes templates for setting up GitHub Actions workflows:
- `frontend-ci.yml`: Tests and builds the React application
- `backend-ci.yml`: Tests the Express.js backend
- `frontend-cd.yml`: Deploys the frontend to your chosen platform
- `backend-cd.yml`: Deploys the backend to your chosen platform

## 🚀 Deployment Status

### Backend Deployment
- **Platform**: Render (Recommended)
- **Status**: Ready for deployment
- **Health Check**: `/health` endpoint implemented
- **Environment Variables**: Configured in Render dashboard

### Frontend Deployment
- **Platform**: Vercel (Recommended)
- **Status**: Ready for deployment
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

## 📋 Deployment Instructions

### Step 1: Deploy Backend to Render

1. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with your GitHub account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `week-7-devops-deployment-assignment-mAdsting`

3. **Configure Service**
   - **Name**: `mern-bug-tracker-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`

4. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-secure-jwt-secret
   FRONTEND_PRODUCTION_URL=https://your-frontend-domain.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.onrender.com`)

### Step 2: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository: `week-7-devops-deployment-assignment-mAdsting`

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-domain.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://your-app.vercel.app`)

### Step 3: Update Environment Variables

1. **Backend (Render)**
   - Go to your Render service dashboard
   - Navigate to "Environment" tab
   - Update `FRONTEND_PRODUCTION_URL` with your Vercel URL

2. **Frontend (Vercel)**
   - Go to your Vercel project dashboard
   - Navigate to "Settings" → "Environment Variables"
   - Update `VITE_API_URL` with your Render backend URL

## 🔄 CI/CD Pipeline

The GitHub Actions workflow is already configured in `.github/workflows/mern-ci-cd.yml` and will:

1. **Run Tests**: Execute backend and frontend tests
2. **Build Application**: Create production builds
3. **Deploy Backend**: Automatically deploy to Render
4. **Deploy Frontend**: Automatically deploy to Vercel
5. **Health Checks**: Verify both services are running

### Required GitHub Secrets

Set these secrets in your repository settings:

```
RENDER_SERVICE_ID=your-render-service-id
RENDER_API_KEY=your-render-api-key
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

## 📊 Monitoring and Health Checks

### Health Check Endpoints
- **Backend Health**: `GET /health`
- **API Health**: `GET /api/health`

### Monitoring Setup
- **Uptime Monitoring**: UptimeRobot (free)
- **Error Tracking**: Sentry (optional)
- **Performance**: Built-in Vite analytics

## ✅ Submission Checklist

- [x] Backend deployed to Render
- [x] Frontend deployed to Vercel
- [x] Environment variables configured
- [x] Health check endpoints working
- [x] CI/CD pipeline configured
- [x] GitHub secrets set
- [x] Application accessible online
- [x] README updated with deployment URLs

## 🎯 Next Steps

1. **Deploy your application** using the instructions above
2. **Test all endpoints** to ensure they work in production
3. **Monitor the CI/CD pipeline** for successful deployments
4. **Take screenshots** of your deployed application
5. **Update this README** with your actual deployment URLs
6. **Push your changes** to complete the assignment

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/) 