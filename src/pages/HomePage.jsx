import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../utils/theme";

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: AcademicCapIcon,
      title: "Learn Any Skill",
      description:
        "Access thousands of skills from programming to cooking, taught by passionate peers.",
    },
    {
      icon: UserGroupIcon,
      title: "Teach & Earn",
      description:
        "Share your expertise and earn credits while helping others grow.",
    },
    {
      icon: ClockIcon,
      title: "Flexible Scheduling",
      description:
        "Book sessions at your convenience with our flexible scheduling system.",
    },
    {
      icon: CurrencyDollarIcon,
      title: "Credit System",
      description:
        "Fair exchange system where you earn credits by teaching and spend them learning.",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Learners" },
    { value: "500+", label: "Skills Available" },
    { value: "25K+", label: "Sessions Completed" },
    { value: "98%", label: "Satisfaction Rate" },
  ];
  return (
    <div className={cn("min-h-screen", themeClasses.bgPrimary)}>
      {/* Hero Section */}
      <section
        className={cn(
          "relative overflow-hidden",
          themeClasses.gradientPrimary,
          themeClasses.textPrimary
        )}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {" "}
            <h1
              className={cn(
                "text-5xl md:text-7xl font-bold mb-8 animate-fade-in",
                themeClasses.textPrimary
              )}
            >
              Learn, Teach, and
              <span className={cn("block", themeClasses.textGradient)}>
                Grow Together
              </span>
            </h1>
            <p
              className={cn(
                "text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up",
                themeClasses.textSecondary
              )}
            >
              Join the world's most innovative peer-to-peer skill exchange
              platform. Share your expertise, learn from others, and build
              meaningful connections in a professional environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className={cn(
                    buttonVariants.primary,
                    "px-10 py-4 text-lg inline-flex items-center justify-center"
                  )}
                >
                  Go to Dashboard
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className={cn(buttonVariants.primary, "px-10 py-4 text-lg")}
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className={cn(
                      buttonVariants.secondary,
                      "px-10 py-4 text-lg"
                    )}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>{" "}
      {/* Stats Section */}
      <section
        className={cn(
          "py-20 border-t",
          themeClasses.bgSecondary,
          themeClasses.borderSecondary
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {" "}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div
                  className={cn(
                    "text-4xl md:text-5xl font-bold mb-3 transition-colors",
                    themeClasses.textAccent,
                    "group-hover:text-accent-hover"
                  )}
                >
                  {stat.value}
                </div>
                <div className={cn("font-medium", themeClasses.textSecondary)}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className={cn("py-24", themeClasses.bgPrimary)}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2
              className={cn(
                "text-4xl md:text-5xl font-bold mb-6",
                themeClasses.textPrimary
              )}
            >
              Why Choose SkillBarter?
            </h2>
            <p
              className={cn(
                "text-xl max-w-3xl mx-auto leading-relaxed",
                themeClasses.textSecondary
              )}
            >
              Our platform makes it easy to connect with peers, exchange
              knowledge, and grow your skills in a supportive, professional
              community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={cn(
                    componentPatterns.card,
                    "p-6 transition-all duration-300 group"
                  )}
                >
                  {" "}
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-primary to-accent-hover rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className={cn("w-6 h-6", themeClasses.textInverse)} />
                  </div>
                  <h3
                    className={cn(
                      "text-xl font-semibold mb-2",
                      themeClasses.textPrimary
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={cn(
                      "leading-relaxed",
                      themeClasses.textSecondary
                    )}
                  >
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* How It Works */}
      <section
        className={cn(
          "py-20 border-t",
          themeClasses.bgSecondary,
          themeClasses.borderSecondary
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-4",
                themeClasses.textPrimary
              )}
            >
              How It Works
            </h2>
            <p className={cn("text-xl", themeClasses.textSecondary)}>
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-hover rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span
                  className={cn("text-2xl font-bold", themeClasses.textInverse)}
                >
                  1
                </span>
              </div>
              <h3
                className={cn(
                  "text-xl font-semibold mb-2",
                  themeClasses.textPrimary
                )}
              >
                Create Your Profile
              </h3>
              <p className={cn("leading-relaxed", themeClasses.textSecondary)}>
                Sign up and showcase your skills. Add what you can teach and
                what you want to learn.
              </p>
            </div>{" "}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-hover rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span
                  className={cn("text-2xl font-bold", themeClasses.textInverse)}
                >
                  2
                </span>
              </div>
              <h3
                className={cn(
                  "text-xl font-semibold mb-2",
                  themeClasses.textPrimary
                )}
              >
                Connect & Schedule
              </h3>
              <p className={cn("leading-relaxed", themeClasses.textSecondary)}>
                Browse skills, connect with peers, and schedule sessions that
                fit your schedule.
              </p>
            </div>{" "}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-hover rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span
                  className={cn("text-2xl font-bold", themeClasses.textInverse)}
                >
                  3
                </span>
              </div>
              <h3
                className={cn(
                  "text-xl font-semibold mb-2",
                  themeClasses.textPrimary
                )}
              >
                Learn & Grow
              </h3>
              <p className={cn("", themeClasses.textSecondary)}>
                Attend sessions, share knowledge, and grow your skills while
                building connections.
              </p>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* CTA Section */}
      {!isAuthenticated && (
        <section className={componentPatterns.ctaSection}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2
              className={cn(
                "text-3xl md:text-4xl font-bold mb-6",
                themeClasses.textInverse
              )}
            >
              Ready to Start Your Learning Journey?
            </h2>
            <p
              className={cn(
                "text-xl mb-8 max-w-2xl mx-auto",
                themeClasses.textInverse,
                "opacity-90"
              )}
            >
              Join thousands of learners and teachers who are already part of
              our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className={cn(componentPatterns.ctaButton)}>
                Join Now - It's Free
                <CheckCircleIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/discover"
                className={componentPatterns.ctaButtonOutline}
              >
                Browse Skills
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
