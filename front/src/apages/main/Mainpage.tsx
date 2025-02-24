import React, { useEffect, useState, useRef } from "react";
import {
  musicalSortedByStartDate,
  musicalSortedByViewCount,
  musicalDetailsIncrementView, // 조회수 증가 함수 import
} from "services/musical/musicalService";

import { HeaderProvider } from "services/HeaderService/HeaderService";
import CommonHeader from "acomponents/header/CommonHeader";
import CommonFooter from "acomponents/footer/CommonFooter";
import { useAuth } from "hooks/useAuthHook";
import { useNavigate } from "react-router-dom"; // import useNavigate 추가
import { GrPrevious, GrNext } from "react-icons/gr";
import styles from "./Mainpage.module.css";

interface Musical {
  id: number;
  title: string;
  startDate?: string;
  endDate?: string;
  viewCount?: number;
  imageUrl: string;
}

const Mainpage: React.FC = () => {
  const {
    isAuthenticated,
    myNickname,
    nicknameModalOpen,
    setNicknameModalOpen,
    checkAuthStatus,
  } = useAuth();

  const navigate = useNavigate(); // useNavigate 훅 사용
  const [musicalsByStartDate, setMusicalsByStartDate] = useState<Musical[]>([]);
  const [musicalsByViewCount, setMusicalsByViewCount] = useState<Musical[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 현재 설정된 타임아웃을 초기화
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // 시작일 기준으로 정렬된 뮤지컬 목록을 가져오는 함수
  const handleMusicalSortedByStartDate = async () => {
    try {
      const response = await musicalSortedByStartDate();
      setMusicalsByStartDate(response.data);
      console.log("StartDate Data:", response);
    } catch (error) {
      console.error("Error fetching start date sorted musicals:", error);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  // 조회수 기준으로 정렬된 뮤지컬 목록을 가져오는 함수
  const handleMusicalSortedByViewCount = async () => {
    try {
      const response = await musicalSortedByViewCount();
      setMusicalsByViewCount(response.data);
      console.log("ViewCount Data:", response.data);
    } catch (error) {
      console.error("Error fetching view count sorted musicals:", error);
    }
  };

  // 컴포넌트가 마운트될 때 시작일 기준과 조회수 기준 뮤지컬 목록을 로드
  useEffect(() => {
    console.log("사이트 랜더링 완료");
    handleMusicalSortedByStartDate();
    handleMusicalSortedByViewCount();
  }, []);

  // 슬라이드 자동 전환 설정
  useEffect(() => {
    if (musicalsByStartDate.length > 0) {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setCurrentSlide(
          (prevSlide) => (prevSlide + 1) % musicalsByStartDate.length
        );
      }, 3000); // 3초마다 슬라이드 변경

      return () => {
        resetTimeout(); // 컴포넌트 언마운트 시 타임아웃 정리
      };
    }
  }, [musicalsByStartDate, currentSlide]);

  // 다음 슬라이드로 이동하는 함수
  const handleNext = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide + 1) % musicalsByStartDate.length
    );
  };

  // 이전 슬라이드로 이동하는 함수
  const handlePrev = () => {
    setCurrentSlide(
      (prevSlide) =>
        (prevSlide - 1 + musicalsByStartDate.length) %
        musicalsByStartDate.length
    );
  };

  // 특정 슬라이드로 이동하는 함수
  const handleLineClick = (index: number) => {
    setCurrentSlide(index);
  };

  // 이미지 클릭 시 호출되는 함수
  const handleClick = async (id: number) => {
    try {
      const result = await musicalDetailsIncrementView(id.toString()); // 조회수 증가 함수 호출
      console.log("View Count Increment Response:", result); // 결과 콘솔 출력
      navigate(`/details/${id}`); // DetailPage로 이동
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };

  return (
    <HeaderProvider>
      <div className="page-container">
        <div className="content">
          <div className={styles.headerStyle}>
            <CommonHeader
              isAuthenticated={isAuthenticated}
              myNickname={myNickname}
              nicknameModalOpen={nicknameModalOpen}
              setNicknameModalOpen={setNicknameModalOpen}
              checkAuthStatus={checkAuthStatus}
            />
            <div className={styles.slideContainer}>
              {/* 슬라이드 버튼 컨테이너 */}
              <div className={styles.slideBtnContainer}>
                {/* 이전 슬라이드 버튼 */}
                <button className={styles.slideBtn} onClick={handlePrev}>
                  <GrPrevious />
                </button>
                {/* 다음 슬라이드 버튼 */}
                <button className={styles.slideBtn} onClick={handleNext}>
                  <GrNext />
                </button>
              </div>

              {/* 슬라이드 컨테이너 */}
              <div className={styles.slideContainerInner}>
                <div
                  className={styles.slideBoxAnimation}
                  style={{
                    transform: `translateX(-${
                      currentSlide * (100 / musicalsByStartDate.length)
                    }%)`,
                  }}
                >
                  {musicalsByStartDate.length > 0 &&
                    musicalsByStartDate.map((musical, index) => (
                      <div
                        key={musical.id}
                        className={`${styles.slideSortBox}  
            ${
              index === currentSlide
                ? styles.currentImgStyle
                : styles.normalImgStyle
            } cursor-pointer`}
                        onClick={() => handleClick(musical.id)}
                        style={{ zIndex: 100 }} // z-index 설정
                      >
                        <img
                          src={musical.imageUrl}
                          alt={musical.title}
                          className="w-full h-full shadow-modalShadow shadow-stone-600 mx-auto"
                          style={{ pointerEvents: "auto" }} // pointer-events 설정
                        />
                      </div>
                    ))}
                </div>
                {/* 슬라이드 네비게이션 */}
                <div
                  className={
                    "absolute bottom-2 left-0 right-0 flex justify-center space-x-2 mt-2"
                  }
                >
                  {musicalsByStartDate.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1 cursor-pointer ${
                        index === currentSlide
                          ? styles.currentSlideBarStyle
                          : styles.normalSlideBarStyle
                      } transition-all duration-300`}
                      onClick={() => handleLineClick(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.recommendContainer}>
              <span className={styles.recommendText}>What's Hot</span>
            </div>

            {/* Grid Section */}
            <div className={styles.gridContainer}>
              {musicalsByViewCount.slice(0, 1).map((musical) => (
                <div
                  key={musical.id}
                  className={styles.gridInner}
                  onClick={() => handleClick(musical.id)}
                >
                  <div className={`${styles.gridImage} group`}>
                    <img
                      src={musical.imageUrl}
                      alt={musical.title}
                      className={styles.gridImgContainer}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-0 
                text-white text-center p-2.5 opacity-0 group-hover:opacity-100 hover:bg-opacity-65 
                transition-opacity duration-300 flex flex-col justify-center items-center"
                    >
                      <div>{musical.title}</div>
                      <div>{formatDate(musical.startDate)}</div>
                      {musical.startDate !== musical.endDate ? (
                        <div>{formatDate(musical.endDate)}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
              {musicalsByViewCount.slice(1, 7).map((musical) => (
                <div
                  key={musical.id}
                  className={`${styles.sortedImgContainer} group`}
                  onClick={() => handleClick(musical.id)}
                >
                  <div className={styles.gridImage}>
                    <img
                      src={musical.imageUrl}
                      alt={musical.title}
                      className={styles.gridImgContainer}
                    />
                    <div
                      className="absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-0 text-white text-center 
                p-2.5 opacity-0 group-hover:opacity-100 hover:bg-opacity-65 transition-opacity duration-300 flex flex-col 
                justify-center items-center"
                    >
                      <div>{musical.title}</div>
                      <div>{formatDate(musical.startDate)}</div>
                      {musical.startDate !== musical.endDate ? (
                        <div>{formatDate(musical.endDate)}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Section */}
          </div>
          <CommonFooter />
        </div>
      </div>
    </HeaderProvider>
  );
};

export default Mainpage;
