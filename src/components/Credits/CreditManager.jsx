import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  PlusIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChartBarIcon,
  GiftIcon,
  ArrowsRightLeftIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { creditsAPI } from "../../utils/api";
import LoadingSpinner from "../Common/LoadingSpinner";
import toast from "react-hot-toast";
import NotificationService from "../../services/NotificationService";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

const CreditManager = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  useEffect(() => {
    fetchCreditData();

    // Set up polling to refresh data every 30 seconds
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing credit data...");
      fetchCreditData();
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []); // Debug function to test API calls
  const testAPI = async () => {
    try {
      console.log("Testing API calls...");

      // Test balance endpoint
      const balanceTest = await creditsAPI.getBalance();
      console.log("Balance API response:", balanceTest);

      // Test transactions endpoint
      const transactionsTest = await creditsAPI.getTransactions();
      console.log("Transactions API response:", transactionsTest);

      // Test stats endpoint
      const statsTest = await creditsAPI.getStats();
      console.log("Stats API response:", statsTest);

      toast.success("API test completed - check console for details");
    } catch (error) {
      console.error("API test failed:", error);
      toast.error(`API test failed: ${error.message}`);
    }
  };

  // Check for low credits warning
  useEffect(() => {
    if (balance > 0 && balance <= 5) {
      NotificationService.lowCreditsWarning(balance);
    }
  }, [balance]);
  const fetchCreditData = async () => {
    try {
      setLoading(true);
      const [balanceRes, transactionsRes, statsRes] = await Promise.all([
        creditsAPI.getBalance(),
        creditsAPI.getTransactions({ limit: 20 }),
        creditsAPI.getStats(),
      ]);

      console.log("Credit data fetched:", {
        balance: balanceRes.data.balance,
        transactions: transactionsRes.data.transactions?.length,
        stats: statsRes.data.stats,
      });

      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions || []);
      setStats(statsRes.data.stats || {});
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching credit data:", error);

      if (error.response?.status === 429) {
        toast.error("Too many requests. Please wait a moment and try again.");
      } else {
        toast.error("Failed to load credit information");
      }
    } finally {
      setLoading(false);
    }
  };
  const getTransactionIcon = (type) => {
    switch (type) {
      case "purchase":
      case "bonus":
      case "refund":
        return (
          <ArrowDownIcon className={cn("w-5 h-5", themeClasses.success)} />
        );
      case "session_booking":
      case "session_completion":
      case "transfer_out":
        return <ArrowUpIcon className={cn("w-5 h-5", themeClasses.error)} />;
      case "transfer_in":
        return (
          <ArrowsRightLeftIcon
            className={cn("w-5 h-5", themeClasses.textAccent)}
          />
        );
      default:
        return (
          <CreditCardIcon className={cn("w-5 h-5", themeClasses.textMuted)} />
        );
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "purchase":
      case "bonus":
      case "refund":
      case "transfer_in":
        return themeClasses.success;
      case "session_booking":
      case "transfer_out":
        return themeClasses.error;
      case "session_completion":
        return themeClasses.textAccent;
      default:
        return themeClasses.textMuted;
    }
  };
  const PurchaseModal = () => {
    const [purchasing, setPurchasing] = useState(false);

    const creditPackages = [
      { credits: 10, price: 9.99, bonus: 0 },
      { credits: 25, price: 19.99, bonus: 5 },
      { credits: 50, price: 34.99, bonus: 15 },
      { credits: 100, price: 59.99, bonus: 35 },
    ];
    const handlePurchase = async (packageData) => {
      setPurchasing(true);
      try {
        console.log("Purchasing credits:", packageData);

        // Mock payment processing for demo
        const mockPaymentData = {
          amount: packageData.credits + packageData.bonus,
          paymentMethod: "credit_card", // In real app, this would come from payment form
          packageData,
        };

        const response = await creditsAPI.purchaseCredits(mockPaymentData);
        console.log("Purchase response:", response.data);

        if (response.data.success) {
          // Update local state immediately for better UX
          setBalance(
            (prevBalance) =>
              prevBalance + (packageData.credits + packageData.bonus)
          );

          // Refresh all data from server
          await fetchCreditData();

          toast.success(
            `Successfully purchased ${
              packageData.credits + packageData.bonus
            } credits!`
          );
          NotificationService.creditPurchased(
            packageData.credits + packageData.bonus
          );
          setShowPurchaseModal(false);
        }
      } catch (error) {
        console.error("Purchase error:", error);
        toast.error(
          error.response?.data?.message || "Purchase failed. Please try again."
        );
      } finally {
        setPurchasing(false);
      }
    };
    return (
      <div
        className={cn(
          "fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50",
          "bg-black/50"
        )}
      >
        <div
          className={cn(componentPatterns.modal, "w-full max-w-md mx-4 p-6")}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn("text-lg font-semibold", themeClasses.textPrimary)}
            >
              Purchase Credits
            </h3>
            <button
              onClick={() => setShowPurchaseModal(false)}
              className={cn(
                "transition-colors",
                themeClasses.textMuted,
                themeClasses.hover
              )}
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {creditPackages.map((pkg, index) => (
              <div
                key={index}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-colors",
                  themeClasses.borderSecondary,
                  themeClasses.hover
                )}
                onClick={() => handlePurchase(pkg)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div
                      className={cn("font-medium", themeClasses.textPrimary)}
                    >
                      {" "}
                      {pkg.credits} Credits
                      {pkg.bonus > 0 && (
                        <span
                          className={cn("text-sm ml-2", themeClasses.success)}
                        >
                          +{pkg.bonus} bonus
                        </span>
                      )}
                    </div>
                    <div className={cn("text-sm", themeClasses.textMuted)}>
                      Total: {pkg.credits + pkg.bonus} credits
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-lg font-semibold",
                      themeClasses.textPrimary
                    )}
                  >
                    ${pkg.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {purchasing && (
            <div className="mt-4 flex items-center justify-center">
              <LoadingSpinner />
              <span className={cn("ml-2", themeClasses.textPrimary)}>
                Processing payment...
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const TransferModal = () => {
    const [recipient, setRecipient] = useState("");
    const [amount, setAmount] = useState("");
    const [message, setMessage] = useState("");
    const [transferring, setTransferring] = useState(false);
    const handleTransfer = async (e) => {
      e.preventDefault();
      if (!recipient || !amount || parseInt(amount) <= 0) {
        toast.error("Please provide valid recipient and amount");
        return;
      }

      if (parseInt(amount) > balance) {
        toast.error("Insufficient credits");
        return;
      }

      setTransferring(true);
      try {
        console.log("Transferring credits:", { recipient, amount });

        const transferData = {
          toUserId: recipient, // In real app, this would be resolved from username/email
          amount: parseInt(amount),
          description: message || `Credit transfer of ${amount} credits`,
        };

        const response = await creditsAPI.transferCredits(transferData);
        console.log("Transfer response:", response.data);

        if (response.data.success) {
          // Update local state immediately for better UX
          setBalance((prevBalance) => prevBalance - parseInt(amount));

          // Refresh all data from server
          await fetchCreditData();

          toast.success(
            `Successfully transferred ${amount} credits to ${recipient}!`
          );
          NotificationService.creditTransferred(parseInt(amount), recipient);
          setShowTransferModal(false);
          setRecipient("");
          setAmount("");
          setMessage("");
        }
      } catch (error) {
        console.error("Transfer error:", error);
        toast.error(
          error.response?.data?.message || "Transfer failed. Please try again."
        );
      } finally {
        setTransferring(false);
      }
    };
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div
          className={cn(
            "rounded-lg p-6 w-full max-w-md mx-4",
            componentPatterns.card
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h3
              className={cn("text-lg font-semibold", themeClasses.textPrimary)}
            >
              Transfer Credits
            </h3>
            <button
              onClick={() => setShowTransferModal(false)}
              className={cn(
                "transition-colors",
                themeClasses.textMuted,
                "hover:text-text-primary"
              )}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-1",
                  themeClasses.textPrimary
                )}
              >
                Recipient Username/Email
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={cn(componentPatterns.input, "w-full")}
                placeholder="Enter username or email"
                required
              />
            </div>

            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-1",
                  themeClasses.textPrimary
                )}
              >
                Amount
              </label>
              <input
                type="number"
                min="1"
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(componentPatterns.input, "w-full")}
                placeholder="Credits to transfer"
                required
              />
              <p className={cn("text-xs mt-1", themeClasses.textMuted)}>
                Available: {balance} credits
              </p>
            </div>

            <div>
              <label
                className={cn(
                  "block text-sm font-medium mb-1",
                  themeClasses.textPrimary
                )}
              >
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={cn(componentPatterns.input, "w-full resize-none")}
                rows={2}
                placeholder="Add a message..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className={cn(
                  buttonVariants.secondary,
                  "flex-1",
                  "disabled:opacity-50"
                )}
                disabled={transferring}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={transferring || !recipient || !amount}
                className={cn(
                  buttonVariants.primary,
                  "flex-1",
                  "disabled:opacity-50"
                )}
              >
                {transferring ? "Transferring..." : "Transfer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  if (loading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgPrimary
        )}
      >
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen", themeClasses.bgPrimary)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {" "}
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {" "}
            <div>
              <h1
                className={cn("text-3xl font-bold", themeClasses.textPrimary)}
              >
                Credit Management
              </h1>
              <p className={cn("mt-2", themeClasses.textSecondary)}>
                Manage your credits for skill exchange sessions
              </p>
              {lastUpdated && (
                <p className={cn("text-xs mt-1", themeClasses.textMuted)}>
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>{" "}
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchCreditData}
                disabled={loading}
                className={cn(
                  buttonVariants.secondary,
                  "flex items-center space-x-2",
                  loading && "opacity-50 cursor-not-allowed"
                )}
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span>{loading ? "Refreshing..." : "Refresh"}</span>
              </button>
              <button
                onClick={testAPI}
                className={cn(
                  buttonVariants.secondary,
                  "flex items-center space-x-2"
                )}
              >
                <span>Test API</span>
              </button>
            </div>
          </div>
        </div>{" "}
        {/* Balance Card */}
        <div
          className={cn(
            "rounded-lg p-8 text-white mb-8",
            themeClasses.gradientAccent
          )}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
              <div className="text-4xl font-bold">{balance}</div>
              <p className="text-white/80 mt-1">Credits Available</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowPurchaseModal(true)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium transition-colors",
                  "bg-white text-accent-primary hover:bg-white/90"
                )}
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Buy Credits
              </button>
              <button
                onClick={() => setShowTransferModal(true)}
                className={cn(
                  "flex items-center px-4 py-2 rounded-lg font-medium transition-colors",
                  "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
                )}
              >
                <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
                Transfer
              </button>
            </div>
          </div>
        </div>{" "}
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={componentPatterns.card}>
            <div className="flex items-center p-6">
              <div className={cn("p-2 rounded-lg", themeClasses.successLight)}>
                <ArrowDownIcon
                  className={cn("w-6 h-6", themeClasses.success)}
                />
              </div>
              <div className="ml-4">
                <p
                  className={cn(
                    "text-sm font-medium",
                    themeClasses.textSecondary
                  )}
                >
                  Credits Earned
                </p>
                <p
                  className={cn("text-2xl font-bold", themeClasses.textPrimary)}
                >
                  {stats.totalEarned || 0}
                </p>
              </div>
            </div>
          </div>

          <div className={componentPatterns.card}>
            <div className="flex items-center p-6">
              <div className={cn("p-2 rounded-lg", "bg-accent-light")}>
                <ArrowUpIcon
                  className={cn("w-6 h-6", themeClasses.textAccent)}
                />
              </div>
              <div className="ml-4">
                <p
                  className={cn(
                    "text-sm font-medium",
                    themeClasses.textSecondary
                  )}
                >
                  Credits Spent
                </p>
                <p
                  className={cn("text-2xl font-bold", themeClasses.textPrimary)}
                >
                  {stats.totalSpent || 0}
                </p>
              </div>
            </div>
          </div>

          <div className={componentPatterns.card}>
            <div className="flex items-center p-6">
              <div className={cn("p-2 rounded-lg", themeClasses.infoLight)}>
                <ChartBarIcon className={cn("w-6 h-6", themeClasses.info)} />
              </div>
              <div className="ml-4">
                <p
                  className={cn(
                    "text-sm font-medium",
                    themeClasses.textSecondary
                  )}
                >
                  Sessions This Month
                </p>
                <p
                  className={cn("text-2xl font-bold", themeClasses.textPrimary)}
                >
                  {stats.monthlyeSessions || 0}
                </p>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Recent Transactions */}
        <div className={componentPatterns.card}>
          <div
            className={cn("px-6 py-4 border-b", themeClasses.borderSecondary)}
          >
            <h3 className={cn("text-lg font-medium", themeClasses.textPrimary)}>
              Recent Transactions
            </h3>
          </div>

          <div className={cn("divide-y", themeClasses.borderSecondary)}>
            {transactions.length === 0 ? (
              <div className={cn("p-6 text-center", themeClasses.textMuted)}>
                No transactions yet
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction._id}
                  className="p-6 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="ml-4">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          themeClasses.textPrimary
                        )}
                      >
                        {transaction.description}
                      </p>
                      <p className={cn("text-sm", themeClasses.textSecondary)}>
                        {format(
                          new Date(transaction.createdAt),
                          "MMM dd, yyyy • h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      getTransactionColor(transaction.type)
                    )}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showPurchaseModal && <PurchaseModal />}
      {showTransferModal && <TransferModal />}
    </div>
  );
};

export default CreditManager;
