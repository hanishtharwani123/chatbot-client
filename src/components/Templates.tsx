import React, { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion"; // Added for animations
import axios from "axios"; // For server calls

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  onClick: (id: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  id,
  title,
  description,
  icon,
  available,
  onClick,
}) => {
  return (
    <motion.div
      className={`bg-white border border-gray-100 p-6 rounded-xl shadow-sm transition-all
        ${
          available
            ? "cursor-pointer hover:shadow-md hover:border-blue-200"
            : "opacity-60 cursor-not-allowed"
        }`}
      onClick={() => available && onClick(id)}
      whileHover={available ? { scale: 1.02 } : {}}
      whileTap={available ? { scale: 0.98 } : {}}
    >
      <div className="flex items-center mb-4">
        <div className="text-blue-500 mr-3 text-2xl">{icon}</div>
        <h3 className="font-semibold text-lg">{title}</h3>
        {!available && (
          <span className="ml-auto text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
            Coming Soon
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </motion.div>
  );
};

const Templates: React.FC = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  // Base URL for backend API
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; // Simulated user ID (replace with real auth in production)
  const userId = "temp-user-123"; // This should come from your auth system

  useEffect(() => {
    // Check if Instagram is connected
    const checkConnection = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/instagram/account`,
          {
            params: { userId },
          }
        );
        console.log("Instagram connection response:", response.data);
        if (response.data.username) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Error checking Instagram connection:", error);
        setIsConnected(false);

        navigate("/connect-platform/instagram");
      }
    };

    checkConnection();
  }, [navigate]);

  const templates = [
    {
      id: "auto-dm-links",
      title: "Auto DM Links",
      description:
        "Automatically send personalized DMs with links to users who comment on your posts.",
      icon: "💬",
      available: true,
    },
    {
      id: "comment-automation",
      title: "Automate conversations with AI",
      description:
        "Automatically respond to comments with AI-generated replies based on content.",
      icon: "🤖",
      available: true, // Changed to true to make it available
    },
    {
      id: "follower-engagement",
      title: "Follower Engagement",
      description:
        "Engage followers with personalized messages and interactions automatically.",
      icon: "👥",
      available: false,
    },
    {
      id: "content-curation",
      title: "Content Curation",
      description:
        "Curate and recommend content to followers based on their interests.",
      icon: "📚",
      available: false,
    },
  ];

  const handleSelectTemplate = (templateId: string) => {
    if (!isConnected) {
      toast.error("Please connect an Instagram account first.");
      navigate("/connect-platform/instagram");
      return;
    }

    if (templateId === "auto-dm-links") {
      navigate("/comment-automation");
    } else if (templateId === "comment-automation") {
      // Added new condition for the comment automation template
      navigate("/chatbot-automation");
    } else {
      toast.info("This template is coming soon!");
    }
  };

  const handleBack = () => {
    navigate("/select-platform");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white relative p-4 md:p-8">
      {/* Back button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 flex items-center text-gray-700 hover:text-gray-900 font-medium group"
      >
        <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
        <span>Back</span>
      </button>

      <div className="max-w-4xl mx-auto pt-16">
        <div className="text-center mb-12">
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Choose a Template
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Select a template to start automating your Instagram engagement.
          </motion.p>
        </div>

        {isConnected === null ? (
          <div className="flex justify-center items-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : isConnected ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                id={template.id}
                title={template.title}
                description={template.description}
                icon={template.icon}
                available={template.available}
                onClick={handleSelectTemplate}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center">
            <p className="text-red-600 text-lg">
              No Instagram account connected.
            </p>
            <button
              onClick={() => navigate("/connect-platform/instagram")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg font-medium transition-all"
            >
              Connect Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Templates;
