import React, { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import {
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaTwitter,
  FaFacebook,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

interface PlatformCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
  onClick: () => void;
  isConnected?: boolean;
  iconColor: string;
  available?: boolean;
}

const PlatformCard: React.FC<PlatformCardProps> = ({
  icon,
  name,
  description,
  onClick,
  isConnected = false,
  iconColor,
  available = false,
}) => {
  return (
    <motion.div
      className={`bg-white p-4 md:p-6 rounded-xl shadow-sm border flex flex-col cursor-pointer relative
        ${
          isConnected
            ? "bg-green-50 border-green-200"
            : available
            ? "hover:bg-blue-50 hover:shadow-md hover:border-blue-200 border-gray-100"
            : "hover:bg-gray-50 hover:shadow-sm border-gray-100 opacity-75"
        }`}
      onClick={onClick}
      whileHover={{ scale: available ? 1.02 : 1 }}
      whileTap={{ scale: available ? 0.98 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative flex justify-center mb-3 md:mb-4">
        <div
          className={`text-3xl md:text-4xl flex items-center justify-center ${iconColor}`}
        >
          {icon}
        </div>
      </div>
      <h3 className="font-semibold text-lg md:text-xl mb-1 md:mb-2 text-center">
        {name}
      </h3>
      <p className="text-gray-600 text-xs md:text-sm text-center">
        {description}
      </p>

      {isConnected && (
        <div className="mt-3 flex justify-center">
          <span className="inline-flex items-center bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
            Connected
          </span>
        </div>
      )}

      {!available && !isConnected && (
        <div className="absolute top-0 right-0 bg-gray-600 text-white text-xs font-medium px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
          Coming Soon
        </div>
      )}
    </motion.div>
  );
};

const PlatformSelection: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean | null>(null); // Fixed typo
  const [loading, setLoading] = useState<boolean>(true);
  const [hasShownToast, setHasShownToast] = useState<boolean>(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const userId = "temp-user-123"; // Replace with real auth system

  // Check Instagram connection status
  useEffect(() => {
    const checkInstagramConnection = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/api/instagram/account`,
          { params: { userId } }
        );
        const isInstagramConnected = !!response.data.username;
        setIsConnected(isInstagramConnected);

        // Show toast only once when connected and toast hasn't been shown
        if (isInstagramConnected && !hasShownToast) {
          // toast.success("Instagram already connected! Proceed to templates.");
          setHasShownToast(true); // Prevent future toasts
        }
      } catch (error) {
        console.error("Error checking Instagram connection:", error);
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkInstagramConnection();
  }, [hasShownToast]); // Depend only on hasShownToast

  const handlePlatformSelect = (platformName: string, available: boolean) => {
    if (!available) {
      toast.info(`${platformName} integration coming soon!`);
      return;
    }

    if (platformName === "Instagram") {
      if (isConnected) {
        navigate("/templates");
      } else {
        navigate("/connect-platform/instagram");
      }
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const platforms = [
    {
      name: "Instagram",
      icon: <FaInstagram />,
      description: "Automate responses to comments and DMs on Instagram",
      available: true,
      iconColor: "text-pink-600",
    },
    {
      name: "LinkedIn",
      icon: <FaLinkedin />,
      description:
        "Connect your professional network with automated engagement",
      available: false,
      iconColor: "text-blue-700",
    },
    {
      name: "WhatsApp",
      icon: <FaWhatsapp />,
      description:
        "Create automated responses for your WhatsApp Business account",
      available: false,
      iconColor: "text-green-600",
    },
    {
      name: "Telegram",
      icon: <FaTelegram />,
      description: "Build a Telegram bot that responds to your community",
      available: false,
      iconColor: "text-blue-500",
    },
    {
      name: "Twitter",
      icon: <FaTwitter />,
      description: "Automate engagement on your Twitter/X profile",
      available: false,
      iconColor: "text-blue-400",
    },
    {
      name: "Facebook",
      icon: <FaFacebook />,
      description: "Manage Facebook page comments and messages automatically",
      available: false,
      iconColor: "text-blue-600",
    },
    {
      name: "TikTok",
      icon: <FaTiktok />,
      description: "Respond to TikTok comments with your custom AI",
      available: false,
      iconColor: "text-black",
    },
    {
      name: "YouTube",
      icon: <FaYoutube />,
      description:
        "Engage with your YouTube audience through automated responses",
      available: false,
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative p-4 md:p-8">
      <motion.button
        onClick={handleBack}
        className="absolute top-4 md:top-6 left-4 md:left-6 flex items-center text-gray-700 hover:text-blue-600 font-medium group transition-colors duration-200 z-10 text-sm md:text-base"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FiArrowLeft className="mr-1 md:mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Back to Home</span>
      </motion.button>

      <div className="max-w-6xl mx-auto pt-12 md:pt-16">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">
            Connect Your Platforms
          </h1>
          <p className="text-gray-600 text-sm md:text-lg max-w-2xl mx-auto px-4">
            Link your social media accounts to start automating your chatbot.
            Currently only Instagram is available.
          </p>
        </motion.div>

        {loading ? (
          <motion.div
            className="flex justify-center items-center h-40 md:h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        ) : (
          <motion.div
            className="mt-4 md:mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="max-w-sm mx-auto mb-8">
              <PlatformCard
                icon={<FaInstagram />}
                name="Instagram"
                description="Revolutionize your social media game with Instagram automation"
                onClick={() => handlePlatformSelect("Instagram", true)}
                isConnected={isConnected || false}
                iconColor="text-pink-600"
                available={true}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-4xl mx-auto">
              {platforms.slice(1).map((platform) => (
                <PlatformCard
                  key={platform.name}
                  icon={platform.icon}
                  name={platform.name}
                  description={platform.description}
                  onClick={() =>
                    handlePlatformSelect(platform.name, platform.available)
                  }
                  isConnected={false}
                  iconColor={platform.iconColor}
                  available={platform.available}
                />
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          className="text-center mt-8 md:mt-12 text-gray-500 text-xs md:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p>
            We're constantly working on adding more platforms to enhance your
            automation experience.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PlatformSelection;
