import React, { useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

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
    <div
      className={cn(
        "fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50",
        "bg-black/50"
      )}
    >
      <div className={cn(componentPatterns.modal, "w-full max-w-md mx-4 p-6")}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={cn("text-lg font-semibold", themeClasses.textPrimary)}>
            Reschedule Session
          </h3>
          <button
            onClick={onClose}
            className={cn(
              "transition-colors",
              themeClasses.textMuted,
              "hover:text-text-primary"
            )}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <h4
            className={cn("text-md font-medium mb-2", themeClasses.textPrimary)}
          >
            {session.skill}
          </h4>
          <div
            className={cn(
              "flex items-center gap-2 text-sm mb-2",
              themeClasses.textSecondary
            )}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Current: {formatCurrentDateTime()}</span>
          </div>{" "}
          <div
            className={cn(
              "flex items-center gap-2 text-sm",
              themeClasses.textSecondary
            )}
          >
            <ClockIcon className="w-4 h-4" />
            <span>Duration: {session.duration} minutes</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
              New Date & Time *
            </label>
            <input
              type="datetime-local"
              value={newDateTime}
              onChange={(e) => setNewDateTime(e.target.value)}
              min={new Date(Date.now() + 60 * 60 * 1000)
                .toISOString()
                .slice(0, 16)} // At least 1 hour from now
              className={cn(componentPatterns.input)}
              required
            />
          </div>

          <div>
            <label
              className={cn(
                "block text-sm font-medium mb-2",
                themeClasses.textPrimary
              )}
            >
              Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you rescheduling this session?"
              className={cn(componentPatterns.input, "resize-none")}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={cn(
                buttonVariants.secondary,
                "flex-1",
                loading && "opacity-50 cursor-not-allowed"
              )}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !newDateTime}
              className={cn(
                buttonVariants.primary,
                "flex-1",
                (loading || !newDateTime) && "opacity-50 cursor-not-allowed"
              )}
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
