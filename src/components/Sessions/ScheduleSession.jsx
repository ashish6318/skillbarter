import React, { useState, useEffect, useCallback } from "react";
import { sessionsAPI } from "../../utils/api";
import { format, addDays, startOfDay } from "date-fns";

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Schedule Session
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* Teacher Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                {teacher.profilePicture ? (
                  <img
                    src={teacher.profilePicture}
                    alt={teacher.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-600">
                    {teacher.name?.charAt(0) || "T"}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {teacher.name || "Teacher"}
                </p>
                <p className="text-sm text-gray-600">{skill}</p>
                {teacher.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-600">{teacher.rating}</span>
                    {teacher.totalRatings && (
                      <span className="text-gray-500">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setFormData({ ...formData, scheduledFor: "" });
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Time Slots
                </label>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">
                      Loading slots...
                    </p>
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500 mb-2">
                      No available slots for this date
                    </p>
                    <p className="text-xs text-gray-400">
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
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          formData.scheduledFor === slot.start
                            ? "bg-blue-100 border-blue-300 text-blue-800"
                            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {formData.message.length}/500
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.scheduledFor}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
