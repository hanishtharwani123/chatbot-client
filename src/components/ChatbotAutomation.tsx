import React, { useState } from "react";
import { FiArrowLeft, FiInstagram } from "react-icons/fi";
import { FaComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AutomationForm from "./ChatbotAutomation/AutomationForm";
import MobilePreview from "./ChatbotAutomation/MobilePreview";
import { toast } from "sonner"; // Added for notifications

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface BusinessInfo {
  task: string;
  context: string;
  firstMessage?: string;
}

const ChatbotAutomation: React.FC = () => {
  const navigate = useNavigate();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    task: "",
    context: "",
    firstMessage: "",
  });
  const [generatedData, setGeneratedData] = useState<{
    goal: string;
    firstMessage: string;
    aiContent: string;
  }>();
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [automationId, setAutomationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (updatedInfo: BusinessInfo) => {
    setBusinessInfo(updatedInfo);
  };

  const handleGenerate = async (data: BusinessInfo) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chatbot/generate`,
        data
      );
      const result = response.data;
      setGeneratedData({
        goal: data.task,
        firstMessage: result.firstMessage,
        aiContent: result.aiContent,
      });
      setBusinessInfo({ ...data, firstMessage: result.firstMessage });
    } catch (error) {
      console.error("Error generating chatbot:", error);
      toast("Failed to generate chatbot. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewChat = () => {
    setIsPreviewActive(true);
  };

  const handleContinue = async () => {
    if (!generatedData) return;

    setLoading(true);
    try {
      // Fetch existing automation to preserve non-AI fields
      let existingAutomation = {};
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/chatbot/automation`,
          {
            params: { userId: "temp-user-123" },
          }
        );
        existingAutomation = response.data.automation || {};
      } catch (error) {
        console.log("No existing automation found, creating new one:", error);
      }

      // Update only AI-related fields, preserving others
      const updatedAutomation = {
        userId: "temp-user-123",
        task: businessInfo.task,
        context: businessInfo.context,
        firstMessage: businessInfo.firstMessage || generatedData.firstMessage,
        aiContent: generatedData.aiContent,
        // Preserve existing fields if they exist, otherwise set defaults
        postType: existingAutomation.postType || "all",
        selectedPost: existingAutomation.postId || null,
        commentTrigger: existingAutomation.commentTrigger || "all",
        triggerWords: existingAutomation.triggerWords || null, // Keep as is (array or string)
        isLive: false,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/chatbot/automation`,
        updatedAutomation
      );
      setAutomationId(response.data.id);
      setShowPopup(true);
    } catch (error) {
      console.error("Error saving/updating chatbot automation:", error);
      toast("Failed to save chatbot automation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerSelect = (trigger: string) => {
    setShowPopup(false);
    if (trigger === "comments" && automationId) {
      navigate(`/instagram-comment-trigger/${automationId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/templates")}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back to Templates
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <FiInstagram className="text-pink-600 mr-2" /> Instagram Chatbot
            </h1>
            <div>
              <button
                onClick={handleContinue}
                disabled={!generatedData || loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="order-2 lg:order-1">
            <AutomationForm
              businessInfo={businessInfo}
              onInputChange={handleInputChange}
              onGenerate={handleGenerate}
              generatedData={generatedData}
              onPreviewChat={handlePreviewChat}
            />
          </div>
          <div className="order-1 lg:order-2 h-[700px]">
            <MobilePreview
              businessInfo={businessInfo}
              generatedData={generatedData}
              isPreviewActive={isPreviewActive}
            />
          </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black/85 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Start Automation When...
            </h2>
            <p className="text-gray-600 mb-6">
              Select a trigger to start your Instagram automation.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleTriggerSelect("comments")}
                className="w-full flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all shadow-md"
              >
                <FaComment className="text-blue-600 mr-3" size={20} />
                <div className="text-left">
                  <span className="font-semibold text-gray-800">
                    Post or Reel Comments
                  </span>
                  <p className="text-sm text-gray-600">
                    User comments on your Post or Reel
                  </p>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-6 text-gray-600 hover:text-gray-800 w-full text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotAutomation;
