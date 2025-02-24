import React, { useState, useEffect, useCallback } from "react";
import { Review } from "./ReviewType";
import {
  privateReviewDetails,
  publicReviewDetails,
  reviewDetailsIncreaseView,
} from "services/review/reviewService";
import EditDeleteButtons from "acomponents/review/EditDeleteButton";
import CommentForm from "acomponents/reviewComments/CommentsForm";
import ReviewLike from "acomponents/review/ReviewLike";
import ReviewForm from "acomponents/createReview/ReviewForm";
import CommentList from "./CommentList";
import { EyeIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { truncateString } from "acomponents/review/ReviewContentLength";
import { ReviewDetailLoadingModal } from "acomponents/review/LoadingModal";

interface ReviewDetailProps {
  reviewId: number;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: (updatedReview: Review) => void;
  isAuthenticated: boolean;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({
  reviewId,
  onClose,
  onDelete,
  onUpdate,
  isAuthenticated,
}) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const fetchReviewDetail = useCallback(async () => {
    try {
      setLoading(true);
      await reviewDetailsIncreaseView(reviewId.toString());

      const response = isAuthenticated
        ? await privateReviewDetails(reviewId.toString())
        : await publicReviewDetails(reviewId.toString());

      setReview(response.data);
      onUpdate(response.data);
    } catch (error) {
      console.error("Error fetching review details:", error);
      setError("리뷰를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [reviewId, isAuthenticated, onUpdate]);

  const handleMusicalDetail = () => {
    navigate(`/details/${review?.musicalId}`);
  };

  useEffect(() => {
    fetchReviewDetail();
  }, [fetchReviewDetail]);

  const handleCommentAdded = useCallback(() => {
    fetchReviewDetail();
    if (review) {
      onUpdate({
        ...review,
        commentCount: review.comments.length + 1,
      });
    }
  }, [fetchReviewDetail, review, onUpdate]);

  const handleLikeToggle = useCallback(
    (newLikeCount: number, isLiked: boolean) => {
      if (review) {
        const updatedReview = {
          ...review,
          likeCount: newLikeCount,
          isLiked: isLiked,
        };
        setReview(updatedReview);
        onUpdate(updatedReview);
      }
    },
    [review, onUpdate]
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsEditing(false);
    fetchReviewDetail();
  }, [fetchReviewDetail]);

  if (loading) return <ReviewDetailLoadingModal />;
  if (error) return <div>{error}</div>;
  if (!review) return <div>리뷰를 찾을 수 없습니다.</div>;

  if (isEditing) {
    return (
      <ReviewForm
        existingReview={reviewId.toString()}
        onClose={handleCloseEdit}
        onReviewSubmitted={handleCommentAdded}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/3">
          <img
            src={review.musicalImageUrl}
            alt={review.musicalTitle}
            className="w-full h-auto object-cover rounded-lg shadow-lg cursor-pointer"
            onClick={handleMusicalDetail}
          />
          <h2 className="text-xl font-bold mt-2">
            {truncateString(review.musicalTitle, 20)}
          </h2>
          <p className="cursor-pointer" onClick={handleMusicalDetail}>
            상세보기
          </p>
          <p className="text-sm text-gray-600">
            카테고리: {review.musicalCategory}
          </p>
        </div>
        <div className="md:w-2/3 flex flex-col">
          <h1 className="text-2xl font-bold mb-2">{review.title}</h1>
          <div className="flex justify-between items-center text-sm mb-2">
            <p className="text-gray-600">작성자: {review.nickname}</p>
            <p className="text-gray-600">
              작성일: {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="flex items-center">
              <EyeIcon className="w-4 h-4 mr-1 text-blue-500" />
              {review.viewCount}
            </span>
            <span className="flex items-center">
              <ChatBubbleLeftIcon className="w-4 h-4 mr-1 text-green-500" />
              {review.comments.length}
            </span>
            <ReviewLike
              reviewId={review.id.toString()}
              initialLikeCount={review.likeCount}
              isAuthenticated={isAuthenticated}
              onLikeToggle={handleLikeToggle}
              isLiked={review.isLiked}
            />
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-2 max-h-60 h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            <p className="text-gray-800 whitespace-pre-wrap text-sm">
              {review.content}
            </p>
          </div>
          <EditDeleteButtons
            reviewId={review.id.toString()}
            isOwner={review.owner}
            onEdit={handleEdit}
            onDelete={onDelete}
          />
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              댓글 ({review.comments.length})
            </h3>
            <div className="max-h-40 overflow-y-auto mb-2">
              <CommentList
                comments={review.comments}
                onCommentUpdated={handleCommentAdded}
              />
            </div>
            <CommentForm
              reviewId={reviewId.toString()}
              onCommentAdded={handleCommentAdded}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetail;
