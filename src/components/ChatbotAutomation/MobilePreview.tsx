import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Message {
  text: string;
  isUser: boolean;
}

interface MobilePreviewProps {
  businessInfo: {
    task: string;
    context: string;
    firstMessage?: string;
  };
  generatedData?: {
    goal: string;
    firstMessage: string;
    aiContent: string;
  };
  isPreviewActive: boolean;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({
  businessInfo,
  generatedData,
  isPreviewActive,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPreviewActive && messages.length === 0) {
      const openingMessage =
        businessInfo.firstMessage || generatedData?.firstMessage;
      if (openingMessage) {
        setMessages([{ text: openingMessage, isUser: false }]);
      }
    }
  }, [isPreviewActive, businessInfo.firstMessage, generatedData]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { text: userInput, isUser: true }];
    setMessages(newMessages);
    setUserInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chatbot/preview-response`,
        {
          context: businessInfo.context,
          task: businessInfo.task,
          message: userInput,
        }
      );
      setMessages((prev) => [
        ...prev,
        { text: response.data.aiResponse, isUser: false },
      ]);
    } catch (error) {
      console.error("Error generating preview response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, something went wrong! Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-xl p-6 flex justify-center items-center h-full">
      <div className="relative w-[320px] h-[640px] bg-gray-900 rounded-[50px] shadow-2xl overflow-hidden border-[10px] border-gray-800">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-gray-900 rounded-b-xl z-10"></div>
        <div className="absolute inset-0 bg-white rounded-[40px] overflow-hidden flex flex-col">
          <div className="h-6 bg-gray-900 flex items-center justify-between px-6 text-white text-xs">
            <span>9:41</span>
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-white rounded-sm"></div>
              <div className="w-1 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-1 bg-white rounded-sm"></div>
              <div className="w-3 h-3 ml-1 rounded-sm border border-white flex items-center justify-center">
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="bg-blue-600 text-white p-3 flex items-center shadow-md">
            <div className="w-8 h-8 rounded-full bg-white/20 mr-3 flex items-center justify-center">
              <span className="text-sm font-bold">AI</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">Business Assistant</span>
              <span className="text-xs text-blue-100">Online</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            {!isPreviewActive ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 px-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 flex items-center justify-center">
                  <Send size={24} className="text-gray-400" />
                </div>
                <p className="font-medium">Chat Preview</p>
                <p className="text-xs mt-2">
                  Click "Preview Chat" to see your automated responses in action
                </p>
              </div>
            ) : (
              <>
                <div
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                >
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`max-w-[80%] p-3 rounded-2xl shadow-sm ${
                        msg.isUser
                          ? "bg-blue-600 text-white ml-auto rounded-tr-none"
                          : "bg-white text-gray-800 mr-auto rounded-tl-none border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className="text-right mt-1">
                        <span
                          className={`text-[10px] ${
                            msg.isUser ? "text-blue-100" : "text-gray-400"
                          }`}
                        >
                          now
                        </span>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="max-w-[80%] p-3 rounded-2xl bg-white mr-auto rounded-tl-none border border-gray-200 flex items-center gap-1 shadow-sm">
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "-0.3s" }}
                      ></span>
                      <span
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "-0.15s" }}
                      ></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    </div>
                  )}
                </div>
                <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2 sticky bottom-0">
                  <input
                    className="flex-1 p-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm shadow-sm"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !userInput.trim()}
                    className={`${
                      userInput.trim()
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-300"
                    } text-white p-2 rounded-full disabled:opacity-50 shadow-md transition-colors`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gray-800 rounded-full z-20"></div>
        <div className="absolute right-[-10px] top-32 w-2 h-10 bg-gray-700 rounded-l-md"></div>
        <div className="absolute left-[-10px] top-24 w-2 h-8 bg-gray-700 rounded-r-md"></div>
        <div className="absolute left-[-10px] top-36 w-2 h-8 bg-gray-700 rounded-r-md"></div>
      </div>
    </div>
  );
};

export default MobilePreview;
