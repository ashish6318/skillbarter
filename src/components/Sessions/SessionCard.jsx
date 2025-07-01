import React, { useState } from "react";
import { format } from "date-fns";
import SessionReview from "./SessionReview";
import RescheduleModal from "./RescheduleModal";
import { themeClasses, componentPatterns, cn } from "../../utils/theme";

const SessionCard = ({ session, currentUser, onAction }) => {
  const [showReview, setShowReview] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [loading, setLoading] = useState(false);

  const isTeacher = session.teacher._id === currentUser.id;
  const isStudent = session.student._id === currentUser.id;
  const getStatusColor = (status) => {
    const statusColorMap = {
      pending:
        "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600",
      confirmed:
        "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-400 dark:border-gray-500",
      in_progress:
        "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100",
      completed: cn(
        "bg-gray-50 dark:bg-gray-900",
        "text-gray-600 dark:text-gray-400",
        "border-gray-200 dark:border-gray-800"
      ),
      cancelled:
        "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-500",
    };
    return (
      statusColorMap[status] ||
      cn(
        "bg-gray-50 dark:bg-gray-900",
        "text-gray-600 dark:text-gray-400",
        "border-gray-200 dark:border-gray-800"
      )
    );
  };

  const handleAction = async (action, data = {}) => {
    setLoading(true);
    try {
      await onAction(session._id, action, data);
    } finally {
      setLoading(false);
    }
  };

  const canStart = () => {
    const now = new Date();
    const scheduledTime = new Date(session.scheduledFor);
    const timeDiff = Math.abs(now - scheduledTime) / (1000 * 60); // minutes
    return session.status === "confirmed" && timeDiff <= 15;
  };

  const canEnd = () => {
    return session.status === "in_progress";
  };

  const canReview = () => {
    return (
      session.status === "completed" && isStudent && !session.review?.rating
    );
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };
  return (
    <div className={cn(componentPatterns.card, "p-6")}>
      <div className="flex justify-between items-start mb-4">
        {/* Session Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3
              className={cn("text-xl font-semibold", themeClasses.textPrimary)}
            >
              {session.skill}
            </h3>
            <span
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium border",
                getStatusColor(session.status)
              )}
            >
              {(session.status || "unknown").charAt(0).toUpperCase() +
                (session.status || "unknown").slice(1).replace("_", " ")}
            </span>
          </div>
          <div
            className={cn(
              "flex items-center gap-4 text-sm mb-3",
              themeClasses.textSecondary
            )}
          >
            <span>
              📅 {format(new Date(session.scheduledFor), "MMM dd, yyyy")}
            </span>
            <span>🕐 {format(new Date(session.scheduledFor), "h:mm a")}</span>
            <span>⏱️ {formatDuration(session.duration)}</span>
          </div>{" "}
          {/* Participant Info */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  themeClasses.bgTertiary
                )}
              >
                {session.teacher.profilePicture ? (
                  <img
                    src={session.teacher.profilePicture}
                    alt={session.teacher.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      themeClasses.textSecondary
                    )}
                  >
                    {session.teacher.name?.charAt(0) || "T"}
                  </span>
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    themeClasses.textPrimary
                  )}
                >
                  {session.teacher.name}
                </p>
                <p className={cn("text-xs", themeClasses.textMuted)}>Teacher</p>
              </div>
            </div>

            <span className={themeClasses.textMuted}>↔</span>

            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  themeClasses.bgTertiary
                )}
              >
                {session.student.profilePicture ? (
                  <img
                    src={session.student.profilePicture}
                    alt={session.student.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      themeClasses.textSecondary
                    )}
                  >
                    {session.student.name?.charAt(0) || "S"}
                  </span>
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    themeClasses.textPrimary
                  )}
                >
                  {session.student.name}
                </p>
                <p className={cn("text-xs", themeClasses.textMuted)}>Student</p>
              </div>
            </div>
          </div>
          {/* Message */}
          {session.message && (
            <div className={cn("rounded-lg p-3 mb-3", themeClasses.bgTertiary)}>
              <p className={cn("text-sm", themeClasses.textSecondary)}>
                "{session.message}"
              </p>
            </div>
          )}{" "}
          {/* Session Notes */}
          {session.status === "completed" &&
            (session.teacherNotes || session.studentNotes) && (
              <div
                className={cn(
                  "rounded-lg p-3 mb-3",
                  "bg-gray-100 dark:bg-gray-800"
                )}
              >
                {" "}
                {session.teacherNotes && (
                  <div className="mb-2">
                    <p
                      className={cn(
                        "text-xs font-medium mb-1",
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      Teacher Notes:
                    </p>
                    <p className={cn("text-sm", themeClasses.textPrimary)}>
                      {session.teacherNotes}
                    </p>
                  </div>
                )}
                {session.studentNotes && (
                  <div>
                    <p
                      className={cn(
                        "text-xs font-medium mb-1",
                        "text-gray-700 dark:text-gray-300"
                      )}
                    >
                      Student Notes:
                    </p>
                    <p className={cn("text-sm", themeClasses.textPrimary)}>
                      {session.studentNotes}
                    </p>
                  </div>
                )}
              </div>
            )}{" "}
          {/* Review */}
          {session.review?.rating && (
            <div
              className={cn(
                "rounded-lg p-3 mb-3",
                "bg-gray-100 dark:bg-gray-800"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "text-sm font-medium",
                    "text-gray-700 dark:text-gray-300"
                  )}
                >
                  Review:
                </span>
                <div className="flex text-gray-600 dark:text-gray-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < session.review.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
              {session.review.feedback && (
                <p
                  className={cn("text-sm", "text-gray-700 dark:text-gray-300")}
                >
                  {session.review.feedback}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 ml-4">
          {" "}
          {/* Pending Status Actions */}
          {session.status === "pending" && isTeacher && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleAction("accept")}
                disabled={loading}
                className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Accept
              </button>
              <button
                onClick={() => {
                  const reason = prompt("Reason for rejection (optional):");
                  const data = { reason };
                  if (!reason) delete data.reason; // Remove null/empty reason
                  handleAction("reject", data);
                }}
                disabled={loading}
                className="px-4 py-2 bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Reject
              </button>
            </div>
          )}{" "}
          {/* Confirmed Status Actions */}
          {session.status === "confirmed" && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setShowReschedule(true)}
                disabled={loading}
                className="px-4 py-2 bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Reschedule
              </button>
              <button
                onClick={() => {
                  const reason = prompt("Reason for cancellation (optional):");
                  const data = { reason };
                  if (!reason) delete data.reason; // Remove null/empty reason
                  handleAction("cancel", data);
                }}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 dark:bg-gray-600 text-white dark:text-gray-100 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          )}{" "}
          {/* In Progress Status Actions */}
          {canEnd() && (
            <button
              onClick={() => {
                const actualDuration = prompt(
                  "Actual duration (minutes):",
                  session.duration
                );
                const notes = isTeacher
                  ? prompt("Teacher notes (optional):")
                  : prompt("Student notes (optional):");

                const data = {
                  actualDuration: parseInt(actualDuration) || session.duration,
                };
                if (isTeacher) data.teacherNotes = notes;
                else data.studentNotes = notes;

                handleAction("end", data);
              }}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-lg hover:bg-gray-900 dark:hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              End Session
            </button>
          )}{" "}
          {/* Room Access - Show join button for both confirmed and in-progress sessions */}
          {session.status === "confirmed" && canStart() && (
            <button
              onClick={() => handleAction("start")}
              disabled={loading}
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚀 Start Session
            </button>
          )}{" "}
          {/* Video Call Access - Show when session is in progress */}
          {session.status === "in_progress" && (
            <button
              onClick={() => {
                // Navigate to video call component
                window.open(
                  `/session/${session._id}/room`,
                  "_blank",
                  "width=1200,height=800"
                );
              }}
              className="px-4 py-2 bg-gray-700 dark:bg-gray-300 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-400 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🎥 Join Video Call
            </button>
          )}
          {/* Review Action */}
          {canReview() && (
            <button
              onClick={() => setShowReview(true)}
              className={cn(
                "px-4 py-2 bg-gray-600 dark:bg-gray-400 text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              )}
            >
              Write Review
            </button>
          )}
        </div>
      </div>{" "}
      {/* Review Modal */}
      {showReview && (
        <SessionReview
          session={session}
          onClose={() => setShowReview(false)}
          onSubmit={(reviewData) => {
            handleAction("review", reviewData);
            setShowReview(false);
          }}
        />
      )}
      {/* Reschedule Modal */}
      {showReschedule && (
        <RescheduleModal
          session={session}
          isOpen={showReschedule}
          onClose={() => setShowReschedule(false)}
          onSubmit={(rescheduleData) => {
            handleAction("reschedule", rescheduleData);
            setShowReschedule(false);
          }}
        />
      )}
    </div>
  );
};

export default SessionCard;
