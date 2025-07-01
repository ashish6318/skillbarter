# Render Deployment Configuration

## Build Command
```bash
npm install
```

## Start Command
```bash
npm start
```

## Environment Variables (Set in Render Dashboard)
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secure_jwt_secret_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
CLIENT_URL=https://your-frontend-app.vercel.app
PORT=5000
```

## Auto-Deploy
- Connect your GitHub repository
- Set branch to `main`
- Render will automatically deploy on every push to main branch
