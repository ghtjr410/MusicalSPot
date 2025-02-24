import React, { useState, useEffect } from "react";
import { toggleReviewLike, reviewLike } from "services/review/reviewService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Modal from "components/Modal/Modal";

interface ReviewLikeProps {
  reviewId: string;
  initialLikeCount: number;
  isAuthenticated: boolean;
  onLikeToggle?: (newLikeCount: number, isLiked: boolean) => void;
  isLiked: boolean;
}

const ReviewLike: React.FC<ReviewLikeProps> = ({
  reviewId,
  initialLikeCount,
  isAuthenticated,
  onLikeToggle,
  isLiked: initialIsLiked,
}) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikeCount(initialLikeCount);
  }, [initialIsLiked, initialLikeCount]);

  const handleLikeSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    try {
      await toggleReviewLike(reviewId);
      const newIsLiked = !isLiked;
      const newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
      setIsLiked(newIsLiked);
      setLikeCount(newLikeCount);
      if (onLikeToggle) {
        onLikeToggle(newLikeCount, newIsLiked);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/sign-in");
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleLikeSubmit}
        className={`mr-2 text-2xl focus:outline-none ${
          isLiked ? "text-blue-500" : "text-gray-400 hover:text-blue-500"
        }`}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      >
        {isLiked ? (
          <FaHeart className="w-4 h-4 mr-1 text-red-500" />
        ) : (
          <FaRegHeart className="w-4 h-4 mr-1 text-red-500" />
        )}
      </button>
      <span>{likeCount}</span>
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginRedirect}
        message="좋아요는 로그인한 회원만 이용 가능합니다."
      />
    </div>
  );
};

export default ReviewLike;
