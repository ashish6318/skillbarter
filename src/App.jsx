import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { Toaster } from "react-hot-toast";

// Layout components
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DiscoverPage from "./pages/DiscoverPage";
import ProfilePage from "./pages/ProfilePage";
import MessagesPage from "./pages/MessagesPage";
import SessionsPage from "./pages/SessionsPage";
import CreditsPage from "./pages/CreditsPage";

// Protected Route component
import ProtectedRoute from "./components/Common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen bg-dark-900 text-dark-50 flex flex-col font-mono">
            <Navbar />

            <main className="flex-1 animate-fade-in">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/discover"
                  element={
                    <ProtectedRoute>
                      <DiscoverPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/messages"
                  element={
                    <ProtectedRoute>
                      <MessagesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sessions"
                  element={
                    <ProtectedRoute>
                      <SessionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/credits"
                  element={
                    <ProtectedRoute>
                      <CreditsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Redirect unknown routes */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>

          {/* Toast notifications with enhanced dark theme */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "font-mono",
              style: {
                background: "#1e293b",
                color: "#ffffff",
                border: "1px solid #475569",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: "500",
                fontFamily: "'JetBrains Mono', monospace",
                boxShadow: "0 10px 40px -10px rgba(0, 0, 0, 0.4)",
              },
              success: {
                style: {
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#ffffff",
                  border: "1px solid #059669",
                },
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#10b981",
                },
              },
              error: {
                style: {
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                  color: "#ffffff",
                  border: "1px solid #dc2626",
                },
                iconTheme: {
                  primary: "#ffffff",
                  secondary: "#ef4444",
                },
              },
              loading: {
                style: {
                  background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                  color: "#ffffff",
                  border: "1px solid #0284c7",
                },
              },
            }}
          />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
