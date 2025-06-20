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
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

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
      <div
        className={cn(
          "flex items-center justify-center h-64",
          themeClasses.bgPrimary
        )}
      >
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
          <h2 className={cn("text-2xl font-bold", themeClasses.textPrimary)}>
            Analytics Dashboard
          </h2>
          <p className={cn(themeClasses.textSecondary)}>
            Track your credit activity and performance
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className={cn(componentPatterns.input, "px-3 py-2")}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>

          <button
            onClick={fetchAnalyticsData}
            className={cn(
              buttonVariants.primary,
              "flex items-center px-4 py-2"
            )}
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>{" "}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.change >= 0;

          return (
            <div key={index} className={cn(componentPatterns.card, "p-6")}>
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      themeClasses.textSecondary
                    )}
                  >
                    {card.title}
                  </p>
                  <p
                    className={cn(
                      "text-2xl font-bold mt-2",
                      themeClasses.textPrimary
                    )}
                  >
                    {card.value}
                  </p>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-full",
                    card.color === "blue"
                      ? themeClasses.infoLight
                      : card.color === "green"
                      ? themeClasses.successLight
                      : card.color === "red"
                      ? themeClasses.errorLight
                      : themeClasses.warningLight
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6",
                      card.color === "blue"
                        ? themeClasses.info
                        : card.color === "green"
                        ? themeClasses.success
                        : card.color === "red"
                        ? themeClasses.error
                        : themeClasses.warning
                    )}
                  />
                </div>
              </div>

              {card.change !== 0 && (
                <div className="mt-4 flex items-center">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isPositive ? themeClasses.success : themeClasses.error
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {card.change}%
                  </span>
                  <span className={cn("text-sm ml-2", themeClasses.textMuted)}>
                    vs last period
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credit Activity Chart */}
        <div className={cn(componentPatterns.card, "p-6")}>
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn("text-lg font-semibold", themeClasses.textPrimary)}
            >
              Credit Activity
            </h3>
            <ChartBarIcon className={cn("w-5 h-5", themeClasses.textMuted)} />
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
                      className={cn(
                        "rounded-t w-4 transition-all",
                        "bg-theme-success hover:bg-theme-success/80"
                      )}
                      style={{ height: `${earnedHeight}px` }}
                      title={`Earned: ${day.earned} credits`}
                    />
                    <div
                      className={cn(
                        "rounded-t w-4 transition-all",
                        "bg-theme-error hover:bg-theme-error/80"
                      )}
                      style={{ height: `${spentHeight}px` }}
                      title={`Spent: ${day.spent} credits`}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs transform rotate-45 mt-2",
                      themeClasses.textMuted
                    )}
                  >
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>{" "}
          <div className="flex justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-theme-success rounded mr-2" />
              <span className={cn("text-sm", themeClasses.textSecondary)}>
                Earned
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-theme-error rounded mr-2" />
              <span className={cn("text-sm", themeClasses.textSecondary)}>
                Spent
              </span>
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        <div className={cn(componentPatterns.card, "p-6")}>
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn("text-lg font-semibold", themeClasses.textPrimary)}
            >
              Transaction Breakdown
            </h3>
            <CreditCardIcon className={cn("w-5 h-5", themeClasses.textMuted)} />
          </div>

          <div className="space-y-3">
            {transactionSummary.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg",
                  themeClasses.bgSecondary
                )}
              >
                <div>
                  <p className={cn("font-medium", themeClasses.textPrimary)}>
                    {item.type}
                  </p>
                  <p className={cn("text-sm", themeClasses.textMuted)}>
                    {item.count} transactions
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn("font-semibold", themeClasses.textPrimary)}>
                    {item.amount} credits
                  </p>
                  <p className={cn("text-sm", themeClasses.textMuted)}>
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
