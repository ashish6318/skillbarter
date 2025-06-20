import React, { useState, useEffect, useCallback } from "react";
import { sessionsAPI } from "../../utils/api";
import { format, addDays, startOfDay } from "date-fns";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

const ScheduleSession = ({ teacher, skill, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    scheduledFor: "",
    duration: 60,
    message: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fetchAvailableSlots = useCallback(async () => {
    if (!selectedDate) return;

    setLoading(true);
    try {
      const teacherId = teacher._id || teacher.id;
      if (!teacherId) {
        console.error("Teacher ID not found:", teacher);
        setAvailableSlots([]);
        return;
      }

      console.log("Fetching slots for:", {
        teacherId,
        selectedDate,
        duration: formData.duration,
      });

      const response = await sessionsAPI.getAvailableSlots(teacherId, {
        date: selectedDate,
        duration: formData.duration,
      });

      console.log("Slots response:", response.data);
      setAvailableSlots(response.data.slots || []);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      console.error("Error response:", error.response?.data);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, formData.duration, teacher]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, fetchAvailableSlots]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.scheduledFor) {
      alert("Please select a time slot");
      return;
    }
    setSubmitting(true);
    try {
      const teacherId = teacher._id || teacher.id;
      const sessionData = {
        teacher: teacherId,
        skill,
        scheduledFor: formData.scheduledFor,
        duration: formData.duration,
        message: formData.message.trim(),
      };

      console.log("Creating session with data:", sessionData);

      await sessionsAPI.createSession(sessionData);
      onSuccess();
    } catch (error) {
      console.error("Error creating session:", error);
      console.error("Error response:", error.response?.data);
      alert(error.response?.data?.error || "Failed to create session");
    } finally {
      setSubmitting(false);
    }
  };

  const getDurationOptions = () => {
    return [
      { value: 30, label: "30 minutes" },
      { value: 60, label: "1 hour" },
      { value: 90, label: "1.5 hours" },
      { value: 120, label: "2 hours" },
    ];
  };

  const getDateOptions = () => {
    const dates = [];
    const today = startOfDay(new Date());

    for (let i = 0; i < 14; i++) {
      const date = addDays(today, i);
      dates.push({
        value: format(date, "yyyy-MM-dd"),
        label: format(date, "EEEE, MMM dd"),
      });
    }

    return dates;
  };
  const formatTimeSlot = (slot) => {
    const start = new Date(slot.start);
    const end = new Date(slot.end);
    return `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
  };
  return (
    <div
      className={cn(
        "fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50",
        "bg-black/50"
      )}
    >
      <div
        className={cn(
          componentPatterns.modal,
          "max-w-md w-full max-h-[90vh] overflow-y-auto"
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3
              className={cn("text-xl font-semibold", themeClasses.textPrimary)}
            >
              Schedule Session
            </h3>
            <button
              onClick={onClose}
              className={cn(
                "text-xl transition-colors",
                themeClasses.textMuted,
                themeClasses.hover
              )}
            >
              ×
            </button>
          </div>

          {/* Teacher Info */}
          <div className={cn("rounded-lg p-4 mb-6", themeClasses.bgTertiary)}>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  themeClasses.bgSecondary
                )}
              >
                {teacher.profilePicture ? (
                  <img
                    src={teacher.profilePicture}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className={cn(
                      "text-lg font-medium",
                      themeClasses.textSecondary
                    )}
                  >
                    {teacher.name?.charAt(0) || "T"}
                  </span>
                )}
              </div>
              <div>
                <p className={cn("font-medium", themeClasses.textPrimary)}>
                  {teacher.name || "Teacher"}
                </p>
                <p className={cn("text-sm", themeClasses.textSecondary)}>
                  {skill}
                </p>
                {teacher.rating && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm",
                      themeClasses.textSecondary
                    )}
                  >
                    <span className="text-theme-warning">★</span>
                    <span>{teacher.rating}</span>
                    {teacher.totalRatings && (
                      <span className={themeClasses.textMuted}>
                        ({teacher.totalRatings})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Form */}
          <form onSubmit={handleSubmit}>
            {/* Duration */}
            <div className="mb-4">
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  themeClasses.textPrimary
                )}
              >
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: parseInt(e.target.value),
                  })
                }
                className={cn(componentPatterns.input)}
              >
                {getDurationOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="mb-4">
              {" "}
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  themeClasses.textPrimary
                )}
              >
                Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setFormData({ ...formData, scheduledFor: "" });
                }}
                className={cn(componentPatterns.input)}
              >
                <option value="">Select a date</option>
                {getDateOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Slots */}
            {selectedDate && (
              <div className="mb-4">
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    themeClasses.textPrimary
                  )}
                >
                  Available Time Slots
                </label>
                {loading ? (
                  <div className="text-center py-4">
                    <div
                      className={cn(
                        "animate-spin rounded-full h-6 w-6 border-b-2 border-border-accent mx-auto"
                      )}
                    ></div>
                    <p className={cn("text-sm mt-2", themeClasses.textMuted)}>
                      Loading slots...
                    </p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-4">
                    <p className={cn("text-sm mb-2", themeClasses.textMuted)}>
                      No available slots for this date
                    </p>
                    <p className={cn("text-xs", themeClasses.textMuted)}>
                      Try selecting a different date or check back later
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, scheduledFor: slot.start })
                        }
                        className={cn(
                          "p-2 text-sm rounded-lg border transition-colors",
                          formData.scheduledFor === slot.start
                            ? cn(
                                themeClasses.bgTertiary,
                                themeClasses.borderAccent,
                                themeClasses.textAccent
                              )
                            : cn(
                                themeClasses.bgPrimary,
                                themeClasses.borderSecondary,
                                themeClasses.textPrimary,
                                themeClasses.hover
                              )
                        )}
                      >
                        {formatTimeSlot(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Message */}
            <div className="mb-6">
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  themeClasses.textPrimary
                )}
              >
                Message (optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Tell the teacher what you'd like to learn or any specific requirements..."
                maxLength={500}
                rows={3}
                className={cn(componentPatterns.input, "resize-none")}
              />
              <div
                className={cn(
                  "text-xs mt-1 text-right",
                  themeClasses.textMuted
                )}
              >
                {formData.message.length}/500
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className={cn(
                  buttonVariants.secondary,
                  "flex-1",
                  submitting && "opacity-50 cursor-not-allowed"
                )}
              >
                Cancel
              </button>{" "}
              <button
                type="submit"
                disabled={submitting || !formData.scheduledFor}
                className={cn(
                  buttonVariants.primary,
                  "flex-1",
                  (submitting || !formData.scheduledFor) &&
                    themeClasses.disabled
                )}
              >
                {submitting ? "Booking..." : "Book Session"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleSession;
