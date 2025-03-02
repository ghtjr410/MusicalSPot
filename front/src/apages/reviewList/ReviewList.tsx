import React, { useState, useEffect, useCallback, useRef } from "react";
import ReviewItem from "./ReviewItem";
import {
  reviewRecent40,
  reviewLikes40,
  reviewViews40,
  MusicalReviews,
} from "services/review/reviewService";
import { Review } from "./ReviewType";
import ReviewDetail from "./ReviewDetail";
import ReviewFormModal from "acomponents/createReview/ReviewFormModal";
import ReviewModal from "acomponents/review/Modal";
import Modal from "components/Modal/Modal";
import "styles/style.css";
import { HeaderProvider } from "services/HeaderService/HeaderService";
import CommonHeader from "acomponents/header/CommonHeader";
import { useAuth } from "hooks/useAuthHook";
import { useNavigate, useParams } from "react-router-dom";
import { ReviewItemSkeleton } from "acomponents/review/LoadingModal";

type SortType = "recent" | "likes" | "views";

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>("recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { musicalId } = useParams<{ musicalId: string }>();
  const [musicalTitle, setMusicalTitle] = useState<string | null>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const {
    isAuthenticated,
    myNickname,
    nicknameModalOpen,
    setNicknameModalOpen,
    checkAuthStatus,
  } = useAuth();

  const lastReviewElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (musicalId) {
        response = await MusicalReviews(musicalId);
        // console.log(response);
      } else {
        switch (sortType) {
          case "recent":
            response = await reviewRecent40(page);
            break;
          case "likes":
            response = await reviewLikes40(page);
            break;
          case "views":
            response = await reviewViews40(page);
            break;
          default:
            response = await reviewRecent40(page);
        }
      }
      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error("데이터 형식이 올바르지 않습니다.");
      }

      if (data.length < 40) {
        setHasMore(false);
      }
      setReviews((prevReviews) => [...prevReviews, ...data]);
      if (musicalId && data.length > 0) {
        setMusicalTitle(data[0].musicalTitle);
      }
    } catch (error) {
      // console.error("리뷰 로딩 중 오류 발생:", error);
      setError("리뷰를 불러오는 데 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setReviews([]);
    setHasMore(true);
    fetchReviews();
  }, [sortType]);

  useEffect(() => {
    if (page > 0) {
      fetchReviews();
    }
  }, [page]);

  const handleReviewSubmitted = useCallback(() => {
    setPage(0);
    setReviews([]);
    setHasMore(true);
    fetchReviews();
    handleCloseModal();
  }, []);

  const handleReviewClick = (reviewId: number) => {
    setSelectedReviewId(reviewId);
  };

  const handleCloseModal = () => {
    setSelectedReviewId(null);
  };

  const handleCreateReviewClick = () => {
    checkAuthStatus(
      (nickname) => {
        console.log("인증된 사용자:", nickname);
        setIsCreateModalOpen(true);
      },
      () => {
        console.log("인증 필요함");
        setShowLoginModal(true);
      }
    );
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate("/sign-in");
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleSortChange = (newSortType: SortType) => {
    setSortType(newSortType);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const updateReviewInList = useCallback((updatedReview: Review) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === updatedReview.id
          ? { ...review, ...updatedReview }
          : review
      )
    );
  }, []);

  // if (error) {
  //   return <div className="text-center text-red-500">{error}</div>;
  // }

  return (
    <HeaderProvider>
      <div className="max-w-[1250px] mx-auto pt-20">
        <CommonHeader
          isAuthenticated={isAuthenticated}
          myNickname={myNickname}
          nicknameModalOpen={nicknameModalOpen}
          setNicknameModalOpen={setNicknameModalOpen}
          checkAuthStatus={checkAuthStatus}
        />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold mb-6 text-center">
            {musicalId && musicalTitle ? `${musicalTitle}` : "후기 게시판"}
          </h2>{" "}
          <div className="flex justify-between mb-4">
            <button
              onClick={handleCreateReviewClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              리뷰 작성
            </button>

            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
              >
                {sortType === "recent"
                  ? "최신순"
                  : sortType === "likes"
                  ? "좋아요순"
                  : "조회수순"}
                <svg
                  className="fill-current h-4 w-4 ml-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSortChange("recent")}
                  >
                    최신순
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSortChange("likes")}
                  >
                    좋아요순
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => handleSortChange("views")}
                  >
                    조회수순
                  </button>
                </div>
              )}
            </div>
          </div>
          <ReviewFormModal
            isOpen={isCreateModalOpen}
            onClose={handleCloseCreateModal}
            onReviewSubmitted={handleReviewSubmitted}
          />
          <div className="text-red-500">{error}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
            {reviews.map((review, index) => (
              <div
                key={`${review.id}-${index}`}
                ref={index === reviews.length - 1 ? lastReviewElementRef : null}
                onClick={() => handleReviewClick(review.id)}
                className="cursor-pointer"
              >
                <ReviewItem review={review} isAuthenticated={isAuthenticated} />
              </div>
            ))}
          </div>
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 mt-4">
              {Array(40)
                .fill(0)
                .map((_, index) => (
                  <ReviewItemSkeleton key={index} />
                ))}
            </div>
          )}
          {!hasMore && (
            <p className="text-center mt-4">더 이상 리뷰가 없습니다.</p>
          )}
          <ReviewModal isOpen={!!selectedReviewId} onClose={handleCloseModal}>
            {selectedReviewId && (
              <ReviewDetail
                isAuthenticated={isAuthenticated}
                reviewId={selectedReviewId}
                onClose={handleCloseModal}
                onDelete={handleReviewSubmitted}
                onUpdate={updateReviewInList}
              />
            )}
          </ReviewModal>
        </div>
      </div>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginRedirect}
        message="리뷰 작성은 로그인한 회원만 이용 가능합니다."
      />
    </HeaderProvider>
  );
};

export default ReviewList;
