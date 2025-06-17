import React, { createContext, useContext, useReducer, useEffect } from "react";
import api from "../utils/api";
import { API_ENDPOINTS } from "../utils/constants";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  AUTH_SUCCESS: "AUTH_SUCCESS",
  AUTH_FAILURE: "AUTH_FAILURE",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.AUTH_SUCCESS:
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.AUTH_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case AUTH_ACTIONS.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
      dispatch({
        type: AUTH_ACTIONS.AUTH_SUCCESS,
        payload: { user: response.data.data },
      });
    } catch (error) {
      localStorage.removeItem("token");
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: error.response?.data?.message || "Authentication failed",
      });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user },
      });

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: message,
      });
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });

      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      const { token, user } = response.data.data;

      localStorage.setItem("token", token);

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user },
      });

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      dispatch({
        type: AUTH_ACTIONS.AUTH_FAILURE,
        payload: message,
      });
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put(API_ENDPOINTS.AUTH.PROFILE, profileData);

      dispatch({
        type: AUTH_ACTIONS.UPDATE_PROFILE,
        payload: response.data.data,
      });

      return { success: true, user: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Profile update failed",
      };
    }
  };

  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
