import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import CommonHeader from "acomponents/header/CommonHeader";
import { useAuth } from "hooks/useAuthHook";
import { HeaderProvider } from "services/HeaderService/HeaderService";
import { ALL_MUSICALS, CATEGORY_LIST } from "utils/APIUrlUtil/apiUrlUtil";

// 뮤지컬 데이터 타입 정의
interface Musical {
  id: number;
  title: string;
  startDate?: string;
  endDate?: string;
  viewCount?: number;
  imageUrl: string;
  venue: string;
}

// 카테고리 데이터 타입 정의
interface Category {
  id: string;
  category: string;
}

// 모든 뮤지컬 데이터를 가져오는 함수
const allMusicals = async (): Promise<Musical[]> => {
  try {
    const result = await axios.get(ALL_MUSICALS());
    console.log("API Response:", result.data);

    if (Array.isArray(result.data.data)) {
      return result.data.data;
    } else {
      console.error("Unexpected response format:", result.data);
      return [];
    }
  } catch (error) {
    console.error("Error", error);
    return [];
  }
};

// 모든 카테고리 데이터를 가져오는 함수
const categoryList = async (): Promise<Category[]> => {
  try {
    const result = await axios.get(CATEGORY_LIST());
    console.log("Category API Response:", result.data);

    if (Array.isArray(result.data.data)) {
      return result.data.data;
    } else {
      console.error("Unexpected response format:", result.data);
      return [];
    }
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

// AllCategoryPage 컴포넌트 정의
const AllCategoryPage: React.FC = () => {
  const [musicals, setMusicals] = useState<Musical[]>([]); // 뮤지컬 데이터 상태
  const [categories, setCategories] = useState<Category[]>([]); // 카테고리 데이터 상태
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 메뉴 상태
  const [sortOption, setSortOption] = useState(" "); // 정렬 옵션 상태
  const navigate = useNavigate(); // 라우터 네비게이트 훅

  // 사용자 인증 훅
  const {
    isAuthenticated,
    myNickname,
    nicknameModalOpen,
    setNicknameModalOpen,
    checkAuthStatus,
  } = useAuth();

  // 모든 뮤지컬 데이터를 가져와서 상태에 저장
  const fetchMusicals = async () => {
    const response = await allMusicals();
    setMusicals(response);
    console.log("Musicals Data:", response);
  };

  // 모든 카테고리 데이터를 가져와서 상태에 저장
  const fetchCategories = async () => {
    const response = await categoryList();
    setCategories(response);
    console.log("Categories Data:", response);
  };

  // 컴포넌트 마운트 시 뮤지컬 및 카테고리 데이터를 가져옴
  useEffect(() => {
    fetchMusicals();
    fetchCategories();
  }, []);

  // 클릭 핸들러
  const handleClick = (id: number) => {
    console.log("Clicked ID:", id);
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

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // 카테고리 선택 시 실행되는 함수
  const handleCategorySelect = (categoryId: string) => {
    setShowDropdown(false);
    navigate(`/auth/category/${categoryId}`);
  };

  // 뮤지컬 데이터를 정렬하는 함수
  const sortMusicals = (musicals: Musical[], option: string) => {
    switch (option) {
      case "신상품순":
        return [...musicals].sort(
          (a, b) =>
            new Date(b.startDate || "").getTime() -
            new Date(a.startDate || "").getTime()
        );
      case "종료임박순":
        return [...musicals].sort(
          (a, b) =>
            new Date(a.endDate || "").getTime() -
            new Date(b.endDate || "").getTime()
        );
      case "상품명순":
        return [...musicals].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return musicals;
    }
  };

  const sortedMusicals = sortMusicals(musicals, sortOption);

  return (
    <HeaderProvider>
      <div className="max-w-[1250px] mx-auto pt-20">
        {/* 공통 헤더 */}
        <CommonHeader
          isAuthenticated={isAuthenticated}
          myNickname={myNickname}
          nicknameModalOpen={nicknameModalOpen}
          setNicknameModalOpen={setNicknameModalOpen}
          checkAuthStatus={checkAuthStatus}
        />
        <div className="relative w-full pt-[5%] mb-10 text-center">
          <div className="flex items-center justify-center mb-5">
            <h2 className="text-3xl font-bold">뮤지컬</h2>
            <div className="relative inline-block ml-2">
              <button
                className="px-4 py-2 rounded flex items-center"
                style={{ color: "#E3651D" }}
                onClick={toggleDropdown}
              >
                전체보기 <FaChevronDown className="ml-2" />
              </button>
              {showDropdown && (
                <div
                  className="absolute left-0 mt-1 w-48 border border-gray-300 rounded shadow-lg z-50 bg-white"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <ul className="text-left">
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.category}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 정렬 옵션 */}
        <div className="flex justify-center items-center mb-5 space-x-5 text-lg">
          {["전체", "신상품순", "종료임박순", "상품명순"].map((option) => (
            <div
              key={option}
              className={`cursor-pointer ${
                sortOption === option
                  ? "font-bold border-b-2 border-orange-500"
                  : ""
              }`}
              onClick={() => setSortOption(option)}
            >
              {option}
            </div>
          ))}
        </div>

        {/* 예매 가능한 공연 수 표시 */}
        <div className="text-center mb-5">
          <span>현재 예매 가능한 공연은 총 </span>
          <span style={{ color: "#E3651D" }}>{sortedMusicals.length}개</span>
          <span> 입니다.</span>
        </div>

        {/* 뮤지컬 그리드 */}
        <div className="max-w-[1250px] mx-auto p-5 grid grid-cols-5 gap-4">
          {sortedMusicals.map((musical) => (
            <div
              key={musical.id}
              className="text-black p-2.5 rounded flex flex-col items-center cursor-pointer overflow-hidden"
              onClick={() => handleClick(musical.id)}
            >
              <div className="relative w-full h-80">
                <img
                  src={musical.imageUrl}
                  alt={musical.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="text-center mt-2 font-bold">{musical.title}</div>
              <div className="text-center mt-1">
                {formatDate(musical.startDate)} ~ {formatDate(musical.endDate)}
              </div>
              <div className="text-center mt-1">{musical.venue}</div>
            </div>
          ))}
        </div>

        {/* 푸터 */}
        <footer className="w-full bg-gray-100 text-center py-2.5 border-t border-gray-300">
          <p>© {new Date().getFullYear()} Musical Spot. All rights reserved.</p>
        </footer>
      </div>
    </HeaderProvider>
  );
};

export default AllCategoryPage;