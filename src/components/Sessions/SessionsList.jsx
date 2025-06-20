import React from "react";
import SessionCard from "./SessionCard";
import { themeClasses, componentPatterns, cn } from "../../utils/theme";

const SessionsList = ({ sessions, currentUser, onAction, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(componentPatterns.card, "p-6 animate-pulse")}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div
                  className={cn(
                    "h-6 rounded w-1/3 mb-2",
                    themeClasses.bgTertiary
                  )}
                ></div>
                <div
                  className={cn(
                    "h-4 rounded w-2/3 mb-3",
                    themeClasses.bgTertiary
                  )}
                ></div>
                <div className="flex gap-4 mb-3">
                  <div
                    className={cn("h-4 rounded w-20", themeClasses.bgTertiary)}
                  ></div>
                  <div
                    className={cn("h-4 rounded w-20", themeClasses.bgTertiary)}
                  ></div>
                  <div
                    className={cn("h-4 rounded w-20", themeClasses.bgTertiary)}
                  ></div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full",
                        themeClasses.bgTertiary
                      )}
                    ></div>
                    <div
                      className={cn(
                        "h-4 rounded w-16",
                        themeClasses.bgTertiary
                      )}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full",
                        themeClasses.bgTertiary
                      )}
                    ></div>
                    <div
                      className={cn(
                        "h-4 rounded w-16",
                        themeClasses.bgTertiary
                      )}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <div
                  className={cn("h-8 rounded w-20", themeClasses.bgTertiary)}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className={cn(componentPatterns.card, "p-8 text-center")}>
        <div className="text-6xl mb-4">📚</div>
        <p className={cn("text-lg", themeClasses.textMuted)}>
          No sessions found
        </p>
        <p className={cn("text-sm mt-2", themeClasses.textMuted)}>
          Start by booking a session with someone from the Discover page!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          currentUser={currentUser}
          onAction={onAction}
        />
      ))}
    </div>
  );
};

export default SessionsList;
