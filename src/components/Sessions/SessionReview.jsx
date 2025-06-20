import React, { useState } from "react";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
} from "../../utils/theme";

const SessionReview = ({ session, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        rating,
        feedback: feedback.trim(),
        wouldRecommend,
      });
    } finally {
      setSubmitting(false);
    }
  };
  const StarRating = ({ value, onChange }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={cn(
              "text-2xl transition-colors",
              star <= value
                ? "text-theme-warning hover:text-theme-warning/80"
                : cn(themeClasses.textMuted, "hover:text-text-secondary")
            )}
          >
            ★
          </button>
        ))}
      </div>
    );
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
              Review Session
            </h3>
            <button
              onClick={onClose}
              className={cn(
                "transition-colors text-xl",
                themeClasses.textMuted,
                "hover:text-text-primary"
              )}
            >
              ×
            </button>
          </div>{" "}
          {/* Session Info */}
          <div className={cn(componentPatterns.card, "mb-6")}>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(componentPatterns.avatar, "w-10 h-10")}>
                {session.teacher.profilePicture ? (
                  <img
                    src={session.teacher.profilePicture}
                    alt={session.teacher.name}
                    className="w-10 h-10 rounded-full object-cover"
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
                <p className={cn("font-medium", themeClasses.textPrimary)}>
                  {session.teacher.name}
                </p>
                <p className={cn("text-sm", themeClasses.textSecondary)}>
                  {session.skill}
                </p>
              </div>
            </div>
          </div>
          {/* Review Form */}
          <form onSubmit={handleSubmit}>
            {" "}
            {/* Rating */}
            <div className="mb-6">
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  themeClasses.textPrimary
                )}
              >
                How would you rate this session?
              </label>
              <StarRating value={rating} onChange={setRating} />
              <div className={cn("text-xs mt-1", themeClasses.textMuted)}>
                {rating === 0 && "Select a rating"}
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </div>
            </div>{" "}
            {/* Feedback */}
            <div className="mb-6">
              <label
                className={cn(
                  "block text-sm font-medium mb-2",
                  themeClasses.textPrimary
                )}
              >
                Your feedback (optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your experience with this session..."
                maxLength={500}
                rows={4}
                className={cn(componentPatterns.textarea, "w-full")}
              />
              <div
                className={cn(
                  "text-xs mt-1 text-right",
                  themeClasses.textMuted
                )}
              >
                {feedback.length}/500
              </div>
            </div>{" "}
            {/* Recommendation */}
            <div className="mb-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={wouldRecommend}
                  onChange={(e) => setWouldRecommend(e.target.checked)}
                  className={cn(
                    "rounded",
                    themeClasses.borderSecondary,
                    themeClasses.textAccent,
                    themeClasses.focus
                  )}
                />
                <span className={cn("text-sm", themeClasses.textPrimary)}>
                  I would recommend this teacher to others
                </span>
              </label>
            </div>{" "}
            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className={cn(
                  buttonVariants.secondary,
                  "flex-1",
                  themeClasses.disabled
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className={cn(
                  buttonVariants.primary,
                  "flex-1",
                  themeClasses.disabled
                )}
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SessionReview;
