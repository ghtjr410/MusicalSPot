import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  musicalDetails,
  musicalLike,
  toggleMusicalLike,
} from "services/musical/musicalService";
import { HeaderProvider } from "services/HeaderService/HeaderService";
import CommonHeader from "acomponents/header/CommonHeader";
import CommonFooter from "acomponents/footer/CommonFooter";
import { useAuth } from "hooks/useAuthHook";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"; // 아이콘 사용을 위해 react-icons 패키지 사용
import styles from "./DetailPage.module.css";
import Modal from "components/Modal/Modal";
import useNavigateHelper from "utils/NavigationUtil/navigationUtil";
interface Link {
  id: number;
  siteName: string;
  url: string;
}

interface Ticket {
  id: number;
  name: string;
  price: number;
}

interface MusicalDetails {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
  venue: string;
  price: number;
  ticketUrl: string;
  likeCount: number;
  reviewCount: number;
  tickets: Ticket[];
  links: Link[];
}

const DetailPage: React.FC = () => {
  const { musicalId } = useParams<{ musicalId: string }>();
  const [details, setDetails] = useState<MusicalDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [logInModalOpen, setLogInModalOpen] = useState(false);
  const navigate = useNavigate();

  const { navigateToLogin } = useNavigateHelper();
  const {
    isAuthenticated,
    myNickname,
    nicknameModalOpen,
    setNicknameModalOpen,
    checkAuthStatus,
  } = useAuth();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        if (musicalId) {
          const response = await musicalDetails(musicalId);
          if (response.data) {
            const data = response.data;
            console.log("Fetched Data:", data); // 불러온 데이터 콘솔에 출력
            setDetails(data); // 불러온 데이터를 상태에 저장
            setLikeCount(data.likeCount); // 초기 좋아요 수 설정
          }
          if (isAuthenticated) {
            const likeResponse = await musicalLike(musicalId);
            console.log("좋아요상태는 ? " + likeResponse.data);
            setLiked(likeResponse.data);
          }
        }
      } catch (error) {
        console.error("Error fetching musical details:", error);
        setError("뮤지컬 세부 정보를 불러오는데 실패했습니다.");
      }
    };

    getDetails();
  }, [musicalId, isAuthenticated, liked]);

  const handleLikeClick = async () => {
    if (!isAuthenticated) {
      setLogInModalOpen(true);
      return;
    }
    try {
      const response = await toggleMusicalLike(musicalId!);
      if (response.code === "SU") {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setError("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  const logInModalConfirm = () => {
    navigateToLogin();
  };
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  //todo: 0805 마지막 수정
  const handleReviewClick = () => {
    navigate(`/auth/reviewlist/${musicalId}`);
  };

  return (
    <HeaderProvider>
      <div className="max-w-[1250px] mx-auto pt-16 select-none">
        {/* 공통 헤더 */}

        <CommonHeader
          isAuthenticated={isAuthenticated}
          myNickname={myNickname}
          nicknameModalOpen={nicknameModalOpen}
          setNicknameModalOpen={setNicknameModalOpen}
          checkAuthStatus={checkAuthStatus}
        />
        <div className="container mx-auto p-4">
          {error && <div>{error}</div>}
          {details && (
            <>
              <div className="max-w-[1200px] pt-6 flex justify-between mb-4 overflow-hidden">
                <div className="w-full flex flex-row justify-between border-b-2 border-black">
                  <h1 className="text-2xl font-bold pt-2">{details.title}</h1>
                  {/* 예매처 버튼 */}
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded font-normal tracking-widest text-xl mb-1 ml-2"
                    onClick={openModal}
                  >
                    예매처
                  </button>
                </div>
                {/* 모달 창 */}

                {modalIsOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                      className="bg-white p-6 rounded shadow-lg relative"
                      style={{ width: "300px" }}
                    >
                      <button
                        className="absolute top-2 right-2 text-xl font-bold"
                        onClick={closeModal}
                      >
                        X
                      </button>
                      <h2 className="text-xl font-bold mb-4">예매처</h2>
                      {details.links.map((link) => (
                        <button
                          key={link.id}
                          className="block w-full py-2 my-2 bg-gray-500 text-white rounded"
                          onClick={() => (window.location.href = link.url)}
                        >
                          {link.siteName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex mb-4 space-x-4">
                <div className="w-fit relative z-10">
                  {/* 뮤지컬 이미지 */}

                  <img
                    src={details.imageUrl}
                    alt={details.title}
                    className="w-[full] h-[700px]"
                  />
                  <div className="flex justify-between mt-2">
                    <div
                      className={`flex items-center cursor-pointer transition-colors duration-150 ${
                        liked ? styles.heartPulse : ""
                      }`}
                      onClick={handleLikeClick}
                    >
                      {liked ? (
                        <AiFillHeart className="text-xl text-red-500 mr-1" />
                      ) : (
                        <AiOutlineHeart className="text-xl text-black mr-1" />
                      )}
                      <span className="text-lg">{likeCount}</span>
                    </div>
                    <div className="flex items-center text-black">
                      <span
                        className="text-lg border-b border-black cursor-pointer"
                        onClick={handleReviewClick}
                      >
                        {details.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 p-4 flex flex-col justify-around">
                  {/* 뮤지컬 정보 */}
                  <p className="tracking-widest">
                    <strong className="text-2xl border-b-2 mr-2 border-signature">
                      공연기간
                    </strong>{" "}
                    {formatDate(details.startDate)} -{" "}
                    {formatDate(details.endDate)}
                  </p>
                  <p className="tracking-widest">
                    <strong className="text-2xl border-b-2 mr-2 border-signature">
                      공연장소
                    </strong>{" "}
                    {details.venue}
                  </p>

                  <div className="tracking-widest">
                    <strong className="text-2xl border-b-2 mr-2 border-signature">
                      티켓가격
                    </strong>
                    {details.tickets && details.tickets.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {details.tickets.map((ticket) => (
                          <li key={ticket.id}>
                            {ticket.name}: {ticket.price.toLocaleString()}원
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>티켓정보가 없습니다.</p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Modal
        isOpen={logInModalOpen}
        onClose={() => setLogInModalOpen(false)}
        onConfirm={logInModalConfirm}
        message="로그인한 회원만 이용 가능합니다."
      />
      {/* 공통 푸터 컴포넌트 */}
      <CommonFooter />
    </HeaderProvider>
  );
};

export default DetailPage;
