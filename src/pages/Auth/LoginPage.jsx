import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
  BookOpenIcon,
  AcademicCapIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/Common/LoadingSpinner";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Handle auth errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const onSubmit = async (data) => {
    const result = await login(data);

    if (result.success) {
      toast.success("Welcome back!");
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  };
  if (isLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgPrimary
        )}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex", themeClasses.bgPrimary)}>
      {/* Left Side - Branding & Features */}
      <div
        className={cn(
          "hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden",
          "bg-gradient-to-br from-accent-primary via-accent-hover to-accent-muted"
        )}
      >
        {" "}
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='37' cy='7' r='1'/%3E%3Ccircle cx='7' cy='37' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16">
          <div className="mb-8">
            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4">
              Welcome to <span className="text-yellow-300">SkillBarter</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Exchange skills, build connections, and grow together in our
              vibrant learning community.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  Connect with Experts
                </h3>
                <p className="text-blue-100 text-sm">
                  Find skilled mentors and passionate learners
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Learn & Teach</h3>
                <p className="text-blue-100 text-sm">
                  Share your expertise while learning new skills
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Flexible Exchange</h3>
                <p className="text-blue-100 text-sm">
                  Trade skills on your schedule, your way
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg",
                themeClasses.gradientAccent
              )}
            >
              <AcademicCapIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2
              className={cn(
                "text-3xl font-bold tracking-tight",
                themeClasses.textPrimary
              )}
            >
              Welcome back
            </h2>
            <p className={cn("mt-2 text-sm", themeClasses.textSecondary)}>
              Don't have an account?{" "}
              <Link
                to="/register"
                className={cn(
                  "font-semibold transition-colors",
                  themeClasses.textAccent,
                  "hover:text-accent-hover"
                )}
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div
            className={cn(
              "py-8 px-6 shadow-xl rounded-2xl",
              componentPatterns.card
            )}
          >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textPrimary
                  )}
                >
                  Email address
                </label>
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  className={cn(
                    componentPatterns.input,
                    "w-full",
                    errors.email &&
                      "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                  )}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className={cn("mt-2 text-sm", themeClasses.error)}>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textPrimary
                  )}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={cn(
                      componentPatterns.input,
                      "w-full pr-10",
                      errors.password &&
                        "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                    )}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className={cn(
                      "absolute inset-y-0 right-0 pr-3 flex items-center",
                      themeClasses.textMuted,
                      "hover:text-text-primary transition-colors"
                    )}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className={cn("mt-2 text-sm", themeClasses.error)}>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className={cn(
                      "h-4 w-4 rounded border-border-primary",
                      "text-accent-primary focus:ring-accent-primary/20"
                    )}
                  />
                  <label
                    htmlFor="remember-me"
                    className={cn(
                      "ml-2 block text-sm",
                      themeClasses.textSecondary
                    )}
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className={cn(
                      "font-medium transition-colors",
                      themeClasses.textAccent,
                      "hover:text-accent-hover"
                    )}
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  buttonVariants.primary,
                  "w-full h-12 text-base font-semibold",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "transform transition-transform hover:scale-[1.02] active:scale-[0.98]"
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="small" className="mr-2" />
                    Signing in...
                  </div>
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div
                    className={cn(
                      "w-full border-t",
                      themeClasses.borderSecondary
                    )}
                  />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span
                    className={cn(
                      "px-4",
                      themeClasses.bgSecondary,
                      themeClasses.textMuted
                    )}
                  >
                    New to SkillBarter?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Link
                to="/register"
                className={cn(
                  "w-full flex justify-center py-3 px-4 rounded-lg border",
                  "text-sm font-medium transition-all duration-200",
                  themeClasses.bgSecondary,
                  themeClasses.borderPrimary,
                  themeClasses.textPrimary,
                  "hover:bg-bg-hover hover:border-border-accent",
                  "focus:outline-none focus:ring-2 focus:ring-accent-primary/20"
                )}
              >
                Create your free account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
