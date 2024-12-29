
import { ResponseBody } from 'utils/TypeUtil';
import { SignInResponseDto } from 'utils/DtoUtil/response/auth';
import { ResponseCode } from 'utils/TypeUtil/enums';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
import { setCookie } from 'utils/CookieUtil/cookieUtis';

const useSignInResponse = () => {
  const { navigateToHome } = useNavigateHelper();

  const signInResponse = (responseBody: ResponseBody<SignInResponseDto>) => {
    if (!responseBody) return;

    const { code } = responseBody;
    if (code === ResponseCode.VAILDATION_FAIL) {
      alert('아이디와 비밀번호를 입력하세요.');
      return;
    }
    if (code === ResponseCode.SIGN_IN_FAIL) {
      alert('로그인정보가 일치하지 않습니다.');
      return;
    }
    if (code === ResponseCode.DATABASE_ERROR) {
      alert('올바른 아이디와 비밀번호인지 확인해주세요.');
      return;
    }
    if (code !== ResponseCode.SUCCEESS) {
      console.error('Response code is not success:', code);
      return;
    }

    const { accessToken, accessTokenExpirationTime, refreshToken, refreshTokenExpirationTime } = responseBody as SignInResponseDto;
    setCookie('accessToken', accessToken, { expires: new Date(accessTokenExpirationTime), path: '/' });
    setCookie('refreshToken', refreshToken, { expires: new Date(refreshTokenExpirationTime), path: '/' });
    navigateToHome();
  };

  return { signInResponse };
};

export default useSignInResponse;