import React, { useState, useEffect, useCallback } from "react";
import {
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  ArrowPathIcon,
  CalendarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { creditsAPI } from "../../utils/api";
import LoadingSpinner from "../Common/LoadingSpinner";
import { format, subDays, eachDayOfInterval } from "date-fns";

const AnalyticsDashboard = () => {
  const [data, setData] = useState({
    stats: {},
    transactions: [],
    chartData: [],
    loading: true,
  });
  const [timeRange, setTimeRange] = useState("7d");

  const generateChartData = useCallback((transactions, startDate, endDate) => {
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    return days.map((day) => {
      const dayTransactions = transactions.filter(
        (tx) =>
          format(new Date(tx.createdAt), "yyyy-MM-dd") ===
          format(day, "yyyy-MM-dd")
      );

      const earned = dayTransactions
        .filter((tx) =>
          [
            "purchase",
            "session_completion",
            "bonus",
            "refund",
            "transfer_in",
          ].includes(tx.type)
        )
        .reduce((sum, tx) => sum + tx.amount, 0);

      const spent = dayTransactions
        .filter((tx) => ["session_booking", "transfer_out"].includes(tx.type))
        .reduce((sum, tx) => sum + tx.amount, 0);

      return {
        date: format(day, "MMM dd"),
        earned,
        spent,
        net: earned - spent,
      };
    });
  }, []);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setData((prev) => ({ ...prev, loading: true }));

      const endDate = new Date();
      const startDate = subDays(
        endDate,
        timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90
      );

      const [statsRes, transactionsRes] = await Promise.all([
        creditsAPI.getStats(),
        creditsAPI.getTransactions({ limit: 100, startDate, endDate }),
      ]);

      const chartData = generateChartData(
        transactionsRes.data.transactions || [],
        startDate,
        endDate
      );

      setData({
        stats: statsRes.data.stats || {},
        transactions: transactionsRes.data.transactions || [],
        chartData,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setData((prev) => ({ ...prev, loading: false }));
    }
  }, [timeRange, generateChartData]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const getStatsCards = () => {
    const { stats } = data;

    return [
      {
        title: "Total Credits Earned",
        value: stats.totalEarned || 0,
        change: stats.earnedChange || 0,
        icon: ArrowUpIcon,
        color: "green",
      },
      {
        title: "Total Credits Spent",
        value: stats.totalSpent || 0,
        change: stats.spentChange || 0,
        icon: ArrowDownIcon,
        color: "red",
      },
      {
        title: "Sessions Completed",
        value: stats.sessionsCompleted || 0,
        change: stats.sessionsChange || 0,
        icon: CalendarIcon,
        color: "blue",
      },
      {
        title: "Average Session Rating",
        value: stats.avgRating ? `${stats.avgRating.toFixed(1)}⭐` : "N/A",
        change: stats.ratingChange || 0,
        icon: UserGroupIcon,
        color: "purple",
      },
    ];
  };

  const getTransactionTypeSummary = () => {
    const typeSummary = data.transactions.reduce((acc, tx) => {
      if (!acc[tx.type]) {
        acc[tx.type] = { count: 0, amount: 0 };
      }
      acc[tx.type].count++;
      acc[tx.type].amount += tx.amount;
      return acc;
    }, {});

    return Object.entries(typeSummary)
      .map(([type, data]) => ({
        type: type.replace(/_/g, " ").toUpperCase(),
        count: data.count,
        amount: data.amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  if (data.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const statsCards = getStatsCards();
  const transactionSummary = getTransactionTypeSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Track your credit activity and performance
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button
            onClick={fetchAnalyticsData}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;

          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-${card.color}-100`}>
                  <Icon className={`w-6 h-6 text-${card.color}-600`} />
                </div>
              </div>

              {card.change !== 0 && (
                <div className="mt-4 flex items-center">
                  <span
                    className={`text-sm font-medium ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {card.change}%
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    vs last period
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Activity Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Credit Activity
            </h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>

          <div className="h-64 flex items-end justify-between space-x-2">
            {data.chartData.map((day, index) => {
              const maxValue = Math.max(
                ...data.chartData.map((d) => Math.max(d.earned, d.spent))
              );
              const earnedHeight =
                maxValue > 0 ? (day.earned / maxValue) * 200 : 0;
              const spentHeight =
                maxValue > 0 ? (day.spent / maxValue) * 200 : 0;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="flex items-end space-x-1 mb-2 h-52">
                    <div
                      className="bg-green-500 rounded-t w-4 transition-all hover:bg-green-600"
                      style={{ height: `${earnedHeight}px` }}
                      title={`Earned: ${day.earned} credits`}
                    />
                    <div
                      className="bg-red-500 rounded-t w-4 transition-all hover:bg-red-600"
                      style={{ height: `${spentHeight}px` }}
                      title={`Spent: ${day.spent} credits`}
                    />
                  </div>
                  <span className="text-xs text-gray-500 transform rotate-45 mt-2">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded mr-2" />
              <span className="text-sm text-gray-600">Earned</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2" />
              <span className="text-sm text-gray-600">Spent</span>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Transaction Breakdown
            </h3>
            <CreditCardIcon className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {transactionSummary.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.type}</p>
                  <p className="text-sm text-gray-500">
                    {item.count} transactions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {item.amount} credits
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.count > 0 ? Math.round(item.amount / item.count) : 0}{" "}
                    avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
