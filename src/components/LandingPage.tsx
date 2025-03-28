// LandingPage.tsx
import React from "react";
import { RiRobot2Fill } from "react-icons/ri";
import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateChatbot = () => {
    navigate("/select-platform");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center px-4 py-12 md:py-20">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          AI Chatbot — Automate Conversations, Boost Engagement
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-2xl mx-auto">
          The InflowChat AI Chatbot is a powerful automation tool designed to
          help businesses and creators streamline interactions with their
          audience.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
          <div className="relative">
            {/* Animated cogs in background */}
            <div className="absolute -z-10 opacity-10">
              <FaCog className="w-12 h-12 absolute -top-4 -left-8 text-blue-400 animate-spin-slow" />
              <FaCog className="w-8 h-8 absolute top-12 -right-6 text-blue-300 animate-spin-slow-reverse" />
              <FaCog className="w-10 h-10 absolute bottom-0 -left-4 text-blue-500 animate-spin-slow" />
            </div>

            {/* Robot illustration */}
            <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full bg-blue-100 opacity-50"></div>
              <div className="relative z-20">
                <RiRobot2Fill className="w-24 h-24 md:w-32 md:h-32 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Mobile phone mockup */}
          <div className="relative w-64 h-96 border-4 border-gray-700 rounded-3xl bg-white shadow-lg overflow-hidden">
            <div className="absolute top-0 w-full h-6 bg-gray-700 flex justify-center items-center">
              <div className="w-16 h-1 bg-gray-500 rounded-full"></div>
            </div>

            <div className="p-2 pt-8">
              <div className="flex items-center p-2 border-b border-gray-200">
                <div className="text-sm text-gray-500">Chat</div>
                <div className="ml-auto">⋮</div>
              </div>

              <div className="overflow-y-auto h-72">
                {/* Chat bubbles */}
                <div className="flex justify-end mb-2 mt-2">
                  <div className="bg-gray-100 rounded-lg p-2 max-w-xs">
                    <p className="text-xs">
                      Hi there! How can I help you today?
                    </p>
                  </div>
                </div>

                <div className="flex mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 mr-2"></div>
                  <div className="bg-blue-50 rounded-lg p-2 max-w-xs">
                    <p className="text-xs">
                      I'm looking for information about your services.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mb-2">
                  <div className="bg-blue-500 text-white rounded-lg p-2 max-w-xs">
                    <p className="text-xs">
                      I'd be happy to tell you about our services! We offer...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateChatbot}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg 
          transition-all transform hover:scale-105 shadow-md flex items-center justify-center mx-auto cursor-pointer"
        >
          <span className="mr-2">Create New Chatbot</span>
          <span className="text-xl">+</span>
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
