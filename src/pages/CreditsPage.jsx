import React, { useState } from "react";
import CreditManager from "../components/Credits/CreditManager";
import AnalyticsDashboard from "../components/Analytics/AnalyticsDashboard";
import { ChartBarIcon, CreditCardIcon } from "@heroicons/react/24/outline";

const CreditsPage = () => {
  const [activeTab, setActiveTab] = useState("manager");

  const tabs = [
    { id: "manager", name: "Credit Manager", icon: CreditCardIcon },
    { id: "analytics", name: "Analytics", icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "manager" && <CreditManager />}
        {activeTab === "analytics" && <AnalyticsDashboard />}
      </div>
    </div>
  );
};

export default CreditsPage;
