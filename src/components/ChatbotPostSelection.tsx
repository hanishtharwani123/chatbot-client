import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiInstagram,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
  FiPlay,
  FiSettings,
  FiImage,
  FiTrash2,
  FiPauseCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner"; // Added for notifications

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Post {
  id: string;
  caption?: string;
  media_url: string;
  media_type: string;
  timestamp: string;
}

const InstagramCommentTrigger: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [postSelectionMode, setPostSelectionMode] = useState<
    "all" | "specific"
  >("all");
  const [commentTriggerMode, setCommentTriggerMode] = useState<
    "any" | "keyword"
  >("any");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch posts and existing automation data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const postsResponse = await axios.get(
          `${API_BASE_URL}/api/chatbot/posts`,
          {
            params: { userId: "temp-user-123" },
          }
        );
        setPosts(postsResponse.data.posts);

        const automationResponse = await axios.get(
          `${API_BASE_URL}/api/chatbot/automation`,
          {
            params: { userId: "temp-user-123" },
          }
        );
        const { postType, postId, commentTrigger, triggerWords, isLive } =
          automationResponse.data.automation;

        setPostSelectionMode(postType || "all");
        setCommentTriggerMode(commentTrigger || "any");
        setKeywords(
          Array.isArray(triggerWords)
            ? triggerWords
            : triggerWords
            ? triggerWords.split(",").map((w: string) => w.trim())
            : []
        );
        setIsLive(isLive || false);

        if (postId) {
          const selected = postsResponse.data.posts.find(
            (p: Post) => p.id === postId
          );
          setSelectedPost(selected || null);
        }
      } catch (error) {
        console.log(
          "No existing automation or posts found, or error fetching:",
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleSaveOrUpdate = async () => {
    setLoading(true);
    try {
      const automationResponse = await axios.get(
        `${API_BASE_URL}/api/chatbot/automation`,
        {
          params: { userId: "temp-user-123" },
        }
      );
      const { task, context, firstMessage, aiContent } =
        automationResponse.data.automation;

      const updatedAutomation = {
        userId: "temp-user-123",
        task,
        context,
        firstMessage,
        aiContent,
        postType: postSelectionMode,
        selectedPost:
          postSelectionMode === "specific" ? selectedPost?.id : null,
        commentTrigger: commentTriggerMode,
        triggerWords:
          commentTriggerMode === "keyword" ? keywords.join(",") : null,
        isLive,
      };

      await axios.post(
        `${API_BASE_URL}/api/chatbot/automation`,
        updatedAutomation
      );
      toast("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving/updating automation:", error);
      toast("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoLive = async () => {
    setLoading(true);
    try {
      const automationResponse = await axios.get(
        `${API_BASE_URL}/api/chatbot/automation`,
        {
          params: { userId: "temp-user-123" },
        }
      );
      const { task, context, firstMessage, aiContent } =
        automationResponse.data.automation;

      const updatedAutomation = {
        userId: "temp-user-123",
        task,
        context,
        firstMessage,
        aiContent,
        postType: postSelectionMode,
        selectedPost:
          postSelectionMode === "specific" ? selectedPost?.id : null,
        commentTrigger: commentTriggerMode,
        triggerWords:
          commentTriggerMode === "keyword" ? keywords.join(",") : null,
        isLive: !isLive, // Toggle live status
      };

      await axios.post(
        `${API_BASE_URL}/api/chatbot/automation`,
        updatedAutomation
      );
      setIsLive(!isLive);
      toast(isLive ? "Automation paused!" : "Automation is now live!");
    } catch (error) {
      console.error("Error toggling live status:", error);
      toast("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-4 md:p-8 flex flex-col">
      {/* Header */}
      <header className="bg-white rounded-2xl shadow-lg border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center text-gray-600 hover:text-indigo-600 transition-all duration-300 ease-in-out"
            >
              <FiArrowLeft
                size={24}
                className="mr-2 group-hover:-translate-x-1 transition-transform duration-300"
              />
              <span className="font-medium text-base">Back</span>
            </button>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <FiInstagram className="text-pink-600 mr-3" size={28} />
              Instagram Comment Automation
            </h1>

            <div className="flex gap-3">
              <button
                onClick={handleSaveOrUpdate}
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-300 flex items-center shadow-md disabled:opacity-50"
              >
                <FiSettings className="mr-2" size={18} />
                {loading ? "Saving..." : "Save Settings"}
              </button>
              <button
                onClick={handleGoLive}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white flex items-center shadow-md transition-all duration-300 ${
                  isLive
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                } disabled:opacity-50`}
              >
                {isLive ? (
                  <>
                    <FiPauseCircle className="mr-2" size={18} />
                    Pause
                  </>
                ) : (
                  <>
                    <FiPlay className="mr-2" size={18} />
                    Go Live
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Automation Settings */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
          {/* Post Selection */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center border-b pb-3 border-gray-200">
              <FiImage className="mr-3 text-indigo-600" size={24} />
              Post Selection
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setPostSelectionMode("all");
                  setSelectedPost(null);
                }}
                className={`p-5 rounded-xl transition-all duration-300 flex flex-col items-center justify-center shadow-md ${
                  postSelectionMode === "all"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="font-semibold mb-2 text-lg">
                  All Posts & Reels
                </span>
                <p className="text-sm text-center opacity-70">
                  Trigger automation on all Instagram content
                </p>
              </button>
              <button
                onClick={() => setPostSelectionMode("specific")}
                className={`p-5 rounded-xl transition-all duration-300 flex flex-col items-center justify-center shadow-md ${
                  postSelectionMode === "specific"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="font-semibold mb-2 text-lg">
                  Specific Post
                </span>
                <p className="text-sm text-center opacity-70">
                  Target a single Instagram post
                </p>
              </button>
            </div>

            {postSelectionMode === "specific" && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 group ${
                      selectedPost?.id === post.id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-transparent hover:border-indigo-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="relative mb-4 overflow-hidden rounded-lg">
                      <img
                        src={post.media_url}
                        alt={post.caption || "Instagram post"}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <p className="text-sm font-medium truncate mb-1">
                      {post.caption || "No caption"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Comment Trigger */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center border-b pb-3 border-gray-200">
              <FiSettings className="mr-3 text-indigo-600" size={24} />
              Comment Trigger
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <button
                onClick={() => {
                  setCommentTriggerMode("any");
                  setKeywords([]);
                }}
                className={`p-5 rounded-xl transition-all duration-300 flex flex-col items-center justify-center shadow-md ${
                  commentTriggerMode === "any"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="font-semibold mb-2 text-lg">Any Comment</span>
                <p className="text-sm text-center opacity-70">
                  Respond to all incoming comments
                </p>
              </button>
              <button
                onClick={() => setCommentTriggerMode("keyword")}
                className={`p-5 rounded-xl transition-all duration-300 flex flex-col items-center justify-center shadow-md ${
                  commentTriggerMode === "keyword"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="font-semibold mb-2 text-lg">
                  Keyword Trigger
                </span>
                <p className="text-sm text-center opacity-70">
                  Respond only to specific keywords
                </p>
              </button>
            </div>

            {commentTriggerMode === "keyword" && (
              <div className="mt-8">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add trigger keyword"
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                  />
                  <button
                    onClick={handleAddKeyword}
                    className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-all duration-300"
                  >
                    <FiPlus size={20} />
                  </button>
                </div>
                <div className="mt-6 flex flex-wrap gap-4">
                  {keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full flex items-center space-x-2 shadow-sm"
                    >
                      <span>{keyword}</span>
                      <button
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Preview Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center border-b pb-3 border-gray-200">
            <FiImage className="mr-3 text-indigo-600" size={24} />
            Post Preview
          </h2>
          <div className="bg-gray-50 p-6 rounded-xl h-[600px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : postSelectionMode === "specific" && selectedPost ? (
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-lg shadow-md">
                  <img
                    src={selectedPost.media_url}
                    alt={selectedPost.caption || "Instagram post"}
                    className="w-full object-cover transition-transform duration-300 hover:scale-105"
                    style={{ maxHeight: "400px" }}
                  />
                </div>
                <div>
                  <p className="text-gray-800 font-medium mb-3 text-lg">
                    {selectedPost.caption || "No caption provided"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Posted:{" "}
                    <span className="font-medium">
                      {new Date(selectedPost.timestamp).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 italic flex items-center justify-center h-full">
                {postSelectionMode === "all"
                  ? "Preview unavailable for all posts"
                  : "Select a post to preview"}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstagramCommentTrigger;
