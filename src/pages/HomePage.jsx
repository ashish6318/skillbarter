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
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark-800 via-dark-900 to-dark-950 text-dark-50 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            {" "}
            <h1 className="text-5xl md:text-7xl font-mono font-bold mb-8 animate-fade-in text-dark-50">
              Learn, Teach, and
              <span className="block text-gradient">Grow Together</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-dark-200 max-w-4xl mx-auto leading-relaxed animate-slide-up font-mono">
              Join the world's most innovative peer-to-peer skill exchange
              platform. Share your expertise, learn from others, and build
              meaningful connections in a professional environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-scale-in">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-10 py-4 rounded-xl font-mono font-semibold hover:from-accent-400 hover:to-accent-500 transition-all duration-200 inline-flex items-center justify-center shadow-glow hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <>
                  {" "}
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-accent-500 to-accent-600 text-white px-10 py-4 rounded-xl font-mono font-semibold hover:from-accent-400 hover:to-accent-500 transition-all duration-200 shadow-glow hover:scale-105"
                  >
                    Get Started Free{" "}
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-dark-600 bg-dark-800 text-dark-100 px-10 py-4 rounded-xl font-mono font-semibold hover:bg-dark-700 hover:border-accent-400 hover:text-accent-400 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="py-20 bg-dark-800 border-t border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                {" "}
                <div className="text-4xl md:text-5xl font-bold font-mono text-accent-400 mb-3 group-hover:text-accent-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-dark-300 font-mono font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            {" "}
            <h2 className="text-4xl md:text-5xl font-mono font-bold text-dark-50 mb-6">
              Why Choose SkillBarter?
            </h2>
            <p className="text-xl text-dark-200 max-w-3xl mx-auto leading-relaxed font-mono">
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
                  className="bg-card p-6 rounded-xl hover:bg-elevated transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-mono font-semibold text-dark-50 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-dark-200 font-mono leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>{" "}
      {/* How It Works */}
      <section className="py-20 bg-dark-800 border-t border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-dark-50 mb-4">
              How It Works
            </h2>{" "}
            <p className="text-xl text-dark-200 font-mono">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {" "}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <span className="text-2xl font-mono font-bold text-white">
                  1
                </span>
              </div>
              <h3 className="text-xl font-mono font-semibold text-dark-50 mb-2">
                Create Your Profile
              </h3>
              <p className="text-dark-200 font-mono leading-relaxed">
                Sign up and showcase your skills. Add what you can teach and
                what you want to learn.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <span className="text-2xl font-mono font-bold text-white">
                  2
                </span>
              </div>
              <h3 className="text-xl font-mono font-semibold text-dark-50 mb-2">
                Connect & Schedule
              </h3>
              <p className="text-dark-200 font-mono leading-relaxed">
                Browse skills, connect with peers, and schedule sessions that
                fit your schedule.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <span className="text-2xl font-mono font-bold text-white">
                  3
                </span>
              </div>
              <h3 className="text-xl font-mono font-semibold text-dark-50 mb-2">
                Learn & Grow
              </h3>
              <p className="text-dark-300 font-mono">
                Attend sessions, share knowledge, and grow your skills while
                building connections.
              </p>
            </div>
          </div>
        </div>
      </section>{" "}
      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-accent-500 border-t border-dark-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-white mb-6">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto font-mono">
              Join thousands of learners and teachers who are already part of
              our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-accent-600 px-8 py-3 rounded-lg font-mono font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Join Now - It's Free
                <CheckCircleIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/discover"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-mono font-semibold hover:bg-white hover:text-accent-600 transition-colors"
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
