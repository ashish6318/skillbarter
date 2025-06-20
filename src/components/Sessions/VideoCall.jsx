import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sessionsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import {
  MicrophoneIcon,
  VideoCameraIcon,
  PhoneXMarkIcon,
  ChatBubbleLeftRightIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  themeClasses,
  componentPatterns,
  cn,
  buttonVariants,
  statusClasses,
} from "../../utils/theme";

const VideoCall = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const jitsiContainer = useRef(null);
  const jitsiApi = useRef(null);
  const sessionEndedByOther = useRef(false);
  const handleEndSessionRef = useRef(null);

  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionEndingByOther, setSessionEndingByOther] = useState(false);
  const [userJoinedCall, setUserJoinedCall] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [mediaEnabled, setMediaEnabled] = useState({
    audio: true,
    video: true,
  });

  const initializeJitsiMeet = useCallback(
    (room) => {
      if (!window.JitsiMeetExternalAPI || !jitsiContainer.current) {
        toast.error("Video conferencing not available");
        return;
      }

      const domain = "meet.ffmuc.net"; // Working Jitsi server without lobby restrictions
      const options = {
        roomName: room.roomId,
        width: "100%",
        height: "600px",
        parentNode: jitsiContainer.current,
        userInfo: {
          displayName:
            user?.fullName ||
            `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
            "Anonymous",
          email: user?.email || "",
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          enableWelcomePage: false,
          enableClosePage: false,
          prejoinPageEnabled: false,
          disableProfile: true,
          // Fix for members-only room issue
          requireDisplayName: false,
          enableLobbyChat: false,
          enableNoAudioDetection: false,
          enableNoisyMicDetection: false,
          // CRITICAL: Disable lobby/waiting room feature
          enableLobby: false,
          enableAutomaticLobby: false,
          // Make rooms open access
          roomPasswordNumberOfDigits: false,
          // Additional settings to prevent lobby/members-only mode
          enableLayerSuspension: true,
          disableAGC: false,
          disableAEC: false,
          disableNS: false,
          disableAP: false,
          disableHfec: false,
          stereo: false,
          forceJVB121: false,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "closedcaptions",
            "desktop",
            "fullscreen",
            "fodeviceselection",
            "hangup",
            "profile",
            "info",
            "chat",
            "recording",
            "livestreaming",
            "etherpad",
            "sharedvideo",
            "settings",
            "raisehand",
            "videoquality",
            "filmstrip",
            "feedback",
            "stats",
            "shortcuts",
            "tileview",
            "videobackgroundblur",
            "download",
            "help",
            "mute-everyone",
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: "",
          SHOW_POWERED_BY: false,
          DISPLAY_WELCOME_PAGE_CONTENT: false,
          DISPLAY_WELCOME_PAGE_TOOLBAR_ADDITIONAL_CONTENT: false,
          APP_NAME: "Skill Barter",
          NATIVE_APP_NAME: "Skill Barter",
          PROVIDER_NAME: "Skill Barter Platform",
          CLOSE_PAGE_GUEST_HINT: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
          RANDOM_AVATAR_URL_PREFIX: false,
          RANDOM_AVATAR_URL_SUFFIX: false,
        },
      };
      jitsiApi.current = new window.JitsiMeetExternalAPI(domain, options);

      // Event listeners
      jitsiApi.current.addEventListener("videoConferenceJoined", () => {
        console.log("User joined the conference");
        toast.success("Joined video call successfully");
        setUserJoinedCall(true);
        setIsJoining(false);
      });

      jitsiApi.current.addEventListener("videoConferenceLeft", () => {
        console.log("User left the conference");
        setUserJoinedCall(false);
        setIsJoining(false);
        // Only trigger end session if it wasn't already ended by the other user
        if (!sessionEndedByOther.current && handleEndSessionRef.current) {
          // Use a timeout to avoid calling handleEndSession during render
          setTimeout(() => {
            handleEndSessionRef.current();
          }, 0);
        }
      });
      jitsiApi.current.addEventListener("participantJoined", (participant) => {
        console.log("Participant joined:", participant);
        toast.success(`${participant.displayName} joined the session`);
      });
      jitsiApi.current.addEventListener("participantLeft", (participant) => {
        console.log("Participant left:", participant);
        toast.success(`${participant.displayName} left the session`);
      });

      // Add error handling
      jitsiApi.current.addEventListener("connectionFailed", () => {
        console.error("Jitsi connection failed");
        toast.error("Video call connection failed. Please try again.");
      });

      jitsiApi.current.addEventListener("conferenceError", (error) => {
        console.error("Jitsi conference error:", error);
        toast.error("Video conference error occurred.");
      });
    },
    [user] // Removed handleEndSession to break circular dependency
  );

  const fetchRoomDetails = useCallback(async () => {
    try {
      const response = await sessionsAPI.getRoomDetails(sessionId);
      setRoomDetails(response.data.room);

      // Check if session is in progress
      if (response.data.room.status === "in_progress") {
        setSessionStarted(true);
        // Don't auto-join if user hasn't explicitly joined
        // initializeJitsiMeet(response.data.room);
      }
    } catch (err) {
      console.error("Error fetching room details:", err);
      setError(err.response?.data?.error || "Failed to load room details");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchRoomDetails();

    // Load Jitsi Meet API
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (jitsiApi.current) {
        jitsiApi.current.dispose();
      }
      document.head.removeChild(script);
    };
  }, [fetchRoomDetails]);
  // Socket event listener for session ended by other user
  useEffect(() => {
    if (socket && isConnected) {
      const handleSessionEnded = (data) => {
        console.log("Session ended by other user:", data);
        sessionEndedByOther.current = true;
        setSessionEndingByOther(true); // Show notification about who ended the session
        const endedByText = data.endedBy === "teacher" ? "teacher" : "student";
        toast.success(`Session ended by the ${endedByText}. Disconnecting...`); // Auto-disconnect from video call and navigate away
        setTimeout(() => {
          if (handleEndSessionRef.current) {
            handleEndSessionRef.current(true);
          }
        }, 3000); // Give user 3 seconds to see the notification
      };
      const handleConnectionError = () => {
        console.warn("Socket connection lost, real-time features may not work");
        toast.error("Connection unstable - manual refresh may be needed");
      };

      socket.on("session:ended", handleSessionEnded);
      socket.on("disconnect", handleConnectionError);
      socket.on("connect_error", handleConnectionError);

      return () => {
        socket.off("session:ended", handleSessionEnded);
        socket.off("disconnect", handleConnectionError);
        socket.off("connect_error", handleConnectionError);
      };
    }
  }, [socket, isConnected]); // Removed handleEndSession dependency

  useEffect(() => {
    let interval;
    if (sessionStarted && roomDetails?.startedAt) {
      interval = setInterval(() => {
        const startTime = new Date(roomDetails.startedAt);
        const now = new Date();
        const duration = Math.floor((now - startTime) / 1000 / 60); // minutes
        setSessionDuration(duration);
      }, 60000); // Update every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionStarted, roomDetails?.startedAt]);
  const handleStartSession = async () => {
    try {
      setLoading(true);
      setIsJoining(true);
      const response = await sessionsAPI.startSession(sessionId);
      if (response.data.success) {
        setSessionStarted(true);
        setRoomDetails((prev) => ({
          ...prev,
          status: "in_progress",
          startedAt: new Date(),
        }));
        toast.success("Session started successfully!");

        // Initialize Jitsi after starting session
        setTimeout(() => {
          initializeJitsiMeet(response.data.session || roomDetails);
        }, 1000);
      }
    } catch (err) {
      console.error("Error starting session:", err);
      toast.error(err.response?.data?.error || "Failed to start session");
      setIsJoining(false);
    } finally {
      setLoading(false);
    }
  };
  const handleEndSession = useCallback(
    async (endedByOtherUser = false) => {
      // Prevent multiple end attempts
      if (loading || sessionEndingByOther) {
        console.log("Session ending already in progress");
        return;
      }

      // Check if session is already completed
      if (roomDetails?.status === "completed") {
        toast.success("Session is already completed");
        navigate("/sessions");
        return;
      }

      // If session was already ended by the other user, don't show confirmation
      const shouldConfirm = !endedByOtherUser && !sessionEndedByOther.current;

      if (
        shouldConfirm &&
        !window.confirm("Are you sure you want to end this session?")
      ) {
        return;
      }

      try {
        setLoading(true);

        // Dispose Jitsi first
        if (jitsiApi.current) {
          try {
            jitsiApi.current.dispose();
          } catch (disposeError) {
            console.warn("Error disposing Jitsi API:", disposeError);
          }
          jitsiApi.current = null;
        }

        // Reset join state
        setUserJoinedCall(false);
        setIsJoining(false);

        // Only call the API to end session if this user is ending it
        if (!endedByOtherUser && !sessionEndedByOther.current) {
          // Calculate actual duration
          const startTime = roomDetails?.startedAt
            ? new Date(roomDetails.startedAt)
            : new Date();
          const actualDuration = Math.floor((new Date() - startTime) / 60000);

          try {
            // Add timeout to API call to prevent hanging
            const endSessionPromise = sessionsAPI.endSession(sessionId, {
              actualDuration: actualDuration || 30, // minimum 30 minutes
            });

            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error("Request timeout")), 10000)
            );

            await Promise.race([endSessionPromise, timeoutPromise]);
            toast.success("Session ended successfully");
          } catch (apiError) {
            console.error("API Error ending session:", apiError);

            // Handle specific error cases
            if (apiError.response?.status === 400) {
              const errorMsg =
                apiError.response?.data?.error ||
                "Session may already be ended";
              console.log("Session already ended or invalid state:", errorMsg);
              toast.success("Session completed");
            } else if (apiError.message === "Request timeout") {
              toast.error(
                "Session end request timed out. Redirecting anyway..."
              );
            } else {
              toast.error("Failed to end session properly. Redirecting...");
            }
          }
        } else {
          // Session was ended by the other user
          toast.success("Session was ended by the other participant");
        }

        navigate("/sessions");
      } catch (err) {
        console.error("Error ending session:", err);
        // Still navigate even if there are issues
        setTimeout(() => navigate("/sessions"), 2000);
      } finally {
        setLoading(false);
      }
    },
    [
      roomDetails?.startedAt,
      roomDetails?.status,
      sessionId,
      navigate,
      loading,
      sessionEndingByOther,
    ]
  );

  // Update the ref whenever handleEndSession changes
  useEffect(() => {
    handleEndSessionRef.current = handleEndSession;
  }, [handleEndSession]);

  const toggleAudio = () => {
    if (jitsiApi.current) {
      jitsiApi.current.executeCommand("toggleAudio");
      setMediaEnabled((prev) => ({
        ...prev,
        audio: !prev.audio,
      }));
    }
  };

  const toggleVideo = () => {
    if (jitsiApi.current) {
      jitsiApi.current.executeCommand("toggleVideo");
      setMediaEnabled((prev) => ({
        ...prev,
        video: !prev.video,
      }));
    }
  };
  const handleJoinSession = () => {
    // Prevent multiple joins
    if (userJoinedCall || isJoining) {
      toast.success("You are already in the video call");
      return;
    }

    setIsJoining(true);

    if (roomDetails?.status === "confirmed") {
      handleStartSession();
    } else if (roomDetails?.status === "in_progress") {
      initializeJitsiMeet(roomDetails);
      setSessionStarted(true);
    }
  };
  if (loading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgPrimary
        )}
      >
        <div className="text-center">
          <LoadingSpinner />
          <p className={cn("mt-4", themeClasses.textPrimary)}>
            Loading session...
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          themeClasses.bgPrimary
        )}
      >
        <div
          className={cn(componentPatterns.modal, "max-w-md w-full mx-4 p-8")}
        >
          <h2 className={cn("text-xl font-semibold mb-4", themeClasses.error)}>
            Error
          </h2>
          <p className={cn("mb-4", themeClasses.textSecondary)}>{error}</p>
          <button
            onClick={() => navigate("/sessions")}
            className={cn("w-full", buttonVariants.primary)}
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={cn("min-h-screen", themeClasses.bgPrimary)}>
      {/* Header */}
      <div className={cn("p-4", themeClasses.bgSecondary)}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1
              className={cn("text-xl font-semibold", themeClasses.textPrimary)}
            >
              Video Session: {roomDetails?.skill || "Session"}
            </h1>{" "}
            <div
              className={cn(
                "flex items-center gap-2",
                sessionStarted && !sessionEndingByOther
                  ? themeClasses.success
                  : sessionEndingByOther
                  ? themeClasses.error
                  : "text-theme-warning"
              )}
            >
              {" "}
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  sessionStarted && !sessionEndingByOther
                    ? "bg-theme-success animate-pulse"
                    : sessionEndingByOther
                    ? "bg-theme-error animate-pulse"
                    : "bg-theme-warning"
                )}
              ></div>
              <span className="text-sm">
                {sessionEndingByOther
                  ? "Ending..."
                  : sessionStarted
                  ? "Live"
                  : roomDetails?.status === "confirmed"
                  ? "Ready to Start"
                  : "Waiting"}
              </span>
            </div>
            {sessionStarted && sessionDuration > 0 && (
              <div className="text-white text-sm">
                Duration: {sessionDuration}m
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-white text-sm">
              Room: {roomDetails?.roomId}
            </div>
            {/* Control buttons */}
            {sessionStarted && (
              <div className="flex items-center gap-2">
                {" "}
                <button
                  onClick={toggleAudio}
                  className={cn(
                    "p-2 rounded-lg",
                    mediaEnabled.audio
                      ? buttonVariants.primary
                      : buttonVariants.danger
                  )}
                  title={mediaEnabled.audio ? "Mute Audio" : "Unmute Audio"}
                >
                  <MicrophoneIcon
                    className={cn("w-5 h-5", themeClasses.textInverse)}
                  />
                </button>
                <button
                  onClick={toggleVideo}
                  className={cn(
                    "p-2 rounded-lg",
                    mediaEnabled.video
                      ? buttonVariants.primary
                      : buttonVariants.danger
                  )}
                  title={
                    mediaEnabled.video ? "Turn Off Video" : "Turn On Video"
                  }
                >
                  <VideoCameraIcon
                    className={cn("w-5 h-5", themeClasses.textInverse)}
                  />
                </button>
              </div>
            )}{" "}
            {((roomDetails?.status === "confirmed" && !sessionStarted) ||
              (roomDetails?.status === "in_progress" &&
                sessionStarted &&
                !userJoinedCall)) && (
              <button
                onClick={handleJoinSession}
                disabled={loading || isJoining}
                className={cn(buttonVariants.success, themeClasses.disabled)}
              >
                {loading || isJoining
                  ? "Joining..."
                  : sessionStarted
                  ? "Join Session"
                  : "Start Session"}
              </button>
            )}{" "}
            {sessionStarted && (
              <button
                onClick={() => handleEndSession(false)}
                disabled={loading || sessionEndingByOther}
                className={cn(buttonVariants.danger, themeClasses.disabled)}
              >
                {loading || sessionEndingByOther ? "Ending..." : "End Session"}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {" "}
          {/* Participants Info */}
          <div className={cn(themeClasses.bgSecondary, "rounded-lg p-4 mb-4")}>
            <h3
              className={cn(
                themeClasses.textPrimary,
                "text-lg font-medium mb-3"
              )}
            >
              Participants
            </h3>
            <div className="flex gap-6">
              <div
                className={cn(
                  "flex items-center gap-3",
                  themeClasses.textPrimary
                )}
              >
                <div
                  className={cn(
                    componentPatterns.avatar,
                    "w-10 h-10 bg-accent-primary"
                  )}
                >
                  {roomDetails?.participants?.teacher?.profilePicture ? (
                    <img
                      src={roomDetails.participants.teacher.profilePicture}
                      alt={roomDetails.participants.teacher.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {roomDetails?.participants?.teacher?.name?.charAt(0) ||
                        "T"}
                    </span>
                  )}
                </div>
                <div>
                  {" "}
                  <div className="font-medium">
                    {roomDetails?.participants?.teacher?.name || "Teacher"}
                    <span className={cn("ml-2", themeClasses.textAccent)}>
                      (Teacher)
                    </span>
                  </div>
                  <div className={cn("text-sm", themeClasses.textMuted)}>
                    Teaching: {roomDetails?.skill}
                  </div>
                </div>
              </div>{" "}
              <div
                className={cn(
                  "flex items-center gap-3",
                  themeClasses.textPrimary
                )}
              >
                <div
                  className={cn(
                    componentPatterns.avatar,
                    "w-10 h-10 bg-theme-success"
                  )}
                >
                  {roomDetails?.participants?.student?.profilePicture ? (
                    <img
                      src={roomDetails.participants.student.profilePicture}
                      alt={roomDetails.participants.student.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-medium">
                      {roomDetails?.participants?.student?.name?.charAt(0) ||
                        "S"}
                    </span>
                  )}
                </div>
                <div>
                  {" "}
                  <div className="font-medium">
                    {roomDetails?.participants?.student?.name || "Student"}
                    <span className={cn("ml-2", themeClasses.success)}>
                      (Student)
                    </span>
                  </div>
                  <div className={cn("text-sm", themeClasses.textMuted)}>
                    Learning: {roomDetails?.skill}
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Video Call Area */}
          <div
            className={cn(
              themeClasses.bgSecondary,
              "rounded-lg overflow-hidden"
            )}
          >
            {sessionStarted ? (
              <div
                ref={jitsiContainer}
                className="w-full"
                style={{ minHeight: "600px" }}
              />
            ) : (
              <div className="p-8 text-center">
                <div className={cn(themeClasses.textPrimary, "mb-6")}>
                  <VideoCameraIcon
                    className={cn(
                      "w-16 h-16 mx-auto mb-4",
                      themeClasses.textMuted
                    )}
                  />
                  <h2 className="text-2xl font-semibold mb-2">
                    Video Session Room
                  </h2>
                  <p className={cn("mb-4", themeClasses.textSecondary)}>
                    {roomDetails?.status === "confirmed"
                      ? 'Session is ready to start. Click "Start Session" to begin.'
                      : "Waiting for session to be confirmed."}
                  </p>
                </div>{" "}
                {((roomDetails?.status === "confirmed" && !sessionStarted) ||
                  (roomDetails?.status === "in_progress" &&
                    sessionStarted &&
                    !userJoinedCall)) && (
                  <div
                    className={cn(componentPatterns.card, "max-w-md mx-auto")}
                  >
                    <h3
                      className={cn(
                        themeClasses.textPrimary,
                        "text-lg font-medium mb-4"
                      )}
                    >
                      {roomDetails?.status === "confirmed"
                        ? "Ready to Start"
                        : "Session in Progress"}
                    </h3>
                    <div
                      className={cn(
                        "space-y-3 text-sm mb-6",
                        themeClasses.textSecondary
                      )}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        <span>Video & Audio conferencing</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <SpeakerWaveIcon className="w-4 h-4" />
                        <span>Screen sharing available</span>
                      </div>
                    </div>
                    <button
                      onClick={handleJoinSession}
                      disabled={loading || isJoining}
                      className={cn(
                        buttonVariants.success,
                        "w-full",
                        themeClasses.disabled
                      )}
                    >
                      {loading || isJoining
                        ? "Joining Session..."
                        : roomDetails?.status === "confirmed"
                        ? "Start Video Session"
                        : "Join Video Session"}
                    </button>
                  </div>
                )}{" "}
                {userJoinedCall && (
                  <div
                    className={cn(
                      statusClasses.successSecondary,
                      "rounded-lg p-6 max-w-md mx-auto"
                    )}
                  >
                    <h3
                      className={cn(
                        themeClasses.textPrimary,
                        "text-lg font-medium mb-4"
                      )}
                    >
                      ✅ You're in the call
                    </h3>
                    <p className={cn("text-sm", themeClasses.textSecondary)}>
                      You have successfully joined the video session. The video
                      interface should be visible above.
                    </p>
                  </div>
                )}
              </div>
            )}{" "}
          </div>
        </div>
      </div>{" "}
      {/* Session ending overlay */}
      {sessionEndingByOther && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div
            className={cn(
              componentPatterns.modal,
              "p-8 max-w-md w-full mx-4 text-center"
            )}
          >
            <div className={cn("mb-4", themeClasses.error)}>
              <PhoneXMarkIcon className="w-16 h-16 mx-auto" />
            </div>
            <h2
              className={cn(
                "text-xl font-semibold mb-2",
                themeClasses.textPrimary
              )}
            >
              Session Ended
            </h2>
            <p className={cn("mb-4", themeClasses.textSecondary)}>
              The other participant has ended the session. You will be
              disconnected shortly.
            </p>
            <div
              className={cn(
                "animate-spin h-8 w-8 border-4 border-t-transparent rounded-full mx-auto",
                themeClasses.borderAccent
              )}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
