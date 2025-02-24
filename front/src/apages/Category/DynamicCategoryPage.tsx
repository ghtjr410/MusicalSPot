import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa"; // 드롭다운 아이콘 import
import CommonHeader from "acomponents/header/CommonHeader"; // 공통 헤더 컴포넌트 import
import CommonFooter from "acomponents/footer/CommonFooter";
import { useAuth } from "hooks/useAuthHook"; // 인증 훅 import
import { HeaderProvider } from "services/HeaderService/HeaderService"; // 헤더 서비스 import
import {
  CATEGORY_MUSICAL,
  CATEGORY_LIST,
  MUSICAL_DETAILS_INCREMENT_VIEW,
} from "utils/APIUrlUtil/apiUrlUtil"; // API URL 유틸리티 import

// 뮤지컬 데이터 인터페이스 정의
interface Musical {
  id: number;
  title: string;
  startDate?: string;
  endDate?: string;
  viewCount?: number;
  imageUrl: string;
  venue: string;
}

// 카테고리 데이터 인터페이스 정의
interface Category {
  id: string;
  category: string;
}

// 특정 카테고리의 뮤지컬 데이터를 불러오는 함수
const categoryMusical = async (categoryId: string): Promise<Musical[]> => {
  try {
    const result = await axios.get(CATEGORY_MUSICAL(categoryId));
    console.log("Category API Response:", result.data);

    if (Array.isArray(result.data.data)) {
      return result.data.data;
    } else {
      console.error("Unexpected response format:", result.data);
      return [];
    }
  } catch (error) {
    console.error("Error", error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

// 카테고리 데이터를 불러오는 함수
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

// 조회수 증가 함수
const musicalDetailsIncrementView = async (musicalId: string) => {
  try {
    const result = await axios.get(MUSICAL_DETAILS_INCREMENT_VIEW(musicalId));
    return result.data;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
};

// DynamicCategoryPage 컴포넌트 정의
const DynamicCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>(); // URL에서 카테고리 ID를 가져옴
  const [musicals, setMusicals] = useState<Musical[]>([]); // 뮤지컬 데이터 상태
  const [categories, setCategories] = useState<Category[]>([]); // 카테고리 데이터 상태
  const [showDropdown, setShowDropdown] = useState(false); // 드롭다운 메뉴 상태
  const [sortOption, setSortOption] = useState(""); // 정렬 옵션 상태
  const [categoryName, setCategoryName] = useState(""); // 선택된 카테고리 이름 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 훅
  const [currentCategoryId, setCurrentCategoryId] = useState<
    string | undefined
  >("");
  const location = useLocation();

  // 사용자 인증 정보와 관련된 상태 및 함수
  const {
    isAuthenticated,
    myNickname,
    nicknameModalOpen,
    setNicknameModalOpen,
    checkAuthStatus,
  } = useAuth();

  // 특정 카테고리의 뮤지컬 데이터를 불러오는 함수 호출
  const fetchMusicals = async (categoryId: string) => {
    const response = await categoryMusical(categoryId);
    setMusicals(response);
    console.log("Musicals Data:", response);
  };

  // 카테고리 데이터를 불러오는 함수 호출
  const fetchCategories = async () => {
    try {
      const response = await categoryList();
      setCategories(response);
      // 카테고리 ID가 있을 경우 해당 카테고리 이름 설정
      // if (categoryId) {
      //   const selectedCategory = response.find(
      //     (category) => category.id === categoryId
      //   );
      //   setCategoryName(
      //     selectedCategory ? selectedCategory.category : "뮤지컬"
      //   );
      // }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 컴포넌트가 마운트될 때 카테고리 데이터 불러오기
  useEffect(() => {
    fetchCategories();
  }, []);

  // 카테고리 ID가 변경될 때마다 뮤지컬 데이터 불러오기
  useEffect(() => {
    if (categories.length > 0 && categoryId) {
      console.log(`Fetching musicals for category: ${categoryId}`);
      fetchMusicals(categoryId);
    }
  }, [categories, categoryId]);

  // 카테고리 데이터가 변경될 때마다 선택된 카테고리 이름 설정
  useEffect(() => {
    if (categories.length > 0 && categoryId) {
      const selectedCategory = categories.find(
        (category) => category.id === categoryId
      );
      if (selectedCategory) {
        setCategoryName(selectedCategory.category);
      }
    }
  }, [categories, currentCategoryId]);

  useEffect(() => {
    const currentCategoryId = location.pathname.split("/").pop();
    switch (currentCategoryId) {
      case "all":
        setCategoryName("전체보기");
        break;
      case "1":
        setCategoryName("라이선스");
        break;
      case "2":
        setCategoryName("오리지널");
        break;
      case "3":
        setCategoryName("창작");
        break;
      case "4":
        setCategoryName("넌버벌 퍼포먼스");
        break;
      default:
        setCategoryName("전체보기");
        break;
    }
  }, [location]);

  // 이미지 클릭 핸들러
  const handleClick = async (id: number) => {
    try {
      const result = await musicalDetailsIncrementView(id.toString()); // 조회수 증가 함수 호출
      console.log("View Count Increment Response:", result); // 결과 콘솔 출력
      navigate(`/details/${id}`); // DetailPage로 이동
    } catch (error) {
      console.error("Error incrementing view count:", error);
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

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // 드롭다운에서 카테고리 선택 시 실행되는 함수
  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setCategoryName(categoryName); // 선택한 카테고리 이름 설정
    setShowDropdown(false); // 드롭다운 메뉴 닫기
    navigate(`/category/${categoryId}`); // 선택한 카테고리로 페이지 이동
  };

  // 드롭다운에서 전체보기를 선택 시 실행되는 함수
  const handleAllCategoriesSelect = () => {
    setCategoryName("전체보기"); // 선택한 카테고리 이름을 전체보기로 설정
    setShowDropdown(false); // 드롭다운 메뉴 닫기
    navigate(`/category/all`); // 모든 카테고리를 보는 페이지로 이동
  };

  // 정렬 옵션에 따라 뮤지컬 데이터를 정렬하는 함수
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

  // 선택된 정렬 옵션에 따라 뮤지컬 데이터 정렬
  const sortedMusicals = sortMusicals(musicals, sortOption);

  return (
    <HeaderProvider>
      <div className="max-w-[1250px] mx-auto pt-20">
        {/* 공통 헤더 컴포넌트 */}
        <CommonHeader
          isAuthenticated={isAuthenticated}
          myNickname={myNickname}
          nicknameModalOpen={nicknameModalOpen}
          setNicknameModalOpen={setNicknameModalOpen}
          checkAuthStatus={checkAuthStatus}
        />
        <div className="relative w-full pt-[5%] mb-10 text-center">
          <div className="flex items-center justify-center mb-5">
            <h2 className="text-3xl font-bold">
              뮤지컬{" "}
              <span style={{ color: "#E3651D" }}> &gt; {categoryName}</span>
            </h2>
            <div className="relative inline-block ml-2">
              <button
                className="px-4 py-2 rounded flex items-center"
                style={{ color: "#E3651D" }}
                onClick={toggleDropdown}
              >
                {categoryName} <FaChevronDown className="ml-2" />
              </button>
              {showDropdown && (
                <div
                  className="absolute left-0 mt-1 w-48 border border-gray-300 rounded shadow-lg z-50 bg-white"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  <ul className="text-left">
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleAllCategoriesSelect}
                    >
                      전체보기
                    </li>
                    {categories.map((category) => (
                      <li
                        key={category.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleCategorySelect(category.id, category.category)
                        }
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

        {/* 정렬 옵션 섹션 */}
        <div className="flex justify-center items-center mb-5 space-x-5 text-lg">
          {[" ", "신상품순", "종료임박순", "상품명순"].map((option) => (
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

        {/* 그리드 섹션 */}
        <div
          className="p-5 grid grid-cols-5 gap-4"
          style={{ maxWidth: "1250px", margin: "auto" }}
        >
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
      </div>
      {/* 공통 푸터 컴포넌트 */}
      <CommonFooter />
    </HeaderProvider>
  );
};

export default DynamicCategoryPage;
