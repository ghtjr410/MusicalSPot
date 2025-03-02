import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SEARCH_MUSICALS_BY_TITLE,
  MUSICAL_DETAILS_INCREMENT_VIEW,
} from "utils/APIUrlUtil/apiUrlUtil";
import CommonHeader from "acomponents/header/CommonHeader";
import { HeaderProvider } from "services/HeaderService/HeaderService";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

// 날짜 형식을 변환하는 함수
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// 조회수 증가 함수
const musicalDetailsIncrementView = async (musicalId: string) => {
  try {
    const result = await axios.get(MUSICAL_DETAILS_INCREMENT_VIEW(musicalId));
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 검색 페이지 컴포넌트
const SearchPage: React.FC = () => {
  const query = useQuery(); // URL 쿼리 파라미터를 가져옴
  const searchQuery = query.get("query") || ""; // 'query' 파라미터의 값을 가져옴
  const [searchInput, setSearchInput] = useState<string>(searchQuery); // 검색 입력 상태
  const [searchResults, setSearchResults] = useState<any[]>([]); // 검색 결과 상태
  const [noResults, setNoResults] = useState<boolean>(false); // 검색 결과가 없는 경우를 위한 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  // API를 호출하여 뮤지컬을 제목으로 검색하는 함수
  const searchMusicalsByTitle = async (title: string) => {
    try {
      const result = await axios.get(SEARCH_MUSICALS_BY_TITLE(title)); // API 호출
      // console.log(result.data); // 검색 결과 콘솔 출력
      return result.data;
    } catch (error) {
      return { data: [], message: "No results found" }; // 에러 처리
    }
  };

  // 검색 입력 변경 시 호출되는 핸들러
  const handleSearchInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchInput(event.target.value);
  };

  // 검색 제출 시 호출되는 핸들러
  const handleSearchSubmit = async () => {
    navigate(`/search?query=${encodeURIComponent(searchInput)}`); // 검색어를 포함한 URL로 이동
    const results = await searchMusicalsByTitle(searchInput); // API 호출로 검색 결과 가져오기
    if (results.data.length === 0) {
      setNoResults(true); // 검색 결과가 없는 경우
    } else {
      setNoResults(false); // 검색 결과가 있는 경우
      setSearchResults(results.data); // 검색 결과 상태 업데이트
    }
    setSearchInput(""); // 검색 후 검색 입력란 초기화
  };

  // 입력 필드 클릭 시 호출되는 핸들러
  const handleInputClick = async () => {
    await handleSearchSubmit();
  };

  // 엔터 키를 눌렀을 때 호출되는 핸들러
  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      await handleSearchSubmit();
    }
  };

  // 돋보기 아이콘 클릭 시 호출되는 핸들러
  const handleIconClick = async () => {
    await handleSearchSubmit();
  };

  // 이미지 클릭 시 DetailPage로 이동하는 핸들러
  const handleImageClick = async (id: number) => {
    try {
      const result = await musicalDetailsIncrementView(id.toString()); // 조회수 증가 함수 호출
      // console.log("View Count Increment Response:", result); // 결과 콘솔 출력
      navigate(`/details/${id}`); // DetailPage로 이동
    } catch (error) {
      // console.error("Error incrementing view count:", error);
    }
  };

  // 컴포넌트가 마운트될 때 검색 입력란 초기화
  useEffect(() => {
    setSearchInput(""); // 검색 입력란 초기화
  }, []);

  // 컴포넌트가 마운트되거나 searchQuery가 변경될 때 호출되는 effect
  useEffect(() => {
    if (searchQuery) {
      (async () => {
        const results = await searchMusicalsByTitle(searchQuery); // API 호출로 검색 결과 가져오기
        if (results.data.length === 0) {
          setNoResults(true); // 검색 결과가 없는 경우
        } else {
          setNoResults(false); // 검색 결과가 있는 경우
          setSearchResults(results.data); // 검색 결과 상태 업데이트
        }
      })();
    }
  }, [searchQuery]);

  return (
    <HeaderProvider>
      <div className="max-w-[1250px] mx-auto pt-20">
        {/* 공통 헤더 컴포넌트 */}
        <CommonHeader
          isAuthenticated={false} // 적절한 props를 전달
          myNickname={null} // 적절한 props를 전달
          nicknameModalOpen={false} // 적절한 props를 전달
          setNicknameModalOpen={() => {}} // 적절한 props를 전달
          checkAuthStatus={() => {}} // 적절한 props를 전달
        />
        <div className="search-page p-4 bg-whit">
          <header className="search-header mb-8">
            <h1 className="text-2xl font-bold text-center mb-4">
              <span className="text-orange-500">'{searchQuery}'</span>에 대한
              검색 결과 입니다.
            </h1>
            <div className="flex justify-center items-center mb-8 border-b-2 border-gray-400 pb-2 mt-4">
              <div className="relative w-full max-w-lg">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onClick={handleInputClick} // 클릭 시 검색 기능 추가
                  onKeyDown={handleKeyDown} // 엔터 키 입력 시 검색 기능 추가
                  className="border-b border-gray-300 p-2 w-full focus:outline-none focus:ring-0"
                />
                <button
                  onClick={handleIconClick} // 돋보기 아이콘 클릭 시 검색 기능 추가
                  className="absolute right-0 top-0 mt-2 mr-2 border-none bg-transparent p-0"
                >
                  <FaSearch />
                </button>
              </div>
            </div>
          </header>
          <div className="search-results space-y-4">
            {noResults ? (
              <div className="no-results text-center text-gray-500">
                No results found
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((result) => (
                <div
                  key={result.id}
                  className="search-result-item flex items-center p-4 bg-white shadow-md rounded-lg border-b border-gray-200"
                >
                  <img
                    src={result.imageUrl}
                    alt={result.title}
                    className="w-32 h-32 object-contain mr-4 cursor-pointer" // 수정된 부분
                    onClick={() => handleImageClick(result.id)} // 이미지 클릭 시 DetailPage로 이동
                  />
                  <div className="flex-grow">
                    <h2 className="text-xl font-bold">{result.title}</h2>
                    <p>
                      {formatDate(result.startDate)} ~{" "}
                      {formatDate(result.endDate)}
                    </p>
                    <p>{result.venue}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results text-center text-gray-500">
                Loading...
              </div>
            )}
          </div>
        </div>
        {/* 공통 푸터 컴포넌트 */}
        <footer className="bg-gray-100 text-center py-2.5 border-t border-gray-300 mt-8">
          <p>© {new Date().getFullYear()} Musical Spot. All rights reserved.</p>
        </footer>
      </div>
    </HeaderProvider>
  );
};

export default SearchPage;
