import axios from "axios";
import { CREATE_REVIEW, DELETE_REVIEW, MUSICAL_REVIEWS, PRIVATE_REVIEW_DETAILS, PUBLIC_REVIEW_DETAILS, REVIEW_COMMENTS_CREATE, REVIEW_COMMENTS_DELETE, REVIEW_COMMENTS_UPDATE, REVIEW_DETAILS_INCREASE_VIEW, REVIEW_LIKE, REVIEWS_LIKES_40, REVIEWS_RECENT_40, REVIEWS_VIEWS_40, TOGGLE_REVIEW_LIKE, UPDATE_REVIEW } from "utils/APIUrlUtil/apiUrlUtil";
import { getCookie } from "utils/CookieUtil/cookieUtis";

// todo: 0802 환희님 뮤지컬 연관 리뷰
// 특정 뮤지컬에 대한 리뷰 목록 가져오기
export const MusicalReviews = async (musicalId: string) => {
  try {
      const result = await axios.get(MUSICAL_REVIEWS(musicalId));
      return result.data;
  } catch (error) {
      // console.error('Error', error);
      throw error;
  }
};

// 로그인 사용자 리뷰 게시글 정보
export const privateReviewDetails = async (reviewId: string) => {
    try{
        const result = await axios.get(PRIVATE_REVIEW_DETAILS(reviewId),{
            headers: {
                'Authorization': `Bearer ${getCookie('accessToken')}`
            },
            withCredentials: true
        });
        return result.data;
    } catch (error) {
        // console.error('Error', error);
        throw error;
    }
} 
// 비로그인 사용자 리뷰 게시글 정보
export const publicReviewDetails = async (reviewId: string) => {
    try{
        const result = await axios.get(PUBLIC_REVIEW_DETAILS(reviewId));
        return result.data;
    } catch (error) {
        // console.error('Error', error);
        throw error;
    }
} 
// 로그인 사용자 게시글 작성
export const createReview = async (title:string, content:string, musicalId:string) => {
    try {
      const result = await axios.post(
        CREATE_REVIEW(), 
        {
          title: title,
          content: content,
          musicalId: musicalId
        },
        {
          headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`
          },
          withCredentials: true
        }
      );
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 로그인 사용자 게시글 수정
  export const updateReview = async (reviewId:string, title:string, content:string, musicalId:string) => {
    try {
      const result = await axios.put(
        UPDATE_REVIEW(reviewId), 
        {
          title: title,
          content: content,
          musicalId: musicalId
        },
        {
          headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`
          },
          withCredentials: true
        }
      );
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 로그인 사용자 게시글 삭제
  export const deleteReview = async (reviewId:string) => {
    try {
      const result = await axios.delete(
        DELETE_REVIEW(reviewId), 
        {
          headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`
          },
          withCredentials: true
        }
      );
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 게시글 조회수 증가
  export const reviewDetailsIncreaseView = async (reviewId:string) => {
    try {
      const result = await axios.post(
        REVIEW_DETAILS_INCREASE_VIEW(reviewId));
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 로그인 사용자 게시글 댓글 작성
  export const reviewCommentsCreate = async (reviewId:string, content:string) => {
    try {
      const result = await axios.post(
        REVIEW_COMMENTS_CREATE(), 
        {
            reviewId: reviewId,
            content: content
        },
        {
          headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`
          },
          withCredentials: true
        }
      );
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 로그인 사용자 게시글 댓글 수정
  export const reviewCommentsUpdate = async (commentId:string, content:string) => {
    try {
      const result = await axios.put(
        REVIEW_COMMENTS_UPDATE(commentId), 
        {
            content: content
        },
        {
          headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`
          },
          withCredentials: true
        }
      );
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 로그인 사용자 게시글 댓글 삭제
  export const reviewCommentsDelete = async (commentId:string) => {
    try {
      const result = await axios.delete(
        REVIEW_COMMENTS_DELETE(commentId),
        {
          headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`
          },
          withCredentials: true
        }
      );
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 게시글 리스트 최신순 40개씩
  export const reviewRecent40 = async (page:number) => {
    try {
      const result = await axios.get(
        REVIEWS_RECENT_40(page));
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 게시글 리스트 좋아요높은순 40개씩
  export const reviewLikes40 = async (page:number) => {
    try {
      const result = await axios.get(
        REVIEWS_LIKES_40(page));
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 게시글 리스트 조회수높은순 40개씩
  export const reviewViews40 = async (page:number) => {
    try {
      const result = await axios.get(
        REVIEWS_VIEWS_40(page));
      return result.data;
    } catch (error) {
      // console.error('Error', error);
      throw error;
    }
  }

  // 게시글 상세보기 좋아요 누른적 있는지
export const reviewLike = async (reviewId: string) => {
    try{
        const result = await axios.get(REVIEW_LIKE(reviewId),{
            headers: {
                'Authorization': `Bearer ${getCookie('accessToken')}`
            },
            withCredentials: true
        });
        return result.data;
    } catch (error) {
        // console.error('Error', error);
        throw error;
    }
} 

// 게시글 상세보기 좋아요 클릭
export const toggleReviewLike = async (reviewId: string) => {
    try{
        const result = await axios.post(TOGGLE_REVIEW_LIKE(reviewId), {},{
            headers: {
                'Authorization': `Bearer ${getCookie('accessToken')}`
            },
            withCredentials: true
        });
        return result.data;
    } catch (error) {
        // console.error('Error', error);
        throw error;
    }
} 