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
  FiGrid,
  FiPauseCircle,
  FiMessageCircle,
  FiFilm,
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

  // Function to render media based on its type
  const renderMedia = (post, isPreview = false) => {
    const containerClasses = isPreview ? "w-full h-full" : "aspect-square";
    console.log("post: ", post);

    if (post.media_type === "VIDEO") {
      return (
        <div className={`relative ${containerClasses} bg-gray-100`}>
          <video
            src={post.media_url} // Ensure this URL is accessible
            poster={post.thumbnail_url || post.media_url} // Use thumbnail as fallback
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>

          {/* Video indicator badge */}
          <div className="absolute top-2 left-2 bg-black bg-opacity-70 rounded-md px-2 py-1 flex items-center">
            <FiFilm className="text-white mr-1" size={12} />
            <span className="text-white text-xs">Video</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className={`relative ${containerClasses} bg-gray-100`}>
          <img
            src={post.media_url}
            alt={post.caption || "Instagram post"}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100  flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                <FiArrowLeft className="mr-2" />
                Back
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center">
              <FiInstagram className="text-pink-600 mr-2" /> Instagram Comment
              Automation
            </h1>
            <div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveOrUpdate}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  <FiSettings className="mr-2" size={16} />
                  {loading ? "Saving..." : "Save Settings"}
                </button>
                <button
                  onClick={handleGoLive}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg text-white flex items-center transition-colors disabled:opacity-50 ${
                    isLive
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isLive ? (
                    <>
                      <FiPauseCircle className="mr-2" size={16} />
                      Pause
                    </>
                  ) : (
                    <>
                      <FiPlay className="mr-2" size={16} />
                      Go Live
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Configuration */}
          <div className="lg:col-span-2 space-y-8">
            {/* Post Selection Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <FiGrid className="mr-2" />
                  Post Selection
                </h2>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    Choose which Instagram content will trigger your automated
                    responses
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      setPostSelectionMode("all");
                      setSelectedPost(null);
                    }}
                    className={`
                      relative rounded-xl p-5 cursor-pointer transition
                      ${
                        postSelectionMode === "all"
                          ? "bg-indigo-50 border-2 border-indigo-500"
                          : "bg-white border-2 border-gray-200 hover:border-indigo-300"
                      }
                    `}
                  >
                    {postSelectionMode === "all" && (
                      <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1">
                        <FiCheckCircle className="text-white" size={16} />
                      </div>
                    )}
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-gray-900 mb-2">
                        All Posts & Reels
                      </h3>
                      <p className="text-sm text-gray-500 flex-grow">
                        Apply automation to all your Instagram content
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPostSelectionMode("specific")}
                    className={`
                      relative rounded-xl p-5 cursor-pointer transition
                      ${
                        postSelectionMode === "specific"
                          ? "bg-indigo-50 border-2 border-indigo-500"
                          : "bg-white border-2 border-gray-200 hover:border-indigo-300"
                      }
                    `}
                  >
                    {postSelectionMode === "specific" && (
                      <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1">
                        <FiCheckCircle className="text-white" size={16} />
                      </div>
                    )}
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Specific Post
                      </h3>
                      <p className="text-sm text-gray-500 flex-grow">
                        Target a single Instagram post or reel
                      </p>
                    </div>
                  </div>
                </div>

                {postSelectionMode === "specific" && (
                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                      Select a post:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPost(post)}
                          className={`
                            relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all
                            ${
                              selectedPost?.id === post.id
                                ? "border-indigo-500 ring-2 ring-indigo-200"
                                : "border-gray-200 hover:border-indigo-300"
                            }
                          `}
                        >
                          {selectedPost?.id === post.id && (
                            <div className="absolute top-2 right-2 bg-indigo-600 rounded-full p-1 z-10">
                              <FiCheckCircle className="text-white" size={16} />
                            </div>
                          )}

                          {renderMedia(post)}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white text-xs line-clamp-2">
                                {post.caption}
                              </p>
                            </div>
                          </div>

                          <div className="p-2">
                            <p className="text-xs text-gray-500">
                              {new Date(post.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Trigger Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <FiMessageCircle className="mr-2" />
                  Comment Trigger
                </h2>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    Define which comments will trigger your automated responses
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div
                    onClick={() => {
                      setCommentTriggerMode("any");
                      setKeywords([]);
                    }}
                    className={`
                      relative rounded-xl p-5 cursor-pointer transition
                      ${
                        commentTriggerMode === "any"
                          ? "bg-indigo-50 border-2 border-indigo-500"
                          : "bg-white border-2 border-gray-200 hover:border-indigo-300"
                      }
                    `}
                  >
                    {commentTriggerMode === "any" && (
                      <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1">
                        <FiCheckCircle className="text-white" size={16} />
                      </div>
                    )}
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Any Comment
                      </h3>
                      <p className="text-sm text-gray-500 flex-grow">
                        Respond to all comments on your post
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setCommentTriggerMode("keyword")}
                    className={`
                      relative rounded-xl p-5 cursor-pointer transition
                      ${
                        commentTriggerMode === "keyword"
                          ? "bg-indigo-50 border-2 border-indigo-500"
                          : "bg-white border-2 border-gray-200 hover:border-indigo-300"
                      }
                    `}
                  >
                    {commentTriggerMode === "keyword" && (
                      <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1">
                        <FiCheckCircle className="text-white" size={16} />
                      </div>
                    )}
                    <div className="flex flex-col h-full">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Keyword Trigger
                      </h3>
                      <p className="text-sm text-gray-500 flex-grow">
                        Respond only to comments with specific keywords
                      </p>
                    </div>
                  </div>
                </div>

                {commentTriggerMode === "keyword" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddKeyword()
                        }
                        placeholder="Enter keyword or phrase"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddKeyword}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                      >
                        <FiPlus size={20} />
                      </button>
                    </div>

                    {keywords.length > 0 ? (
                      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                        {keywords.map((keyword) => (
                          <span
                            key={keyword}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                          >
                            {keyword}
                            <button
                              onClick={() => handleRemoveKeyword(keyword)}
                              className="ml-2 text-indigo-600 hover:text-indigo-800"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-lg">
                        No keywords added yet. Add keywords to trigger automated
                        responses.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm sticky top-8">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <FiImage className="mr-2" />
                  Preview
                </h2>
              </div>

              <div className="p-6">
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  {/* Mobile Instagram Post Preview */}
                  <div className="mx-auto max-w-xs border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                    {/* Instagram Post Header */}
                    <div className="p-3 flex items-center border-b border-gray-100">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">your_account</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                      </div>
                    ) : postSelectionMode === "specific" && selectedPost ? (
                      <>
                        {renderMedia(selectedPost, true)}
                        <div className="p-3">
                          <div className="flex items-center space-x-4 mb-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                              />
                            </svg>
                          </div>
                          <p className="text-sm">
                            <span className="font-medium">your_account</span>{" "}
                            <span className="text-gray-700">
                              {selectedPost.caption || "No caption"}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(
                              selectedPost.timestamp
                            ).toLocaleDateString()}
                          </p>

                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">
                              <strong>Media Type:</strong>{" "}
                              {selectedPost.media_type === "VIDEO"
                                ? "Video"
                                : "Image"}
                            </p>
                            {selectedPost.media_type === "VIDEO" && (
                              <p className="text-xs text-gray-500">
                                <strong>Note:</strong> Video will play when
                                selected in preview
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
                        <FiImage className="text-gray-400 mb-3" size={32} />
                        <p className="text-gray-500 text-sm">
                          {postSelectionMode === "all"
                            ? "Automation will apply to all posts"
                            : "Select a post to see preview"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Configuration Summary */}
                  <div className="mt-6 p-4">
                    <h3 className="font-medium text-gray-700 mb-2">
                      Configuration Summary
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span>
                          <strong>Content:</strong>{" "}
                          {postSelectionMode === "all"
                            ? "All posts & reels"
                            : selectedPost
                            ? `Specific ${
                                selectedPost.media_type === "VIDEO"
                                  ? "video"
                                  : "image"
                              } post`
                            : "No post selected"}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span>
                          <strong>Trigger:</strong>{" "}
                          {commentTriggerMode === "any"
                            ? "Any comment"
                            : "Keyword matching"}
                        </span>
                      </li>
                      {commentTriggerMode === "keyword" && (
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2">•</span>
                          <span>
                            <strong>Keywords:</strong>{" "}
                            {keywords.length > 0
                              ? keywords.join(", ")
                              : "None added"}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InstagramCommentTrigger;
