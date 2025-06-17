# 🚀 Skill Barter Platform

A full-stack peer-to-peer skill exchange platform built with React, Node.js, Express, and MongoDB. Users can offer their skills and find others to learn from in a credit-based system.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login
- JWT-based authentication
- Profile management with skill listings
- Secure password handling

### 🎯 Core Platform Features
- **Skill Discovery**: Browse and search for skills offered by other users
- **Real-time Messaging**: Socket.IO powered chat system
- **Session Booking**: Schedule and manage skill exchange sessions
- **Credit System**: Fair exchange mechanism with virtual credits
- **User Profiles**: Comprehensive user profiles with skills offered/wanted

### 🛠️ Technical Features
- Real-time notifications
- File upload support
- Responsive design with Tailwind CSS
- Rate limiting and security middleware
- Comprehensive error handling

## 🏗️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Routing**: React Router v6
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Security**: Helmet, CORS, Rate Limiting

## 📦 Project Structure

```
skill-barter/
├── src/                          # Frontend source
│   ├── components/              # React components
│   │   ├── Common/             # Shared components
│   │   └── ...
│   ├── pages/                  # Page components
│   │   ├── Auth/              # Authentication pages
│   │   └── ...
│   ├── context/               # React Context providers
│   ├── utils/                 # Utility functions
│   └── hooks/                 # Custom React hooks
├── server/                      # Backend source
│   ├── controllers/           # Route controllers
│   ├── models/               # MongoDB models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Backend utilities
│   └── uploads/              # File uploads
└── docs/                       # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ashish6318/skillbarter.git
   cd skillbarter
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create `.env.local` in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```
   
   Create `server/.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/skillbarter
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:5173
   UPLOAD_PATH=uploads
   MAX_FILE_SIZE=5242880
   ```

5. **Start the development servers**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### User Discovery
- `GET /api/discover/users` - Browse available users and skills
- `GET /api/discover/skills` - Search for specific skills

### Messaging System
- Real-time messaging via Socket.IO
- Message history and conversation management

### Session Management
- Session booking and scheduling
- Session status updates and management

### Credit System
- Credit transactions and balance management
- Fair exchange mechanism

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

### Code Style
- ESLint configuration for code quality
- Prettier for code formatting
- Consistent naming conventions

## 🛡️ Security Features

- JWT authentication with secure cookies
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- SQL injection protection via Mongoose
- XSS protection with Helmet

## 🚀 Deployment

### Environment Variables for Production
Ensure you set proper environment variables for production:
- Use strong JWT secrets
- Configure proper CORS origins
- Set up MongoDB Atlas or production database
- Configure file upload storage (AWS S3, etc.)

### Build Commands
```bash
# Build frontend
npm run build

# Start production server
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ashish Kumar**
- GitHub: [@ashish6318](https://github.com/ashish6318)

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the excellent database
- Socket.IO team for real-time capabilities
- Tailwind CSS for the utility-first CSS framework

---

## 📊 Development Status

- ✅ Backend API structure
- ✅ Frontend React setup
- ✅ Authentication system
- ✅ Real-time socket connection
- ✅ Database models and relationships
- 🔄 User discovery and skill browsing
- 🔄 Messaging system implementation
- 🔄 Session booking system
- 🔄 Credit system implementation
- 🔄 File upload functionality
- ⏳ Advanced features and optimization

---

Built with ❤️ using modern web technologies+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
