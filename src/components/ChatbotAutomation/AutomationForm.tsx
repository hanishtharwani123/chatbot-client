import React, { useState } from "react";
import {
  Sparkles,
  Loader2,
  MessageSquare,
  Edit,
  FileText,
  CheckCircle,
} from "lucide-react";

interface BusinessInfo {
  task: string;
  context: string;
  firstMessage?: string;
}

interface AutomationFormProps {
  businessInfo: BusinessInfo;
  onInputChange: (updatedInfo: BusinessInfo) => void;
  onGenerate: (data: BusinessInfo) => Promise<void>;
  generatedData?: {
    goal: string;
    firstMessage: string;
    aiContent: string;
  };
  onPreviewChat: () => void;
}

const AutomationForm: React.FC<AutomationFormProps> = ({
  businessInfo,
  onInputChange,
  onGenerate,
  generatedData,
  onPreviewChat,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [formErrors, setFormErrors] = useState({ task: false, context: false });
  const [isEditingFirstMessage, setIsEditingFirstMessage] = useState(false);

  const handleTaskChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange({ ...businessInfo, task: e.target.value });
    setFormErrors({ ...formErrors, task: false });
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onInputChange({ ...businessInfo, context: e.target.value });
    setFormErrors({ ...formErrors, context: false });
  };

  const handleFirstMessageChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onInputChange({ ...businessInfo, firstMessage: e.target.value });
  };

  const handleGenerateClick = async () => {
    const errors = {
      task: !businessInfo.task.trim(),
      context: !businessInfo.context.trim(),
    };
    setFormErrors(errors);

    if (errors.task || errors.context) return;

    setIsGenerating(true);
    try {
      await onGenerate(businessInfo);
    } finally {
      setIsGenerating(false);
    }
  };

  const isGenerated = !!generatedData;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <MessageSquare className="mr-2 text-blue-600" size={24} />
        Chatbot Automation
      </h2>
      <p className="text-gray-600 mb-6 border-b pb-4">
        Configure your AI-powered chatbot to handle customer interactions
        automatically
      </p>

      {!isGenerated ? (
        <div className="space-y-6">
          <div className="relative">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <span className="bg-blue-600 text-white w-5 h-5 inline-flex items-center justify-center rounded-full mr-2 text-xs">
                1
              </span>
              Task for your chatbot
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              className={`w-full p-3 border ${
                formErrors.task ? "border-red-500 bg-red-50" : "border-gray-200"
              } rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              value={businessInfo.task}
              onChange={handleTaskChange}
              placeholder="e.g., Help customers book appointments, answer FAQs about our products"
            />
            {formErrors.task && (
              <p className="text-red-500 text-xs mt-1">
                Please enter a task for your chatbot
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Tell us what your chatbot should help with. Be specific for better
              results.
            </p>
          </div>

          <div className="relative">
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <span className="bg-blue-600 text-white w-5 h-5 inline-flex items-center justify-center rounded-full mr-2 text-xs">
                2
              </span>
              Business context
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              className={`w-full p-3 border ${
                formErrors.context
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              } rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
              value={businessInfo.context}
              onChange={handleContextChange}
              placeholder="e.g., We offer fitness coaching sessions via Zoom. Sessions are $50 for 30 minutes, $90 for 60 minutes. Available hours are 9am-5pm Monday-Friday."
            />
            {formErrors.context && (
              <p className="text-red-500 text-xs mt-1">
                Please provide context about your business
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Include important information about your products, services,
              pricing, hours, etc.
            </p>
          </div>

          <button
            onClick={handleGenerateClick}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating your chatbot...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Chatbot Automation
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
            <h3 className="font-medium text-blue-800 flex items-center">
              <CheckCircle size={16} className="mr-2" />
              Chatbot Generated Successfully
            </h3>
            <p className="text-sm text-blue-600 mt-1">
              Your AI chatbot is ready to preview. You can customize the first
              message below.
            </p>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="mr-2 text-gray-500" />
              Goal
            </label>
            <input
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 font-medium"
              value={generatedData?.goal || businessInfo.task}
              disabled
            />
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <MessageSquare size={16} className="mr-2 text-gray-500" />
                First Message
              </label>
              <button
                onClick={() => setIsEditingFirstMessage(!isEditingFirstMessage)}
                className="text-xs flex items-center text-blue-600 hover:text-blue-800"
              >
                <Edit size={14} className="mr-1" />
                {isEditingFirstMessage ? "Done" : "Edit"}
              </button>
            </div>
            <textarea
              className={`w-full p-3 border border-gray-200 rounded-lg min-h-[100px] ${
                isEditingFirstMessage
                  ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  : "bg-gray-50"
              }`}
              value={
                businessInfo.firstMessage || generatedData?.firstMessage || ""
              }
              onChange={handleFirstMessageChange}
              placeholder="Customize the first message to send"
              disabled={!isEditingFirstMessage}
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the first message users will see when they start a
              conversation.
            </p>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="mr-2 text-gray-500" />
              AI Knowledge Base
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg min-h-[120px] bg-gray-50"
              value={generatedData?.aiContent || ""}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the knowledge base your AI will use to generate responses.
            </p>
          </div>

          <button
            onClick={onPreviewChat}
            className="w-full bg-green-600 hover:bg-green-700  text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow"
          >
            <MessageSquare size={20} />
            Preview Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default AutomationForm;
