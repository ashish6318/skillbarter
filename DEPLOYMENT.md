# 🚀 SkillBarter Deployment Guide

## Quick Start

Run the deployment preparation script:
```bash
# On Windows
./deploy.bat

# On macOS/Linux
./deploy.sh
```

## Backend Deployment on Render

### Step 1: Prepare MongoDB Atlas
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free cluster
3. Create a database user
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/skillbarter`
5. Whitelist all IPs: `0.0.0.0/0` (for Render's dynamic IPs)

### Step 2: Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `skillbarter-backend` (or your choice)
   - **Environment**: `Node`
   - **Region**: `Oregon` (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Environment Variables (Render)
Add these in the Render dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillbarter
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
CLIENT_URL=https://your-app-name.vercel.app
PORT=5000
```

## Frontend Deployment on Vercel

### Step 1: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 2: Environment Variables (Vercel)
Add these in the Vercel dashboard:
```
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
VITE_SOCKET_URL=https://your-backend-name.onrender.com
```

## Important Configuration Notes

### Backend (Render)
- ✅ Automatic deploys on push to main
- ✅ HTTPS enabled by default
- ✅ Custom domain support
- ⚠️ Free tier has cold starts (first request may be slow)
- ⚠️ 750 build hours/month limit on free tier

### Frontend (Vercel)
- ✅ Automatic deploys on push to main
- ✅ HTTPS enabled by default
- ✅ Global CDN
- ✅ Custom domain support
- ✅ Generous free tier limits

## Post-Deployment Checklist

- [ ] Backend is accessible at Render URL
- [ ] Frontend is accessible at Vercel URL
- [ ] Database connection works (check Render logs)
- [ ] Authentication flow works
- [ ] Socket.io connection works
- [ ] API endpoints respond correctly
- [ ] Email functionality works (if configured)
- [ ] All environment variables set correctly
- [ ] CORS allows your frontend domain
- [ ] Test user registration and login

## Monitoring & Logs

### Render Logs
```bash
# View logs in Render dashboard
# Or use Render CLI
render logs -s your-service-name
```

### Vercel Logs
```bash
# View in Vercel dashboard
# Or use Vercel CLI  
vercel logs your-deployment-url
```

## Troubleshooting

### Common Issues

1. **CORS Error**
   - Check `CLIENT_URL` environment variable
   - Verify domain in backend CORS configuration

2. **Database Connection Failed**
   - Check `MONGODB_URI` format
   - Verify MongoDB Atlas IP whitelist
   - Check database user permissions

3. **Socket.io Not Connecting**
   - Verify `VITE_SOCKET_URL` points to backend root (not /api)
   - Check backend logs for connection attempts

4. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Review build logs for specific errors

## Custom Domains

### Render
1. Go to your service → Settings → Custom Domains
2. Add your domain
3. Configure DNS records as shown

### Vercel
1. Go to your project → Domains
2. Add your domain
3. Configure DNS records as shown

## Backup & Maintenance

- 🔄 Automatic backups through MongoDB Atlas
- 📊 Monitor usage in both platforms' dashboards
- 🔧 Update dependencies regularly
- 🔒 Rotate JWT secrets periodically
- 📧 Monitor email delivery rates

---

**Need Help?** Check the platform documentation:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
