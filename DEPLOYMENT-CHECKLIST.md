# 🚀 Deployment Checklist

This checklist will help you complete all the requirements for the Week 7 DevOps and Deployment assignment.

## ✅ Pre-Deployment Setup

### GitHub Repository
- [ ] Repository cloned from GitHub Classroom
- [ ] All files committed and pushed
- [ ] GitHub Actions workflows are working
- [ ] Repository is public (for free hosting)

### Accounts Created
- [ ] MongoDB Atlas account
- [ ] Render account (for backend)
- [ ] Vercel account (for frontend)
- [ ] GitHub account (already have)

### Local Development
- [ ] Application runs locally
- [ ] Tests pass (`npm test`)
- [ ] Build works (`npm run build`)
- [ ] Environment variables configured

## 🎯 Task 1: Prepare Application for Production

### Backend Optimization
- [ ] Error handling implemented
- [ ] Security headers configured (Helmet)
- [ ] Environment variables set up
- [ ] Production logging configured
- [ ] Health check endpoint working (`/health`)

### Frontend Optimization
- [ ] Production build working
- [ ] Environment variables configured
- [ ] API URL configurable
- [ ] Error boundaries implemented

### Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user with proper permissions
- [ ] Connection string ready
- [ ] Database accessible from internet

## 🚀 Task 2: Deploy Backend

### Render Deployment
- [ ] New Web Service created on Render
- [ ] GitHub repository connected
- [ ] Environment variables set:
  - [ ] `NODE_ENV=production`
  - [ ] `MONGODB_URI=your-atlas-connection-string`
  - [ ] `JWT_SECRET=your-secure-secret`
  - [ ] `FRONTEND_PRODUCTION_URL=https://your-frontend-domain.com`
- [ ] Build command: `npm install`
- [ ] Start command: `npm start`
- [ ] Health check path: `/health`
- [ ] Service deployed and running
- [ ] Backend URL copied (e.g., `https://your-app.onrender.com`)

## 🌐 Task 3: Deploy Frontend

### Vercel Deployment
- [ ] New project created on Vercel
- [ ] GitHub repository imported
- [ ] Framework preset: Vite
- [ ] Root directory: `client`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variable set: `VITE_API_URL=https://your-backend-domain.com`
- [ ] Project deployed and running
- [ ] Frontend URL copied (e.g., `https://your-app.vercel.app`)

### Update Backend CORS
- [ ] Backend CORS updated with frontend URL
- [ ] Backend redeployed with new CORS settings

## 🔄 Task 4: CI/CD Pipeline Setup

### GitHub Actions
- [ ] Workflow file exists (`.github/workflows/mern-ci-cd.yml`)
- [ ] Secrets configured in repository:
  - [ ] `RENDER_SERVICE_ID`
  - [ ] `RENDER_API_KEY`
  - [ ] `VERCEL_TOKEN`
  - [ ] `VERCEL_ORG_ID`
  - [ ] `VERCEL_PROJECT_ID`
  - [ ] `BACKEND_URL`
  - [ ] `FRONTEND_URL`
- [ ] Pipeline runs on push to main branch
- [ ] Tests pass in CI/CD
- [ ] Builds succeed in CI/CD
- [ ] Automatic deployment working

### Pipeline Verification
- [ ] Backend tests pass in GitHub Actions
- [ ] Frontend tests pass in GitHub Actions
- [ ] Backend deploys automatically to Render
- [ ] Frontend deploys automatically to Vercel
- [ ] Health checks pass after deployment

## 📊 Task 5: Monitoring and Maintenance

### Health Checks
- [ ] Backend health endpoint accessible: `GET /health`
- [ ] Frontend loads without errors
- [ ] API endpoints responding correctly
- [ ] Database connection working

### Monitoring Setup
- [ ] Uptime monitoring configured (UptimeRobot recommended)
- [ ] Error tracking set up (optional: Sentry)
- [ ] Performance monitoring active
- [ ] Logs accessible and readable

### Documentation
- [ ] README.md updated with deployment URLs
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] Troubleshooting guide created

## 🎉 Final Verification

### Application Testing
- [ ] Frontend loads in production
- [ ] Backend API responds correctly
- [ ] Database operations work
- [ ] All features functional
- [ ] Performance acceptable

### Assignment Requirements
- [ ] Both frontend and backend deployed
- [ ] CI/CD pipeline working
- [ ] Monitoring configured
- [ ] Documentation complete
- [ ] Screenshots taken of:
  - [ ] Deployed frontend
  - [ ] Deployed backend
  - [ ] CI/CD pipeline in action
  - [ ] Health check endpoints

### Submission
- [ ] All changes committed and pushed
- [ ] README.md contains deployment URLs
- [ ] Screenshots included in repository
- [ ] Assignment ready for grading

## 🔧 Troubleshooting

### Common Issues
- **Build failures**: Check Node.js version and dependencies
- **Environment variables**: Ensure all required vars are set
- **CORS errors**: Verify frontend URL in backend CORS config
- **Database connection**: Check MongoDB Atlas network access
- **Deployment failures**: Review GitHub Actions logs

### Getting Help
- Check the deployment logs in your hosting platform
- Review GitHub Actions workflow runs
- Test endpoints locally before deploying
- Verify environment variables are correct

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

**🎯 Goal**: Complete all checkboxes to finish the assignment successfully!

**💡 Tip**: Take screenshots as you complete each major step - you'll need them for the submission!
