import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SB</span>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  SkillBarter
                </span>
              </div>
              <p className="text-gray-600 text-sm max-w-md">
                Connect, learn, and grow together. Exchange skills and knowledge
                with peers around the world in our vibrant learning community.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/discover"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Discover Skills
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/sessions"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    My Sessions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/credits"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Credits
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Community Rules
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                © 2024 SkillBarter. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-600 hover:text-blue-600"
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
