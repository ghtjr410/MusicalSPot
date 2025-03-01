// services/Auth/logOutService.ts
import axios from 'axios';
import { getCookie } from 'utils/CookieUtil/cookieUtis';
import { LOGOUT_URL } from 'utils/APIUrlUtil/apiUrlUtil';

export const combinedLogoutHandler = async (navigateToHome: () => void) => {
  const accessToken = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');

  if (accessToken || refreshToken) {
    // console.log('Tokens found:', { accessToken, refreshToken });
    const result = await logout(accessToken || null, refreshToken || null);
    if (!result) {
      navigateToHome();
    }
    return result;
  } else {
    // console.error('토큰이 없음');
    navigateToHome();
    return false;
  }
};

const logout = (accessToken: string | null, refreshToken: string | null) => {
  const headers: Record<string, string> = {};

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  if (refreshToken) {
    headers['Refresh-Token'] = refreshToken;
  }

  return axios.get(LOGOUT_URL(), {
    headers,
    withCredentials: true
  })
  .then((response) => {
    if (response.status === 200) {
      // console.log("로그아웃 성공");
      return true;  // 성공 시 true 반환
    } else {
      // console.error("로그아웃 실패");
      return false;
    }
  })
  .catch((error) => {
    // console.error("로그아웃 실패", error);
    return false; // 실패 시 false 반환
  });
};