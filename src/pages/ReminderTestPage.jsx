import React, { useState } from "react";

const ReminderTestPage = () => {
  const [sessionId, setSessionId] = useState("");
  const [reminderType, setReminderType] = useState("15min");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const testReminder = async () => {
    if (!sessionId) {
      alert("Please enter a session ID");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/reminders/send/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ reminderType }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Reminder sent successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getReminderStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reminders/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setStats(result.stats);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerReminderCheck = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reminders/test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        alert("Reminder check triggered successfully!");
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Reminder System Test
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Send Manual Reminder</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session ID
              </label>
              <input
                type="text"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter session ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Type
              </label>
              <select
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="15min">15 minutes</option>
                <option value="1h">1 hour</option>
                <option value="24h">24 hours</option>
              </select>
            </div>

            <button
              onClick={testReminder}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Test Reminder"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Reminder Statistics</h2>

          <button
            onClick={getReminderStats}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 mb-4"
          >
            {loading ? "Loading..." : "Get Stats"}
          </button>

          {stats && (
            <div className="bg-gray-50 rounded-md p-4">
              <pre className="text-sm">{JSON.stringify(stats, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Test Reminder Check</h2>

          <button
            onClick={triggerReminderCheck}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Triggering..." : "Trigger Reminder Check"}
          </button>

          <p className="text-sm text-gray-600 mt-2">
            This will manually trigger the reminder check process for all
            upcoming sessions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReminderTestPage;
