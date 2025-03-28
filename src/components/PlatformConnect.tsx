import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiLink } from "react-icons/fi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaFacebookMessenger,
  FaWhatsapp,
  FaTiktok,
} from "react-icons/fa";
import axios from "axios";

const PlatformConnect: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { platform } = useParams<{ platform: string }>();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const userId = "temp-user-123"; // Replace with real auth system

  useEffect(() => {
    const integration = searchParams.get("integration");
    const reason = searchParams.get("reason");
    const username = searchParams.get("username");

    if (integration === "success" && username) {
      navigate(`/success/${platform}?username=${username}`);
    } else if (integration === "failed") {
      const errorMessage = reason
        ? `Connection failed: ${reason.replace(/_/g, " ")}`
        : "Connection failed. Please try again.";
      setError(errorMessage);
    }
  }, [searchParams, navigate, platform]);

  const handleConnectPlatform = async () => {
    if (platform?.toLowerCase() !== "instagram") {
      toast.error("Only Instagram integration is currently supported.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const connectUrl = `${API_BASE_URL}/api/instagram/connect?userId=${userId}`;
      console.log(`Initiating Instagram connection: ${connectUrl}`);
      window.location.href = connectUrl;
    } catch (error) {
      console.error("Error initiating Instagram connection:", error);
      const errorMessage =
        "Failed to start Instagram connection. Please try again.";
      setError(errorMessage);
      setIsConnecting(false);
      navigate("/templates");
    }
  };

  const handleBack = () => {
    navigate("/select-platform");
  };

  const getPlatformInfo = () => {
    switch (platform?.toLowerCase()) {
      case "instagram":
        return {
          icon: <FaInstagram className="text-4xl sm:text-5xl md:text-6xl" />,
          color: "from-pink-500 to-purple-700",
          textColor: "text-pink-600",
        };
      case "linkedin":
        return {
          icon: <FaLinkedin className="text-4xl sm:text-5xl md:text-6xl" />,
          color: "from-blue-600 to-blue-800",
          textColor: "text-blue-700",
        };
      case "telegram":
        return {
          icon: <FaTelegram className="text-4xl sm:text-5xl md:text-6xl" />,
          color: "from-blue-400 to-blue-600",
          textColor: "text-blue-500",
        };
      case "facebook":
        return {
          icon: (
            <FaFacebookMessenger className="text-4xl sm:text-5xl md:text-6xl" />
          ),
          color: "from-blue-500 to-blue-700",
          textColor: "text-blue-600",
        };
      case "whatsapp":
        return {
          icon: <FaWhatsapp className="text-4xl sm:text-5xl md:text-6xl" />,
          color: "from-green-500 to-green-700",
          textColor: "text-green-500",
        };
      case "tiktok":
        return {
          icon: <FaTiktok className="text-4xl sm:text-5xl md:text-6xl" />,
          color: "from-gray-800 to-black",
          textColor: "text-black",
        };
      default:
        return {
          icon: <FiLink className="text-4xl sm:text-5xl md:text-6xl" />,
          color: "from-blue-500 to-blue-700",
          textColor: "text-blue-500",
        };
    }
  };

  const { icon, color, textColor } = getPlatformInfo();
  const capitalizedPlatform = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : "Platform";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 sm:p-6 md:p-8">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 flex items-center text-gray-700 hover:text-gray-900 font-medium group transition-colors z-10 text-sm sm:text-base"
      >
        <FiArrowLeft className="mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="max-w-3xl mx-auto pt-12 sm:pt-16 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          {/* Top Banner */}
          <div
            className={`w-full h-24 sm:h-28 md:h-32 bg-gradient-to-r ${color} flex items-center justify-center relative`}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] sm:[background-size:20px_20px]"></div>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-full">
              <div className={textColor}>{icon}</div>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center px-4 sm:px-6 md:px-12 py-6 sm:py-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
              Connect Your {capitalizedPlatform} Account
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md mx-auto">
              Link your {capitalizedPlatform} account to enable automated
              responses to your comments and messages.
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 sm:py-3 rounded-lg mb-6 sm:mb-8 text-sm sm:text-base">
                {error}
              </div>
            )}

            <button
              onClick={handleConnectPlatform}
              disabled={isConnecting}
              className={`
                ${
                  isConnecting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-500 cursor-pointer hover:bg-blue-600"
                } 
                text-white py-2 sm:py-3 px-6 sm:px-8 rounded-lg font-medium transition-all hover:shadow-lg
                flex items-center justify-center mx-auto text-sm sm:text-base
              `}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 sm:mr-3"></div>
                  Connecting...
                </>
              ) : (
                `Connect ${capitalizedPlatform}`
              )}
            </button>
          </div>

          {/* Permissions Section */}
          <div className="bg-gray-50 border-t border-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-md mx-auto">
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-base sm:text-lg">
                Why do we need these permissions?
              </h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                To enable automated responses to comments on your{" "}
                {capitalizedPlatform} account, we need permission to:
              </p>
              <ul className="space-y-2 mb-3 sm:mb-4 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span className="text-gray-700">
                    Access your basic account information
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span className="text-gray-700">
                    Read comments on your posts
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span className="text-gray-700">
                    Send DMs to people who comment on your posts
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">✓</span>
                  <span className="text-gray-700">
                    Manage automated messaging
                  </span>
                </li>
              </ul>
              <p className="text-xs sm:text-sm text-gray-500 italic">
                We never post without your explicit permission. You can revoke
                access at any time from your {capitalizedPlatform} settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformConnect;
