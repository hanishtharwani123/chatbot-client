// App.tsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import PlatformSelection from "./components/PlatformSelection";
import PlatformConnect from "./components/PlatformConnect";
import ConnectionSuccess from "./components/ConnectionSuccess";
import Templates from "./components/Templates";
import CommentAutomation from "./components/CommentAutomation";
import ChatbotAutomation from "./components/ChatbotAutomation";
import ChatbotPostSelection from "./components/ChatbotPostSelection";
import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* Global toast notifications */}
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/select-platform" element={<PlatformSelection />} />
        <Route
          path="/connect-platform/:platform"
          element={<PlatformConnect />}
        />
        <Route path="/success/:platform" element={<ConnectionSuccess />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/comment-automation" element={<CommentAutomation />} />
        <Route path="/chatbot-automation" element={<ChatbotAutomation />} />
        <Route
          path="/instagram-comment-trigger/:automationId"
          element={<ChatbotPostSelection />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
