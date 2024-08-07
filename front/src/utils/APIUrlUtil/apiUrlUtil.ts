// const DOMAIN = 'http://127.0.0.1:4040'; // 로컬에서 실행하기/
const DOMAIN = 'https://musicalspot-server2.azurewebsites.net';
const API_DOMAIN = `${DOMAIN}/api/v1`;



//OAuth2 관련
export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver') => `${API_DOMAIN}/auth/oauth2/${type}`;
export const SNS_DEVICE_INFO = () => `${API_DOMAIN}/device-info`;
// http://127.0.0.1:4040/api/v1/device-info

// 인증상태관리 관련
export const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
export const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
export const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
export const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
export const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;
export const NICKNAME_CHECK_URL = () => `${API_DOMAIN}/nickname-check`;
export const NICKNAME_CREATE_URL = () => `${API_DOMAIN}/nickname-create`;
export const NICKNAME_FIND_URL = () => `${API_DOMAIN}/nickname-find`;
export const LOGOUT_URL = () => `${API_DOMAIN}/logout`;
export const REFRESH_TOKEN_URL = () => `${API_DOMAIN}/refresh-token`;
export const ACCESS_URL = () => `${API_DOMAIN}/access`;
// todo: 회원탈퇴는 아직 X
export const POST_DELETE_ACCOUNT = () => `${API_DOMAIN}/delete`;
export const USER_INFO = () => `${API_DOMAIN}/user-info`;
export const CHANGE_PASSWORD = () => `${API_DOMAIN}/change-password`;


export const SEARCH_MUSICALS_BY_TITLE = (title: string) => `${API_DOMAIN}/public/musical/search-by-title?title=${title}`;
export const CATEGORY_LIST = () => `${API_DOMAIN}/public/category-list`;
export const CATEGORY_MUSICAL = (categoryId : string) => `${API_DOMAIN}/public/category-musical/${categoryId}`;
export const MUSICAL_SORTED_BY_START_DATE = () => `${API_DOMAIN}/public/category-musical/sorted-by-start-date`;
export const MUSICAL_SORTED_BY_VIEW_COUNT = () => `${API_DOMAIN}/public/category-musical/sorted-by-view-count`;
export const ALL_MUSICALS = () => `${API_DOMAIN}/public/category-musical/all`;

export const MUSICAL_CATEGORYID_SORTED_BY_VIEW_COUNT = (categoryId : string) => `${API_DOMAIN}/public/category-musical/${categoryId}/sorted-by-view-count`;
export const MUSICAL_CATEGORYID_SORTED_BY_END_DATE = (categoryId : string) => `${API_DOMAIN}/public/category-musical/${categoryId}/sorted-by-end-date`;
export const MUSICAL_CATEGORYID_SORTED_BY_TITLE = (categoryId : string) => `${API_DOMAIN}/public/category-musical/${categoryId}/sorted-by-title`;
export const MUSICAL_CATEGORYID_SORTED_BY_START_DATE = (categoryId : string) => `${API_DOMAIN}/public/category-musical/${categoryId}/sorted-by-start-date`;
export const MUSICAL_DETAILS = (musicalId : string) => `${API_DOMAIN}/public/musical-details/${musicalId}`;
export const MUSICAL_DETAILS_INCREMENT_VIEW = (musicalId : string) => `${API_DOMAIN}/public/musical-details/increment-view/${musicalId}`;
export const MUSICAL_LIKE =(musicalId : string) => `${API_DOMAIN}/private/musical-like/${musicalId}`;
export const TOGGLE_MUSICAL_LIKE = (musicalId : string) => `${API_DOMAIN}/private/toggle-musical-like/${musicalId}`;


export const PRIVATE_REVIEW_DETAILS = (reviewId : string) => `${API_DOMAIN}/private/review-details/${reviewId}`;
export const PUBLIC_REVIEW_DETAILS = (reviewId : string) => `${API_DOMAIN}/public/review-details/${reviewId}`;
export const CREATE_REVIEW = () => `${API_DOMAIN}/private/create-review`;
export const UPDATE_REVIEW = (reviewId : string) => `${API_DOMAIN}/private/update-review/${reviewId}`;
export const DELETE_REVIEW = (reviewId : string) => `${API_DOMAIN}/private/delete-review/${reviewId}`;
export const REVIEW_DETAILS_INCREASE_VIEW = (reviewId : string) => `${API_DOMAIN}/public/review-details/increase-view/${reviewId}`;
export const REVIEW_COMMENTS_CREATE = () => `${API_DOMAIN}/private/review/comments/create`;
export const REVIEW_COMMENTS_UPDATE = (commentId : string) => `${API_DOMAIN}/private/review/comments/update/${commentId}`;
export const REVIEW_COMMENTS_DELETE = (commentId : string) => `${API_DOMAIN}/private/review/comments/delete/${commentId}`;
export const REVIEWS_RECENT_40 = (page :number) => `${API_DOMAIN}/public/reviews/recent?page=${page}`;
export const REVIEWS_LIKES_40 = (page :number) => `${API_DOMAIN}/public/reviews/likes?page=${page}`;
export const REVIEWS_VIEWS_40 = (page :number) => `${API_DOMAIN}/public/reviews/views?page=${page}`;
export const REVIEW_LIKE = (reviewId : string) => `${API_DOMAIN}/private/review-like/${reviewId}`;
export const TOGGLE_REVIEW_LIKE = (reviewId : string) => `${API_DOMAIN}/private/toggle-review-like/${reviewId}`;
// todo: 0802 환희님 뮤지컬 연관 리뷰
export const MUSICAL_REVIEWS = (musicalId: string) => `${API_DOMAIN}/public/musical/${musicalId}/reviews`;

export const SOCKET_MAINADDRESS = () => `${DOMAIN}/ws`;
export const REDIRECT_SIGN_IN = () => `${API_DOMAIN}/auth/sign-in`;
