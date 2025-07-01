import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import { vi } from "vitest";

// Mock contexts for testing
export const mockAuthContext = {
  isAuthenticated: false,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  loading: false,
  error: null,
};

export const mockSocketContext = {
  socket: null,
  isConnected: false,
  notifications: [],
  unreadCount: 0,
  markAsRead: vi.fn(),
  clearNotifications: vi.fn(),
};

// Custom render function that includes providers
export const renderWithProviders = (ui, options = {}) => {
  const {
    authValue = mockAuthContext,
    socketValue = mockSocketContext,
    ...renderOptions
  } = options;

  const AllTheProviders = ({ children }) => {
    return (
      <BrowserRouter>
        <AuthProvider value={authValue}>
          <SocketProvider value={socketValue}>{children}</SocketProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};

// Mock user data
export const mockUser = {
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john.doe@example.com",
  bio: "A passionate learner and teacher.",
  location: "New York, NY",
  avatar: "https://via.placeholder.com/150",
  skills: [
    {
      _id: "507f1f77bcf86cd799439012",
      name: "JavaScript",
      level: "Expert",
      category: "Programming",
      subcategory: "Frontend",
    },
    {
      _id: "507f1f77bcf86cd799439013",
      name: "React",
      level: "Expert",
      category: "Programming",
      subcategory: "Frontend",
    },
  ],
  learningGoals: ["Python", "Machine Learning"],
  availability: [
    {
      day: "Monday",
      slots: [
        { start: "09:00", end: "12:00" },
        { start: "14:00", end: "17:00" },
      ],
    },
  ],
  rating: 4.5,
  totalReviews: 10,
  totalHours: 25,
  joinedAt: "2023-01-01T00:00:00.000Z",
};

// Mock session data
export const mockSession = {
  _id: "507f1f77bcf86cd799439014",
  teacher: mockUser,
  student: {
    ...mockUser,
    _id: "507f1f77bcf86cd799439015",
    name: "Jane Smith",
    email: "jane.smith@example.com",
  },
  skill: "JavaScript",
  date: "2024-01-15T10:00:00.000Z",
  duration: 60,
  status: "scheduled",
  notes: "Looking forward to learning JavaScript basics!",
  zoomLink: "https://zoom.us/j/123456789",
  createdAt: "2024-01-10T00:00:00.000Z",
  updatedAt: "2024-01-10T00:00:00.000Z",
};

// Mock conversation data
export const mockConversation = {
  _id: "507f1f77bcf86cd799439016",
  participants: [mockUser._id, "507f1f77bcf86cd799439015"],
  messages: [
    {
      _id: "507f1f77bcf86cd799439017",
      sender: mockUser._id,
      content: "Hello! I would like to learn JavaScript.",
      timestamp: "2024-01-10T10:00:00.000Z",
      read: true,
    },
    {
      _id: "507f1f77bcf86cd799439018",
      sender: "507f1f77bcf86cd799439015",
      content: "Great! I would be happy to help you.",
      timestamp: "2024-01-10T10:05:00.000Z",
      read: false,
    },
  ],
  lastMessage: "2024-01-10T10:05:00.000Z",
  unreadCount: 1,
};

// Mock API responses
export const mockApiResponses = {
  users: [mockUser],
  sessions: [mockSession],
  conversations: [mockConversation],
  skills: [
    { _id: "1", name: "JavaScript", category: "Programming" },
    { _id: "2", name: "Python", category: "Programming" },
    { _id: "3", name: "React", category: "Programming" },
  ],
};

// Helper function to mock fetch responses
export const mockFetch = (data, status = 200) => {
  globalThis.fetch.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  });
};

// Helper function to mock fetch errors
export const mockFetchError = (message = "Network error") => {
  globalThis.fetch.mockRejectedValue(new Error(message));
};
