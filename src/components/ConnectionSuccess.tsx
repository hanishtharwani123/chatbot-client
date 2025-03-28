// ConnectionSuccess.tsx
import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner"; // For error/success notifications
import axios from "axios"; // For API calls

const ConnectionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { platform } = useParams<{ platform: string }>();
  const [searchParams] = useSearchParams();
  const [username, setUsername] = useState<string>("your account");
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Base URL for backend API (configurable via environment variable)
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // Simulated user ID (replace with real auth in production)
  const userId = "temp-user-123"; // This should come from your auth system

  useEffect(() => {
    // Get username from URL params as initial value
    const usernameParam = searchParams.get("username");
    if (usernameParam) {
      setUsername(usernameParam);
    } else {
      toast.warning("No username provided in URL. Fetching from server...");
    }

    // Fetch account details from server
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/instagram/account`,
          {
            params: { userId }, // Pass userId to match server
          }
        );
        const { username: serverUsername, profilePicture } = response.data;
        setUsername(serverUsername || usernameParam || "your account");
        setProfilePicture(profilePicture || null);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Instagram account details:", error);
        toast.error(
          "Failed to fetch account details. Using URL-provided username."
        );
        setIsLoading(false);
      }
    };

    fetchAccountDetails();
  }, [searchParams]);

  const handleBack = () => {
    navigate(`/connect-platform/${platform}`);
  };

  const handleContinue = () => {
    navigate("/templates");
  };

  const capitalizedPlatform = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : "Platform";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative">
      {/* Back button fixed at top-left corner */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center text-gray-700 hover:text-gray-900 font-medium group"
      >
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      {/* Main content centered */}
      <div className="flex items-center justify-center min-h-screen p-4 md:p-8">
        <div className="max-w-2xl w-full">
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading account details...</p>
              </div>
            ) : (
              <>
                {/* Profile Picture or Checkmark */}
                <motion.div
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-6 overflow-hidden"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.2,
                  }}
                >
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt={`${username}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-100 flex items-center justify-center">
                      <FiCheckCircle className="text-green-500 text-5xl" />
                    </div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full"
                >
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    Congratulations!
                  </h1>
                  <h2 className="text-xl md:text-2xl font-medium text-gray-800 mb-4">
                    @{username} is connected!
                  </h2>

                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your {capitalizedPlatform} account is successfully
                    connected. You can now set up automated responses for your
                    audience.
                  </p>

                  <div className="flex justify-center gap-4">
                    <motion.button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all hover:shadow-md cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContinue}
                    >
                      Choose Template
                    </motion.button>
                    <motion.button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-8 rounded-lg font-medium transition-all hover:shadow-md cursor-pointer"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBack}
                    >
                      Connect Another
                    </motion.button>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionSuccess;
