// CommentAutomation.tsx
import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Added for animations
import { toast } from "sonner"; // Added for notifications
import axios from "axios";
import CommentAutomationForm from "./CommentAutomation/CommentAutomationForm";
import MobilePreview from "./CommentAutomation/MobilePreview";

const CommentAutomation: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>("");

  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [previewData, setPreviewData] = useState<{
    openingDM: string;
    linkDM: string;
    buttonLabel: string;
  }>({
    openingDM:
      "Hey there! I'm so happy you're here, thanks so much for your interest 😊 Click below and I'll send you the link in just a sec! 😊",
    linkDM: "",
    buttonLabel: "Send me the link",
  });

  // Base URL for backend API
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // Simulated user ID (replace with real auth in production)
  const userId = "temp-user-123"; // This should come from your auth system

  useEffect(() => {
    // Fetch user's Instagram account details and check connection
    const fetchUserAccount = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/instagram/account`,
          {
            params: { userId },
          }
        );
        if (response.data.username) {
          setUsername(response.data.username);
          setProfilePicture(response.data.profilePicture);
          setIsConnected(true);
        } else {
          setIsConnected(false);
          throw new Error("No username found");
        }
      } catch (error) {
        console.error("Error fetching Instagram account:", error);
        setIsConnected(false);
        toast.error(
          "No Instagram account connected. Please connect one first."
        );
        navigate("/connect-platform/instagram");
      }
    };

    fetchUserAccount();
  }, [navigate]);

  const handleBack = () => {
    navigate("/templates");
  };

  const handleUpdatePreview = (data: any) => {
    setPreviewData((prev) => ({
      ...prev,
      openingDM: data.openingDM || prev.openingDM,
      linkDM: data.linkDM || prev.linkDM,
      buttonLabel: data.buttonLabel || prev.buttonLabel,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative p-4 md:p-8">
      {/* Header with back button */}
      <div className="max-w-6xl mx-auto">
        <motion.button
          onClick={handleBack}
          className="absolute top-6 left-6 flex items-center text-gray-700 hover:text-blue-600 font-medium group transition-colors duration-200 z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Templates</span>
        </motion.button>

        <motion.div
          className="text-center pt-16 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Comment Automation
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Set up automated DMs for Instagram comments to engage your audience
            effortlessly.
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto">
        {isConnected === null ? (
          <motion.div
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : isConnected ? (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Form Section */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CommentAutomationForm
                  onBack={handleBack}
                  onUpdatePreview={handleUpdatePreview}
                />
              </div>
            </div>

            {/* Mobile Preview Section */}
            <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center items-start">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-md border border-gray-200 w-full">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Preview
                  </h3>
                  <p className="text-sm text-gray-600">
                    See how it will look on mobile
                  </p>
                </div>
                <MobilePreview
                  postImage="/api/placeholder/300/400" // Fallback image
                  username={username || "Your_Instagram"}
                  profilePicture={profilePicture}
                  openingDM={previewData.openingDM}
                  linkDM={previewData.linkDM}
                  buttonLabel={previewData.buttonLabel}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-600 text-lg mb-4">
              No Instagram account connected.
            </p>
            <button
              onClick={() => navigate("/connect-platform/instagram")}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-medium transition-all"
            >
              Connect Now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CommentAutomation;
