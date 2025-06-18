import React, { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const RescheduleModal = ({ session, isOpen, onClose, onSubmit }) => {
  const [newDateTime, setNewDateTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newDateTime) {
      alert("Please select a new date and time");
      return;
    }

    const newDate = new Date(newDateTime);
    if (newDate <= new Date()) {
      alert("Please select a future date and time");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        newScheduledFor: newDate.toISOString(),
        reason: reason.trim() || undefined,
      });
      onClose();
      setNewDateTime("");
      setReason("");
    } catch (error) {
      console.error("Error rescheduling:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrentDateTime = () => {
    return format(new Date(session.scheduledFor), "MMM dd, yyyy 'at' h:mm a");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Reschedule Session
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <h4 className="text-md font-medium text-gray-800 mb-2">
            {session.skill}
          </h4>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Current: {formatCurrentDateTime()}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ClockIcon className="w-4 h-4" />
            <span>Duration: {session.duration} minutes</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Date & Time *
            </label>
            <input
              type="datetime-local"
              value={newDateTime}
              onChange={(e) => setNewDateTime(e.target.value)}
              min={new Date(Date.now() + 60 * 60 * 1000)
                .toISOString()
                .slice(0, 16)} // At least 1 hour from now
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you rescheduling this session?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !newDateTime}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Rescheduling..." : "Reschedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
