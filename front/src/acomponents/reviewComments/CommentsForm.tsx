import React, { useState } from "react";
import { ContentInput } from "acomponents/createReview/ContentLength";
import { reviewCommentsCreate } from "services/review/reviewService";
import { useNavigate } from "react-router-dom";
import Modal from "components/Modal/Modal";

interface CommentFormProps {
  reviewId: string;
  onCommentAdded: () => void;
  isAuthenticated: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  reviewId,
  onCommentAdded,
  isAuthenticated,
}) => {
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      await reviewCommentsCreate(reviewId, content);
      onCommentAdded();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };
  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/sign-in");
  };
  return (
    <div className="mt-4">
      <ContentInput
        minLength={5}
        maxLength={200}
        placeholder="댓글을 작성하세요"
        onSubmit={handleSubmit}
        isTextArea={false}
        textAreaHeight="45px"
      />
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginRedirect}
        message="댓글 작성은 로그인한 회원만 이용 가능합니다."
      />
    </div>
  );
};

export default CommentForm;
