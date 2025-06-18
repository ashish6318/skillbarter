import React, { useState, useEffect } from "react";
import {
  CreditCardIcon,
  PlusIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChartBarIcon,
  GiftIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { creditsAPI } from "../../utils/api";
import LoadingSpinner from "../Common/LoadingSpinner";
import toast from "react-hot-toast";
import NotificationService from "../../services/NotificationService";

const CreditManager = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  useEffect(() => {
    fetchCreditData();
  }, []);

  // Check for low credits warning
  useEffect(() => {
    if (balance > 0 && balance <= 5) {
      NotificationService.lowCreditsWarning(balance);
    }
  }, [balance]);
  const fetchCreditData = async () => {
    try {
      const [balanceRes, transactionsRes, statsRes] = await Promise.all([
        creditsAPI.getBalance(),
        creditsAPI.getTransactions({ limit: 20 }),
        creditsAPI.getStats(),
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions || []);
      setStats(statsRes.data.stats || {});
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
        return <ArrowDownIcon className="w-5 h-5 text-green-500" />;
      case "session_booking":
      case "session_completion":
      case "transfer_out":
        return <ArrowUpIcon className="w-5 h-5 text-red-500" />;
      case "transfer_in":
        return <ArrowsRightLeftIcon className="w-5 h-5 text-blue-500" />;
      default:
        return <CreditCardIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case "purchase":
      case "bonus":
      case "refund":
      case "transfer_in":
        return "text-green-600";
      case "session_booking":
      case "transfer_out":
        return "text-red-600";
      case "session_completion":
        return "text-blue-600";
      default:
        return "text-gray-600";
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
        // Mock payment processing for demo
        const mockPaymentData = {
          amount: packageData.credits + packageData.bonus,
          paymentMethod: "credit_card", // In real app, this would come from payment form
          packageData,
        };

        const response = await creditsAPI.purchaseCredits(mockPaymentData);
        if (response.data.success) {
          await fetchCreditData(); // Refresh data
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Purchase Credits</h3>
            <button
              onClick={() => setShowPurchaseModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <div className="space-y-3">
            {creditPackages.map((pkg, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => handlePurchase(pkg)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">
                      {pkg.credits} Credits
                      {pkg.bonus > 0 && (
                        <span className="text-green-600 text-sm ml-2">
                          +{pkg.bonus} bonus
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Total: {pkg.credits + pkg.bonus} credits
                    </div>
                  </div>
                  <div className="text-lg font-semibold">${pkg.price}</div>
                </div>
              </div>
            ))}
          </div>

          {purchasing && (
            <div className="mt-4 flex items-center justify-center">
              <LoadingSpinner />
              <span className="ml-2">Processing payment...</span>
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
        const transferData = {
          toUserId: recipient, // In real app, this would be resolved from username/email
          amount: parseInt(amount),
          description: message || `Credit transfer of ${amount} credits`,
        };

        const response = await creditsAPI.transferCredits(transferData);
        if (response.data.success) {
          await fetchCreditData(); // Refresh data
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
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Transfer Credits</h3>
            <button
              onClick={() => setShowTransferModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Username/Email
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username or email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <input
                type="number"
                min="1"
                max={balance}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Credits to transfer"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Available: {balance} credits
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                placeholder="Add a message..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={transferring}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={transferring || !recipient || !amount}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Credit Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your credits for skill exchange sessions
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Current Balance</h2>
              <div className="text-4xl font-bold">{balance}</div>
              <p className="text-blue-100 mt-1">Credits Available</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowPurchaseModal(true)}
                className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Buy Credits
              </button>{" "}
              <button
                onClick={() => setShowTransferModal(true)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 font-medium"
              >
                <ArrowsRightLeftIcon className="w-5 h-5 mr-2" />
                Transfer
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowDownIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Credits Earned
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalEarned || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ArrowUpIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Credits Spent
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalSpent || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Sessions This Month
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.monthlyeSessions || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Recent Transactions
            </h3>
          </div>

          <div className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
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
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(
                          new Date(transaction.createdAt),
                          "MMM dd, yyyy • h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-medium ${getTransactionColor(
                      transaction.type
                    )}`}
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
