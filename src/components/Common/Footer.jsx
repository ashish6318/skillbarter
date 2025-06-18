import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark-800 border-t border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-mono font-bold text-sm">
                    &lt;/&gt;
                  </span>
                </div>
                <span className="text-xl font-mono font-bold text-dark-50">
                  SkillBarter
                </span>
              </div>
              <p className="text-dark-300 font-mono text-sm max-w-md">
                Connect, learn, and grow together. Exchange skills and knowledge
                with peers around the world in our vibrant learning community.
              </p>
            </div>{" "}
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-mono font-semibold text-dark-50 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/discover"
                    className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                  >
                    Discover Skills
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sessions"
                    className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                  >
                    My Sessions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/credits"
                    className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                  >
                    Credits
                  </Link>
                </li>
              </ul>
            </div>{" "}
            {/* Support */}
            <div>
              <h3 className="text-sm font-mono font-semibold text-dark-50 mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                  >
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                  >
                    Community Rules
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>{" "}
          {/* Bottom section */}
          <div className="mt-8 pt-8 border-t border-dark-600">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm font-mono text-dark-300">
                © 2024 SkillBarter. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm font-mono text-dark-300 hover:text-accent-400 transition-colors"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
