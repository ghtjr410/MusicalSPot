import axios from "axios";
import {
  ALL_MUSICALS,
  CATEGORY_LIST,
  CATEGORY_MUSICAL,
  MUSICAL_CATEGORYID_SORTED_BY_END_DATE,
  MUSICAL_CATEGORYID_SORTED_BY_START_DATE,
  MUSICAL_CATEGORYID_SORTED_BY_TITLE,
  MUSICAL_CATEGORYID_SORTED_BY_VIEW_COUNT,
  MUSICAL_DETAILS,
  MUSICAL_DETAILS_INCREMENT_VIEW,
  MUSICAL_LIKE,
  MUSICAL_SORTED_BY_START_DATE,
  MUSICAL_SORTED_BY_VIEW_COUNT,
  SEARCH_MUSICALS_BY_TITLE,
  TOGGLE_MUSICAL_LIKE,
} from "utils/APIUrlUtil/apiUrlUtil";
import { getCookie } from "utils/CookieUtil/cookieUtis";



// 뮤지컬 카테고리 리스트 불러오기
export const categoryList = async () => {
  try {
    const result = await axios.get(CATEGORY_LIST());
    return result.data;
  } catch (error) {
    // console.error("Error ", error);
    throw error;
  }
};

// 제목으로 뮤지컬 검색 (검색창)
export const searchMusicalsByTitle = async (title: string) => {
  try {
    const result = await axios.get(SEARCH_MUSICALS_BY_TITLE(title));
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 선택 카테고리 뮤지컬 목록
export const categoryMusical = async (categoryId: string) => {
  try {
    const result = await axios.get(CATEGORY_MUSICAL(categoryId));
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 뮤지컬 최신 등록순 (메인) 7개
export const musicalSortedByStartDate = async () => {
  try {
    const result = await axios.get(MUSICAL_SORTED_BY_START_DATE());
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 뮤지컬 조회수순 (메인) 10개
export const musicalSortedByViewCount = async () => {
  try {
    const result = await axios.get(MUSICAL_SORTED_BY_VIEW_COUNT());
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// todo: All 눌렀을때 나오는 뮤지컬 전체목록나오는거 깜박하고 못했음
// 모든 뮤지컬
export const allMusicals = async () => {
  try {
    const result = await axios.get(ALL_MUSICALS());
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 해당 카테고리 뮤지컬 조회수순
export const musicalCategoryIdSortedByViewCount = async (
  categoryId: string
) => {
  try {
    const result = await axios.get(
      MUSICAL_CATEGORYID_SORTED_BY_VIEW_COUNT(categoryId)
    );
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 해당 카테고리 뮤지컬 종료임박순
export const musicalCategoryIdSortedByEndDate = async (categoryId: string) => {
  try {
    const result = await axios.get(
      MUSICAL_CATEGORYID_SORTED_BY_END_DATE(categoryId)
    );
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 해당 카테고리 뮤지컬 상품명순
export const musicalCategoryIdSortedByTitle = async (categoryId: string) => {
  try {
    const result = await axios.get(
      MUSICAL_CATEGORYID_SORTED_BY_TITLE(categoryId)
    );
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 해당 카테고리 뮤지컬 최신등록순
export const musicalCategoryIdSortedByStartDate = async (
  categoryId: string
) => {
  try {
    const result = await axios.get(
      MUSICAL_CATEGORYID_SORTED_BY_START_DATE(categoryId)
    );
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 뮤지컬 상세보기 + 예매처 + 티켓가격
export const musicalDetails = async (musicalId: string) => {
  try {
    const result = await axios.get(MUSICAL_DETAILS(musicalId));
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// 뮤지컬 상세보기 조회수 증가
export const musicalDetailsIncrementView = async (musicalId: string) => {
  try {
    const result = await axios.get(MUSICAL_DETAILS_INCREMENT_VIEW(musicalId));
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// todo: 여기서부터하자 어우 졸려
// ( 로그인사용자 ) 뮤지컬 상세보기 좋아요 누른적 있는지 (랜더링시)
export const musicalLike = async (musicalId: string) => {
  try {
    const result = await axios.get(MUSICAL_LIKE(musicalId), {
      headers: {
        Authorization: `Bearer ${getCookie("accessToken")}`,
      },
      withCredentials: true,
    });
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};

// ( 로그인사용자 ) 뮤지컬 상세보기 좋아요 클릭 (시점불분명)
export const toggleMusicalLike = async (musicalId: string) => {
  try {
    const result = await axios.post(
      TOGGLE_MUSICAL_LIKE(musicalId),
      {},
      {
        headers: {
          Authorization: `Bearer ${getCookie("accessToken")}`,
        },
        withCredentials: true,
      }
    );
    return result.data;
  } catch (error) {
    // console.error("Error", error);
    throw error;
  }
};
