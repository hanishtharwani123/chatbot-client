import React, { useEffect, useState } from "react";
import {
  FiHeart,
  FiMessageSquare,
  FiSend,
  FiBookmark,
  FiMoreHorizontal,
} from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

interface MobilePreviewProps {
  postImage: string;
  username: string;
  profilePicture: string;
  openingDM?: string;
  linkDM?: string;
  buttonLabel?: string;
}

const MobilePreview: React.FC<MobilePreviewProps> = ({
  postImage: fallbackImage,
  username,
  profilePicture,
  openingDM = "Hey there! I'm so happy you're here, thanks so much for your interest 😊 Click below and I'll send you the link in just a sec! 😊",
  linkDM = "",
  buttonLabel = "Send me the link",
}) => {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [useDefaultImage, setUseDefaultImage] = useState(false);
  const [viewMode, setViewMode] = useState<"post" | "dm">("post");

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const userId = "temp-user-123"; // Replace with real auth

  const safePostImage = useDefaultImage
    ? fallbackImage || "/api/placeholder/300/400"
    : selectedPost?.media_url || fallbackImage || "/api/placeholder/300/400";

  const caption =
    selectedPost?.caption ||
    "Check out our new product launch! Comment 'info' for details. #newproduct #launch #innovation";

  useEffect(() => {
    const fetchSelectedPost = async () => {
      if (fetchAttempted) return;

      try {
        setLoading(true);
        setFetchAttempted(true);

        const automationResponse = await axios.get(
          `${API_BASE_URL}/api/instagram/automation`,
          { params: { userId } }
        );

        const { postType, postId } = automationResponse.data.automation || {};

        if (postType === "any" || !postId) {
          setUseDefaultImage(true);
          setLoading(false);
          return;
        }

        if (postType === "specific" && postId) {
          const postResponse = await axios.get(
            `${API_BASE_URL}/api/instagram/posts`,
            { params: { userId } }
          );

          const post = postResponse.data.posts.find(
            (p: any) => p.id === postId
          );

          console.log("Post data:", post);

          if (post) {
            setSelectedPost(post);
          } else {
            setUseDefaultImage(true);
          }
        }
      } catch (error) {
        console.error("Error fetching automation:", error);
        setUseDefaultImage(true);
        setError("Failed to load post data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedPost();
  }, [fetchAttempted]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/api/placeholder/300/400";
    if (!useDefaultImage) setUseDefaultImage(true);
  };

  const renderNoPostMessage = () => (
    <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-gray-400 text-4xl mb-2">📷</div>
        <p className="text-gray-600 text-sm font-medium">
          No post selected yet
        </p>
        <p className="text-gray-500 text-xs mt-1">
          Configure automation to preview a specific post here.
        </p>
      </div>
    </div>
  );

  const renderPostView = () => (
    <div className="flex flex-col h-full">
      {/* Instagram Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-600 p-0.5">
            <div className="h-full w-full rounded-full bg-white p-0.5">
              <img
                src={profilePicture}
                alt={username}
                className="w-full h-full rounded-full object-cover"
                onError={handleImageError}
              />
            </div>
          </div>
          <span className="font-semibold text-sm ml-2 truncate">
            {username}
          </span>
        </div>
        <FiMoreHorizontal className="text-xl text-gray-700" />
      </div>

      {/* Post Media (Image or Video) */}
      {useDefaultImage && !selectedPost ? (
        renderNoPostMessage()
      ) : (
        <div className="relative w-full aspect-square bg-black">
          {selectedPost?.media_type === "VIDEO" ? (
            <video
              src={selectedPost?.media_url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
            />
          ) : (
            <img
              src={selectedPost?.media_url}
              alt="Post"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>
      )}

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <FiHeart className="text-2xl text-gray-800 hover:text-red-500 cursor-pointer transition-colors" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <FiMessageSquare className="text-2xl text-gray-800 hover:text-blue-500 cursor-pointer transition-colors" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <FiSend className="text-2xl text-gray-800 hover:text-blue-500 cursor-pointer transition-colors" />
            </motion.div>
          </div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <FiBookmark className="text-2xl text-gray-800 hover:text-yellow-500 cursor-pointer transition-colors" />
          </motion.div>
        </div>

        {/* Likes */}
        <div className="text-sm font-semibold text-gray-800 mb-1">
          142 likes
        </div>

        {/* Caption */}
        <div className="text-sm text-gray-800">
          <span className="font-bold mr-1">{username}</span>
          <span>{caption}</span>
        </div>

        {/* Comments */}
        <div className="text-xs text-gray-500 mt-1 mb-2">
          View all 18 comments
        </div>
        <motion.div
          className="flex items-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0 overflow-hidden">
            <img
              src="https://ui-avatars.com/api/?name=Visitor&background=random"
              alt="Commenter"
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          <div className="ml-2">
            <span className="font-semibold text-sm text-gray-800">
              visitor_user
            </span>
            <span className="text-sm text-gray-700 ml-1">
              This is amazing! Info please!
            </span>
          </div>
        </motion.div>

        {/* Add Comment */}
        <div className="flex items-center mt-3 pt-3 border-t border-gray-200">
          <div className="h-6 w-6 rounded-full bg-gray-200 mr-2">
            <img
              src="https://ui-avatars.com/api/?name=Me&background=random"
              alt="Me"
              className="w-full h-full rounded-full"
              onError={handleImageError}
            />
          </div>
          <input
            type="text"
            placeholder="Add a comment..."
            className="text-sm text-gray-700 flex-1 focus:outline-none"
          />
          <button className="text-sm font-semibold text-blue-500 hover:text-blue-700">
            Post
          </button>
        </div>
      </div>
    </div>
  );

  const renderDMView = () => (
    <div className="flex flex-col h-full">
      {/* DM Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <motion.div
            className="h-8 w-8 rounded-full flex-shrink-0 overflow-hidden border border-gray-200"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src={`https://ui-avatars.com/api/?name=${username}&background=random`}
              alt={username}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </motion.div>
          <div className="ml-2">
            <div className="font-semibold text-sm">{username}</div>
            <div className="text-xs text-gray-500">Active now</div>
          </div>
        </div>
        <div className="flex space-x-3">
          <FiSend className="text-lg text-gray-700" />
          <FiMoreHorizontal className="text-lg text-gray-700" />
        </div>
      </div>

      {/* DM Content */}
      <div className="flex-1 bg-gray-50 p-4 overflow-y-auto">
        {/* Date Divider */}
        <div className="flex justify-center mb-4">
          <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Today
          </div>
        </div>

        {/* First Message */}
        <motion.div
          className="flex justify-start mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-white py-3 px-4 rounded-lg max-w-[80%] shadow-sm border border-gray-100">
            <div className="text-sm text-gray-800">{openingDM}</div>
            <div className="text-xs text-gray-500 mt-1 text-right">2:34 PM</div>
          </div>
        </motion.div>

        {/* Second Message with Link */}
        {linkDM && (
          <motion.div
            className="flex justify-start mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="bg-white py-3 px-4 rounded-lg max-w-[80%] shadow-sm border border-gray-100">
              <div className="text-sm text-gray-800">{linkDM}</div>
              <motion.div
                className="bg-blue-500 text-white text-center py-2 px-4 rounded-md mt-3 text-sm font-medium cursor-pointer hover:bg-blue-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {buttonLabel}
              </motion.div>
              <div className="text-xs text-gray-500 mt-2 text-right">
                2:35 PM
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Message..."
            className="bg-transparent text-sm flex-1 focus:outline-none"
          />
          <div className="flex items-center space-x-2 ml-2">
            <motion.button
              className="text-blue-500 text-sm font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full max-w-xs mx-auto">
      <motion.div
        className="border-[12px] border-black rounded-[2.5rem] overflow-hidden relative shadow-xl bg-white"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Phone Status Bar */}
        <div className="bg-black text-white px-6 pt-2 pb-1 flex justify-between items-center text-xs">
          <div>9:41</div>
          <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-5 bg-black rounded-b-lg"></div>
          <div className="flex items-center space-x-1">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v2H7v4h3v9h4v-9h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>80%</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white h-[500px] overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>{viewMode === "post" ? renderPostView() : renderDMView()}</>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-gray-100 py-3 border-t border-gray-300">
          <div className="flex justify-center items-center space-x-4 mb-1">
            <motion.button
              onClick={() => setViewMode("post")}
              className={`text-sm font-medium py-1.5 px-5 rounded-full transition-colors ${
                viewMode === "post"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Post
            </motion.button>
            <motion.button
              onClick={() => setViewMode("dm")}
              className={`text-sm font-medium py-1.5 px-5 rounded-full transition-colors ${
                viewMode === "dm"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              DM
            </motion.button>
          </div>
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MobilePreview;
