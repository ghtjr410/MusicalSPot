import axios, { AxiosResponse } from "axios";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, IdCheckRequestDto, SignInRequestDto, SignUpRequestDto, NicknameRequestDto } from "utils/DtoUtil/request/auth";
import { CheckCertificationResponseDto, EmailCertificationResponseDto, IdCheckResponseDto, SignInResponseDto, SignUpResponseDto } from "utils/DtoUtil/response/auth";
import { ResponseDto } from "utils/DtoUtil/response";
import NicknameResponseDto from "utils/DtoUtil/response/auth/nickname.response.dto";
import { getDeviceInfo } from "utils/DeviceInfoUtil/deviceInfoUtil";
import { getCookie, setCookie } from "utils/CookieUtil/cookieUtis";
import { SIGN_IN_URL, SIGN_UP_URL, ID_CHECK_URL, EMAIL_CERTIFICATION_URL, CHECK_CERTIFICATION_URL, NICKNAME_CHECK_URL, NICKNAME_CREATE_URL, NICKNAME_FIND_URL, LOGOUT_URL, REFRESH_TOKEN_URL, ACCESS_URL, POST_DELETE_ACCOUNT, USER_INFO, CHANGE_PASSWORD} from "utils/APIUrlUtil/apiUrlUtil";

const responseHandler = <T> (response: AxiosResponse<any,any>) => {
    const responseBody: T = response.data;
    return responseBody;
}

const errorHandler = (error: any) => {
    // console.error('API Request Error:', error);
    if (error.response && error.response.data) {
        const responseBody: ResponseDto = error.response.data;
        return responseBody;
    } else {
        return null;
    }
}

export const signInRequest = async (requestBody: SignInRequestDto) => {
    const result = await axios.post(SIGN_IN_URL(), requestBody)
        .then(responseHandler<SignInResponseDto>)
        .catch(errorHandler);
    return result;
}
/////////////////////////////////////////////////////////////////////////
export const signUpRequest = async (requestBody: SignUpRequestDto) => {
    const result = await axios.post(SIGN_UP_URL(), requestBody)
        .then(responseHandler<SignUpResponseDto>)
        .catch(errorHandler);
    return result;
};

export const idCheckRequest = async (requestBody: IdCheckRequestDto) => {
    const result = await axios.post(ID_CHECK_URL(), requestBody)
        .then(responseHandler<IdCheckResponseDto>)
        .catch(errorHandler);
    return result;
};

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {
    const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<EmailCertificationResponseDto>)
        .catch(errorHandler);
    return result;
};

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
    const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
        .then(responseHandler<CheckCertificationResponseDto>)
        .catch(errorHandler);
    return result;

};

export const checkNicknameRequest = async (requestBody: NicknameRequestDto) => {
    const result = await axios.post(NICKNAME_CHECK_URL(), requestBody, {
        headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`
        }
    })
    .then(responseHandler<NicknameResponseDto>)
    .catch(errorHandler);
    return result;
};

export const createNicknameRequest = async (requestBody: NicknameRequestDto) => {
    const result = await axios.post(NICKNAME_CREATE_URL(), requestBody, {
        headers: {
            Authorization: `Bearer ${getCookie('accessToken')}`
        }
    })
    .then(responseHandler<NicknameResponseDto>)
    .catch(errorHandler);
    return result;
};

// 닉네임 있는지 없는지
export const findNicknameRequest = async () => {
  const result = await axios.post(NICKNAME_FIND_URL(), {}, {
      headers: {
          Authorization: `Bearer ${getCookie('accessToken')}`
      }
  })
  .then(response => response.data)
  .catch(error => {
      // console.error('Error finding nickname', error);
      return null;
  });
  return result;
};

export const deleteAccount = async (nickname:string) => {
  const result = await axios.post(POST_DELETE_ACCOUNT(), 
  {nickname}, 
  {
      headers: {
          Authorization: `Bearer ${getCookie('accessToken')}`
      }
  })
  .then(response => response.data)
  .catch(error => {
      // console.error('Error finding nickname', error);
      throw error;
  });
  return result;
};

export const userInfo = async () => {
  const result = await axios.get(USER_INFO(),
  {
    headers: {
      Authorization: `Bearer ${getCookie('accessToken')}`
    }
  })
  .then(response => response.data)
  .catch(error => {
    // console.error('Error finding nickname', error);
    return null;
  })
  return result;
}

export const changePassword = async (newPassword: string) => {
  const result = await axios.post(CHANGE_PASSWORD(),
  {newPassword},
  {
    headers: {
      Authorization: `Bearer ${getCookie('accessToken')}`
    }
  })
  .then(response => response.data)
  .catch(error => {
    // console.error('Error finding nickname', error);
    return null;
  })
  return result;
}


  export const combinedLogoutHandler = async (navigateToHome: () => void) => {
    const accessToken: string | undefined = getCookie('accessToken');
    const refreshToken: string | undefined = getCookie('refreshToken');
  
    if (accessToken || refreshToken) {
      // console.log('Tokens found:', { accessToken, refreshToken });
      const result = await combinedLogout(accessToken || null, refreshToken || null, navigateToHome);
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

  const combinedLogout = (accessToken: string | null, refreshToken: string | null, navigateToHome: () => void) => {
    const headers: any = {};
  
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  
    if (refreshToken) {
      headers['Refresh-Token'] = refreshToken;
    }
  
    return axios.get(LOGOUT_URL(), {
      headers: headers,
      withCredentials: true
    })
    .then((response) => {
      if (response.status === 200) {
        // console.log("로그아웃 성공");
        return true;  // 성공 시 true 반환
      } else {
        // console.error("로그아웃 실패");
        navigateToHome();
        return false;
      }
    })
    .catch((error) => {
      // console.error("로그아웃 실패", error);
      navigateToHome();
      return false; // 실패 시 false 반환
    });
  };

  const refreshTokenRequest = (refreshToken: string, deviceInfo: string) => {
    const requestBody = { deviceInfo, ipAddress: '' };
  
    return axios.post(REFRESH_TOKEN_URL(), requestBody, {
      headers: { 'Authorization': `Bearer ${refreshToken}` },
      withCredentials: true
    })
    .then((response) => {
      const { accessToken, refreshToken: newRefreshToken, accessTokenExpirationTime, refreshTokenExpirationTime } = response.data;
      
      const accessTokenExpires = new Date(accessTokenExpirationTime);
      const refreshTokenExpires = new Date(refreshTokenExpirationTime);
  
      setCookie('accessToken', accessToken, { expires: accessTokenExpires, path: '/' });
      setCookie('refreshToken', newRefreshToken, { expires: refreshTokenExpires, path: '/' });
      return accessToken;
    })
    .catch((error) => {
      // console.error("토큰 갱신 실패", error);
      return null;
    });
  };
  
  const handleTokenRefresh = (refreshToken: string, deviceInfo: string, navigateToMyblog: () => void, setSignInModalOpen: (value: boolean) => void) => {
    return refreshTokenRequest(refreshToken, deviceInfo)
      .then((newAccessToken) => {
        // console.log("새로운 엑세스 토큰:", newAccessToken);
        if (newAccessToken) {
          navigateToMyblog();
        } else {
          // console.error('리프레쉬 토큰 갱신 실패');
          setSignInModalOpen(true);
        }
        return newAccessToken;
      })
      .catch((error) => {
        // console.error('리프레쉬 토큰 갱신 실패', error);
        setSignInModalOpen(true);
        return null;
      });
  };
  
  const checkAccessToken = (accessToken: string) => {
    // console.log('엑세스토큰 보내기전 :', accessToken);
    return axios.get(ACCESS_URL(), {
      headers: { 'Authorization': `Bearer ${accessToken}` },
      withCredentials: true
    })
    .then((response) => {
      // console.log("로그인 사용자");
      return response.status === 200;
    })
    .catch((error) => {
      // console.error("엑세스 토큰 인증 실패", error);
      return false;
    });
  };
  
  export const onHomeButtonClickHandler = (navigateToMyblog: () => void, setSignInModalOpen: (value: boolean) => void) => {
    const accessToken: string | undefined = getCookie('accessToken');
    const refreshToken: string | undefined = getCookie('refreshToken');
    const deviceInfo = getDeviceInfo();
  
    if (accessToken) {
      checkAccessToken(accessToken)
        .then((isValid) => {
          if (isValid) {
            navigateToMyblog();
          } else {
            if (refreshToken) {
              handleTokenRefresh(refreshToken, deviceInfo, navigateToMyblog, setSignInModalOpen);
            } else {
              // console.error('비로그인!');
              setSignInModalOpen(true);
            }
          }
        })
        .catch(() => {
          // console.error('비로그인!');
          setSignInModalOpen(true);
        });
    } else if (refreshToken) {
      handleTokenRefresh(refreshToken, deviceInfo, navigateToMyblog, setSignInModalOpen);
    } else {
      // console.error('비로그인!');
      setSignInModalOpen(true);
    }
  };
 