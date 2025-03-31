// components/Automation/CommentAutomationForm.tsx
import React, { useState, useEffect } from "react";
import {
  FiInfo,
  FiLink,
  FiUserPlus,
  FiMail,
  FiMessageSquare,
  FiRepeat,
  FiLoader,
  FiCheckCircle,
  FiRefreshCw,
  FitoastCircle,
  FiEdit,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

interface CommentAutomationFormProps {
  onBack: () => void;
  onUpdatePreview: (previewData: {
    openingDM: string;
    linkDM: string;
    buttonLabel: string;
  }) => void;
}

const CommentAutomationForm: React.FC<CommentAutomationFormProps> = ({
  onBack,
  onUpdatePreview,
}) => {
  // Core state management
  const [postType, setPostType] = useState<"specific" | "any" | "next">(
    "specific"
  );
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [commentTrigger, setCommentTrigger] = useState<"specific" | "any">(
    "specific"
  );
  const [commentWords, setCommentWords] = useState("");

  // Default values for first-time users
  const defaultOpeningDM =
    "Hey there! I'm so happy you're here, thanks so much for your interest 😊 Click below and I'll send you the link in just a sec! 😊";
  const [openingDM, setOpeningDM] = useState(defaultOpeningDM);
  const [linkDM, setLinkDM] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [buttonLabel, setButtonLabel] = useState("Send me the link");

  // Optional features
  const [autoReply, setAutoReply] = useState(false);
  const [followUp, setFollowUp] = useState(false);
  const [followRequest, setFollowRequest] = useState(false);
  const [emailRequest, setEmailRequest] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [hasExistingAutomation, setHasExistingAutomation] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Base URL for backend API
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  // Simulated user ID (replace with real auth in production)
  const userId = "temp-user-123"; // This should come from your auth system

  // Fetch existing automation settings and posts on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch existing automation settings
        const automationResponse = await axios.get(
          `${API_BASE_URL}/api/instagram/automation`,
          { params: { userId } }
        );

        const automation = automationResponse.data.automation;
        console.log(
          "Existing automation settings response:",
          automationResponse.data
        );
        if (automation) {
          setHasExistingAutomation(true);
          setPostType(automation.postType || "specific");
          setSelectedPost(automation.postId || null);
          setCommentTrigger(automation.commentTrigger || "specific");
          setCommentWords(automation.triggerWords?.join(", ") || "");
          setOpeningDM(automation.openingDM || defaultOpeningDM);
          setLinkDM(automation.linkDM || "");
          setLinkUrl(automation.linkUrl || "");
          setButtonLabel(automation.buttonLabel || "Send me the link");
          setAutoReply(automation.autoReply || false);
          setFollowUp(automation.followUp || false);
          setFollowRequest(automation.followRequest || false);
          setEmailRequest(automation.emailRequest || false);
          setIsLive(automation.isLive || false);
        }

        // Always fetch posts on initial load
        await fetchInstagramPosts();
        setInitialDataLoaded(true);
        setFetchError(null);
      } catch (error: any) {
        console.error("Error fetching initial data:", error);
        setFetchError(error.response?.data?.message || "Failed to load data");
        setInitialDataLoaded(true);

        // Even if there's an error with existing automation, try to fetch posts
        try {
          await fetchInstagramPosts();
        } catch (postError) {
          console.error("Error fetching posts:", postError);
        }
      }
    };

    fetchInitialData();
  }, []);

  // Update preview when relevant fields change
  useEffect(() => {
    onUpdatePreview({
      openingDM,
      linkDM,
      buttonLabel,
    });
  }, [openingDM, linkDM, buttonLabel, onUpdatePreview]);

  const fetchInstagramPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/instagram/posts`, {
        params: { userId },
      });

      if (response.data.posts && response.data.posts.length > 0) {
        setPosts(response.data.posts);

        // Only set a default selected post if none is already selected
        if (!selectedPost && postType === "specific") {
          setSelectedPost(response.data.posts[0].id);
        }
      } else {
        toast.warning(
          "No posts found. Please create content on Instagram first."
        );
      }
    } catch (error: any) {
      console.error("Error fetching Instagram posts:", error);
      toast.error("Failed to load Instagram posts");
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleSaveAutomation = async () => {
    // Validate required fields
    if (postType === "specific" && !selectedPost) {
      toast.error("Please select a post");
      return;
    }

    if (commentTrigger === "specific" && !commentWords.trim()) {
      toast.error("Please enter trigger words");
      return;
    }

    if (!openingDM.trim()) {
      toast.error("Opening DM message is required");
      return;
    }

    setIsSaving(true);
    try {
      const automationData = {
        postType,
        selectedPost: postType === "specific" ? selectedPost : null,
        commentTrigger,
        commentWords: commentTrigger === "specific" ? commentWords : "",
        openingDM,
        linkDM,
        linkUrl,
        buttonLabel,
        autoReply,
        followUp,
        followRequest,
        emailRequest,
        isLive,
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/instagram/automation`,
        automationData,
        { params: { userId } }
      );

      setHasExistingAutomation(true);
      toast.success("Automation saved successfully!");

      // If user set it to live, show additional confirmation
      if (isLive) {
        toast.success("Your automation is now live!");
      }
    } catch (error: any) {
      console.error("Error saving automation:", error);
      toast.error(error.response?.data?.message || "Failed to save automation");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefreshPosts = async () => {
    await fetchInstagramPosts();
    toast.success("Posts refreshed successfully");
  };

  if (!initialDataLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[700px]">
        <FiLoader className="animate-spin text-blue-500 text-4xl mb-4" />
        <p className="text-gray-600">Loading your automation settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* {fetchError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md"
        >
          <div className="flex items-center">
            <FitoastCircle className="text-red-500 mr-2" />
            <p className="text-red-700">{fetchError}</p>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Don't worry, you can create a new automation below.
          </p>
        </motion.div>
      )} */}

      {hasExistingAutomation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-md"
        >
          <div className="flex items-center">
            <FiCheckCircle className="text-blue-500 mr-2" />
            <p className="text-blue-700">
              You already have an automation set up.
            </p>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            You can make changes below and save to update your settings.
          </p>
        </motion.div>
      )}

      <div className="space-y-8">
        {/* Section 1: Post Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full w-7 h-7 inline-flex items-center justify-center mr-3 text-sm">
              1
            </span>
            When someone comments on
          </h3>
          <div className="space-y-4 pl-10">
            <div className="flex flex-col space-y-2">
              <label className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="postType"
                  value="specific"
                  checked={postType === "specific"}
                  onChange={() => setPostType("specific")}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  A specific post or reel
                </span>
              </label>

              {postType === "specific" && (
                <div className="ml-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-700">Select a post</h4>
                    <button
                      onClick={handleRefreshPosts}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      disabled={loadingPosts}
                    >
                      <FiRefreshCw
                        className={`mr-1 ${loadingPosts ? "animate-spin" : ""}`}
                      />
                      Refresh
                    </button>
                  </div>

                  {loadingPosts ? (
                    <div className="flex items-center justify-center p-6">
                      <FiLoader className="animate-spin text-blue-500 mr-2" />
                      <span>Loading posts...</span>
                    </div>
                  ) : posts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                      {posts.map((post) => (
                        <div
                          key={post.id}
                          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:shadow-md ${
                            selectedPost === post.id
                              ? "border-blue-600 shadow-lg"
                              : "border-transparent"
                          }`}
                          onClick={() => setSelectedPost(post.id)}
                        >
                          {post.media_type === "VIDEO" ? (
                            <video
                              src={post.media_url}
                              className="w-full h-24 object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={post.media_url || "/api/placeholder/100/100"}
                              alt={post.caption || "Instagram post"}
                              className="w-full h-24 object-cover"
                            />
                          )}

                          {/* ✅ Small Tick Mark Instead of Full Blue Overlay */}
                          {selectedPost === post.id && (
                            <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1 shadow-md">
                              <FiCheckCircle size={18} />
                            </div>
                          )}

                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-xs text-white truncate">
                            {post.caption
                              ? post.caption.substring(0, 20) +
                                (post.caption.length > 20 ? "..." : "")
                              : "No caption"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6 bg-gray-100 rounded-lg">
                      <FiInfo className="mx-auto text-gray-400 text-3xl mb-2" />
                      <p className="text-gray-500">
                        No posts found. Ensure your Instagram account is
                        connected.
                      </p>
                      <button
                        onClick={handleRefreshPosts}
                        className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}

              <label className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="postType"
                  value="any"
                  checked={postType === "any"}
                  onChange={() => setPostType("any")}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  Any post or reel
                </span>
              </label>
              <label className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="postType"
                  value="next"
                  checked={postType === "next"}
                  onChange={() => setPostType("next")}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 font-medium">
                  Next post or reel
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Section 2: Comment Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full w-7 h-7 inline-flex items-center justify-center mr-3 text-sm">
              2
            </span>
            And this comment has
          </h3>
          <div className="space-y-4 pl-10">
            <label className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
              <input
                type="radio"
                name="commentTrigger"
                value="specific"
                checked={commentTrigger === "specific"}
                onChange={() => setCommentTrigger("specific")}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">
                A specific word or words
              </span>
            </label>

            {commentTrigger === "specific" && (
              <div className="ml-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="text"
                  placeholder="Enter words (e.g., link, info, details)"
                  value={commentWords}
                  onChange={(e) => setCommentWords(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <FiInfo className="mr-2 text-blue-500" />
                  <span>
                    Separate multiple words with commas. Example: link, info,
                    details
                  </span>
                </div>
              </div>
            )}

            <label className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded cursor-pointer transition-colors">
              <input
                type="radio"
                name="commentTrigger"
                value="any"
                checked={commentTrigger === "any"}
                onChange={() => setCommentTrigger("any")}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-700 font-medium">Any word</span>
            </label>
          </div>
        </motion.div>

        {/* Section 3: DM Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
        >
          <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-full w-7 h-7 inline-flex items-center justify-center mr-3 text-sm">
              3
            </span>
            They will get
          </h3>
          <div className="space-y-5 pl-10">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-gray-700 font-medium mb-2">
                An opening DM
              </label>
              <textarea
                value={openingDM}
                onChange={(e) => setOpeningDM(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 text-gray-700"
                placeholder="Write your opening message here..."
              />
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <FiInfo className="mr-2 text-blue-500" />
                <span>
                  This is the first message they'll receive when they comment.
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-gray-700 font-medium mb-2">
                A second DM with link (optional)
              </label>
              <textarea
                value={linkDM}
                onChange={(e) => setLinkDM(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 text-gray-700"
                placeholder="Write your message with link here..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Link
                  </label>
                  <div className="relative">
                    <FiLink className="absolute left-3 top-3 text-gray-500" />
                    <input
                      type="text"
                      placeholder="https://your-link-here.com"
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="Send me the link"
                    value={buttonLabel}
                    onChange={(e) => setButtonLabel(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button and Live Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="pt-4 flex justify-between items-center"
        >
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                checked={isLive}
                onChange={() => setIsLive(!isLive)}
                disabled={isSaving}
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {isLive ? "Automation is active" : "Automation is inactive"}
              </span>
            </label>
          </div>

          <button
            onClick={handleSaveAutomation}
            disabled={isSaving}
            className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center ${
              isSaving ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {isSaving ? (
              <>
                <FiLoader className="animate-spin mr-2" />
                Saving...
              </>
            ) : hasExistingAutomation ? (
              <>
                <FiEdit className="mr-2" />
                Update Automation
              </>
            ) : (
              "Save & Activate"
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CommentAutomationForm;
