import React, { useState, useEffect } from "react";
import {
  createReview,
  updateReview,
  privateReviewDetails,
} from "services/review/reviewService";
import { Review } from "./CreateReviewType";
import MusicalSelector from "./MusicalSelector";
import { ContentInput } from "./ContentLength";
import MusicalSearch from "./SearchMusical";

interface ReviewFormProps {
  existingReview?: string;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  existingReview,
  onClose,
  onReviewSubmitted,
}) => {
  const [formData, setFormData] = useState<Review>({
    reviewId: "",
    title: "",
    content: "",
    musicalId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [titleError, settitleError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [musicalError, setMusicalError] = useState<string | null>(null);

  useEffect(() => {
    if (existingReview) {
      fetchExistingReview(existingReview);
    }
  }, [existingReview]);

  const fetchExistingReview = async (reviewId: string) => {
    try {
      const response = await privateReviewDetails(reviewId);
      const reviewData = response.data;
      setFormData(reviewData);
      setSelectedImage(reviewData.musical?.imageUrl);
    } catch (error) {
      console.error("Error fetching existing review:", error);
      setError("기존 리뷰를 불러오는데 실패했습니다.");
    }
  };

  const handleSubmit = async (content: string) => {
    if (!formData.musicalId) {
      setMusicalError("뮤지컬을 선택해주세요.");
      return;
    }

    if (formData.title.length < 5) {
      setError("제목은 최소 5글자 이상 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);
    setMusicalError(null);

    try {
      if (existingReview) {
        await updateReview(
          existingReview,
          formData.title,
          content,
          formData.musicalId
        );
      } else {
        await createReview(formData.title, content, formData.musicalId);
      }
      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setError("리뷰를 제출하는 중에 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleMusicalSelect = (musicalId: string, imageUrl?: string) => {
    setFormData((prev) => ({ ...prev, musicalId }));
    setSelectedImage(imageUrl);
    setError(null);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData((prev) => ({ ...prev, title: newTitle }));
    if (newTitle.length < 5) {
      settitleError("제목은 최소 5글자 이상 입력해주세요");
    } else {
      setError(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className="w-full md:w-1/3">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected Musical"
            className="w-full object-cover rounded"
          />
        ) : (
          <div className="w-full h-5/6 bg-gray-200 flex items-center justify-center rounded">
            뮤지컬을 선택해주세요
          </div>
        )}
      </div>
      <div className="w-full md:w-1/3">
        <MusicalSelector onMusicalSelect={handleMusicalSelect} />
        <MusicalSearch onMusicalSelect={handleMusicalSelect} />{" "}
        {musicalError && <p className="text-red-500 mt-4">{musicalError}</p>}
      </div>
      <div className="w-full md:w-1/3">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-gray-700">
            <div className="flex justify-between items-center">
              <span>제목</span>
              {titleError && (
                <span className="text-red-500 text-sm">{titleError}</span>
              )}
            </div>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full p-2 border rounded text-gray-700 bg-white"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2 text-gray-700">
            내용
          </label>
          <ContentInput
            minLength={10}
            maxLength={1000}
            placeholder="리뷰 내용을 입력해주세요..."
            onSubmit={handleSubmit}
            isTextArea={true}
            textAreaHeight="450px"
          />
        </div>
        {loading && <p className="text-blue-500">처리 중...</p>}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default ReviewForm;
