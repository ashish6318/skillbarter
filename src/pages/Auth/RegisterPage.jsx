import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  EyeIcon,
  EyeSlashIcon,
  UserPlusIcon,
  CheckCircleIcon,
  LightBulbIcon,
  HeartIcon,
  StarIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  UsersIcon,
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
  firstName: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),
  lastName: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .required("Username is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  skillsOffered: yup
    .string()
    .required("Please enter at least one skill you can teach"),
  skillsWanted: yup
    .string()
    .required("Please enter at least one skill you want to learn"),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register: registerUser,
    isAuthenticated,
    isLoading,
    error,
    clearError,
  } = useAuth();
  const navigate = useNavigate();

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
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle auth errors
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);
  const onSubmit = async (data) => {
    const {
      confirmPassword: _confirmPassword,
      skillsOffered,
      skillsWanted,
      ...userData
    } = data;

    // Process skills and interests
    const processedData = {
      ...userData,
      skillsOffered: skillsOffered
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill)
        .map((skill) => ({
          skill,
          category: "Other",
          experience: "Intermediate",
        })),
      skillsWanted: skillsWanted
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill)
        .map((skill) => ({ skill, category: "Other" })),
    };

    const result = await registerUser(processedData);

    if (result.success) {
      toast.success("Welcome to SkillBarter! Your account has been created.");
      navigate("/dashboard", { replace: true });
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
              Join <span className="text-yellow-300">SkillBarter</span>
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Create your account and start exchanging skills with passionate
              learners and experts worldwide.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <RocketLaunchIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Quick Start</h3>
                <p className="text-blue-100 text-sm">
                  Set up your profile in minutes and start learning
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Vibrant Community</h3>
                <p className="text-blue-100 text-sm">
                  Join thousands of skill sharers and learners
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <HeartIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Free to Join</h3>
                <p className="text-blue-100 text-sm">
                  No subscription fees, just genuine skill exchange
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
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
              Create your account
            </h2>
            <p className={cn("mt-2 text-sm", themeClasses.textSecondary)}>
              Already have an account?{" "}
              <Link
                to="/login"
                className={cn(
                  "font-semibold transition-colors",
                  themeClasses.textAccent,
                  "hover:text-accent-hover"
                )}
              >
                Sign in here
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
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Name Fields Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className={cn(
                      "block text-sm font-medium mb-2",
                      themeClasses.textPrimary
                    )}
                  >
                    First Name
                  </label>
                  <input
                    {...register("firstName")}
                    type="text"
                    autoComplete="given-name"
                    className={cn(
                      componentPatterns.input,
                      "w-full",
                      errors.firstName &&
                        "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                    )}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className={cn("mt-1 text-xs", themeClasses.error)}>
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className={cn(
                      "block text-sm font-medium mb-2",
                      themeClasses.textPrimary
                    )}
                  >
                    Last Name
                  </label>
                  <input
                    {...register("lastName")}
                    type="text"
                    autoComplete="family-name"
                    className={cn(
                      componentPatterns.input,
                      "w-full",
                      errors.lastName &&
                        "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                    )}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className={cn("mt-1 text-xs", themeClasses.error)}>
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textPrimary
                  )}
                >
                  Username
                </label>
                <input
                  {...register("username")}
                  type="text"
                  autoComplete="username"
                  className={cn(
                    componentPatterns.input,
                    "w-full",
                    errors.username &&
                      "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                  )}
                  placeholder="Choose a username"
                />
                {errors.username && (
                  <p className={cn("mt-2 text-sm", themeClasses.error)}>
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
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

              {/* Password Fields Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password */}
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
                      autoComplete="new-password"
                      className={cn(
                        componentPatterns.input,
                        "w-full pr-10",
                        errors.password &&
                          "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                      )}
                      placeholder="Password"
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
                    <p className={cn("mt-1 text-xs", themeClasses.error)}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className={cn(
                      "block text-sm font-medium mb-2",
                      themeClasses.textPrimary
                    )}
                  >
                    Confirm
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className={cn(
                        componentPatterns.input,
                        "w-full pr-10",
                        errors.confirmPassword &&
                          "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                      )}
                      placeholder="Confirm"
                    />
                    <button
                      type="button"
                      className={cn(
                        "absolute inset-y-0 right-0 pr-3 flex items-center",
                        themeClasses.textMuted,
                        "hover:text-text-primary transition-colors"
                      )}
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className={cn("mt-1 text-xs", themeClasses.error)}>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills I can teach */}
              <div>
                <label
                  htmlFor="skillsOffered"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textPrimary
                  )}
                >
                  Skills I can teach
                </label>
                <input
                  {...register("skillsOffered")}
                  type="text"
                  className={cn(
                    componentPatterns.input,
                    "w-full",
                    errors.skillsOffered &&
                      "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                  )}
                  placeholder="e.g., JavaScript, Guitar, Cooking (comma-separated)"
                />
                {errors.skillsOffered && (
                  <p className={cn("mt-2 text-sm", themeClasses.error)}>
                    {errors.skillsOffered.message}
                  </p>
                )}
              </div>

              {/* Skills I want to learn */}
              <div>
                <label
                  htmlFor="skillsWanted"
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textPrimary
                  )}
                >
                  Skills I want to learn
                </label>
                <input
                  {...register("skillsWanted")}
                  type="text"
                  className={cn(
                    componentPatterns.input,
                    "w-full",
                    errors.skillsWanted &&
                      "border-theme-error focus:border-theme-error focus:ring-theme-error/20"
                  )}
                  placeholder="e.g., Python, Photography, Spanish (comma-separated)"
                />
                {errors.skillsWanted && (
                  <p className={cn("mt-2 text-sm", themeClasses.error)}>
                    {errors.skillsWanted.message}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  className={cn(
                    "h-4 w-4 mt-0.5 rounded border-border-primary",
                    "text-accent-primary focus:ring-accent-primary/20"
                  )}
                />
                <label
                  htmlFor="agree-terms"
                  className={cn(
                    "ml-3 block text-sm leading-relaxed",
                    themeClasses.textSecondary
                  )}
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className={cn(
                      "font-medium transition-colors",
                      themeClasses.textAccent,
                      "hover:text-accent-hover"
                    )}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className={cn(
                      "font-medium transition-colors",
                      themeClasses.textAccent,
                      "hover:text-accent-hover"
                    )}
                  >
                    Privacy Policy
                  </Link>
                </label>
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
                    Creating account...
                  </div>
                ) : (
                  "Create account"
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
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* Sign In Link */}
              <Link
                to="/login"
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
                Sign in to your account
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
