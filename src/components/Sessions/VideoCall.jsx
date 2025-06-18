import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { sessionsAPI } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import {
  MicrophoneIcon,
  VideoCameraIcon,
  PhoneXMarkIcon,
  ChatBubbleLeftRightIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

const VideoCall = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const jitsiContainer = useRef(null);
  const jitsiApi = useRef(null);

  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [mediaEnabled, setMediaEnabled] = useState({
    audio: true,
    video: true,
  });

  const fetchRoomDetails = useCallback(async () => {
    try {
      const response = await sessionsAPI.getRoomDetails(sessionId);
      setRoomDetails(response.data.room);

      // Check if session is in progress
      if (response.data.room.status === "in_progress") {
        setSessionStarted(true);
        initializeJitsiMeet(response.data.room);
      }
    } catch (err) {
      console.error("Error fetching room details:", err);
      setError(err.response?.data?.error || "Failed to load room details");
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const initializeJitsiMeet = useCallback(
    (room) => {
      if (!window.JitsiMeetExternalAPI || !jitsiContainer.current) {
        toast.error("Video conferencing not available");
        return;
      }

      const domain = "meet.jit.si"; // You can use your own Jitsi instance
      const options = {
        roomName: room.roomId,
        width: "100%",
        height: "600px",
        parentNode: jitsiContainer.current,
        userInfo: {
          displayName: user?.name || "Anonymous",
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
      });

      jitsiApi.current.addEventListener("videoConferenceLeft", () => {
        console.log("User left the conference");
        handleEndSession();
      });

      jitsiApi.current.addEventListener("participantJoined", (participant) => {
        console.log("Participant joined:", participant);
        toast.success(`${participant.displayName} joined the session`);
      });

      jitsiApi.current.addEventListener("participantLeft", (participant) => {
        console.log("Participant left:", participant);
        toast.info(`${participant.displayName} left the session`);
      });
    },
    [user, sessionId]
  );

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
    } finally {
      setLoading(false);
    }
  };
  const handleEndSession = async () => {
    if (window.confirm("Are you sure you want to end this session?")) {
      try {
        setLoading(true);

        // Dispose Jitsi first
        if (jitsiApi.current) {
          jitsiApi.current.dispose();
          jitsiApi.current = null;
        }

        // Calculate actual duration
        const startTime = roomDetails?.startedAt
          ? new Date(roomDetails.startedAt)
          : new Date();
        const actualDuration = Math.floor((new Date() - startTime) / 60000);

        await sessionsAPI.endSession(sessionId, {
          actualDuration: actualDuration || 30, // minimum 30 minutes
        });

        toast.success("Session ended successfully");
        navigate("/sessions");
      } catch (err) {
        console.error("Error ending session:", err);
        toast.error("Failed to end session");
      } finally {
        setLoading(false);
      }
    }
  };

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
    if (roomDetails?.status === "confirmed") {
      handleStartSession();
    } else if (roomDetails?.status === "in_progress") {
      initializeJitsiMeet(roomDetails);
      setSessionStarted(true);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-white mt-4">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate("/sessions")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-xl font-semibold">
              Video Session: {roomDetails?.skill || "Session"}
            </h1>
            <div
              className={`flex items-center gap-2 ${
                sessionStarted ? "text-green-400" : "text-yellow-400"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  sessionStarted
                    ? "bg-green-400 animate-pulse"
                    : "bg-yellow-400"
                }`}
              ></div>
              <span className="text-sm">
                {sessionStarted
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
                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-lg ${
                    mediaEnabled.audio
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  title={mediaEnabled.audio ? "Mute Audio" : "Unmute Audio"}
                >
                  <MicrophoneIcon className="w-5 h-5 text-white" />
                </button>

                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-lg ${
                    mediaEnabled.video
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  title={
                    mediaEnabled.video ? "Turn Off Video" : "Turn On Video"
                  }
                >
                  <VideoCameraIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            )}

            {roomDetails?.status === "confirmed" && !sessionStarted && (
              <button
                onClick={handleJoinSession}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Starting..." : "Start Session"}
              </button>
            )}

            {sessionStarted && (
              <button
                onClick={handleEndSession}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Ending..." : "End Session"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Participants Info */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4">
            <h3 className="text-white text-lg font-medium mb-3">
              Participants
            </h3>
            <div className="flex gap-6">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
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
                  <div className="font-medium">
                    {roomDetails?.participants?.teacher?.name || "Teacher"}
                    <span className="text-blue-400 ml-2">(Teacher)</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Teaching: {roomDetails?.skill}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
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
                  <div className="font-medium">
                    {roomDetails?.participants?.student?.name || "Student"}
                    <span className="text-green-400 ml-2">(Student)</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Learning: {roomDetails?.skill}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Call Area */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {sessionStarted ? (
              <div
                ref={jitsiContainer}
                className="w-full"
                style={{ minHeight: "600px" }}
              />
            ) : (
              <div className="p-8 text-center">
                <div className="text-white mb-6">
                  <VideoCameraIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h2 className="text-2xl font-semibold mb-2">
                    Video Session Room
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {roomDetails?.status === "confirmed"
                      ? 'Session is ready to start. Click "Start Session" to begin.'
                      : "Waiting for session to be confirmed."}
                  </p>
                </div>

                {roomDetails?.status === "confirmed" && (
                  <div className="bg-gray-700 rounded-lg p-6 max-w-md mx-auto">
                    <h3 className="text-white text-lg font-medium mb-4">
                      Ready to Start
                    </h3>
                    <div className="space-y-3 text-sm text-gray-300 mb-6">
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
                      disabled={loading}
                      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                    >
                      {loading ? "Starting Session..." : "Start Video Session"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
