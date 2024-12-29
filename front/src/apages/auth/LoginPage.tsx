import React, { useEffect, useRef, useState } from 'react';
import AuthInputComponent from 'acomponents/auth/AuthInputComponent';
import AuthButton from 'acommons/auth/AuthButton';
import AuthDivider from 'acommons/auth/AuthDivider';
import SNSLoginSection from 'acomponents/auth/SNSLoginComponent';
// import SaveUsernameSection from 'sections/SaveUsernameSection/SaveUsernameSection';
// import UserInfoLinksSection from 'sections/UserInfoLinksSection/UserInfoLinksSection';
import { 
  handleLogin as handleLoginService, 
  handleUsernameChange, 
  handlePasswordChange, 
  handleUsernameKeyDown, 
  handlePasswordKeyDown 
} from 'services/SignInService/signInService';
import useSignInResponse from 'services/SignInService/signInResponseService';
import HomeButton from 'acommons/auth/HomeButton';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
import musicalSpotLogo from 'assets/images/musical-spot-logo.png';
import { useAuth } from 'hooks/useAuthHook';

const LoginPage: React.FC = () => {
  const { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const { navigateToSignUp, navigateToHome } = useNavigateHelper(); 
  const { signInResponse } = useSignInResponse();

  useEffect(() => {
    console.log("Running checkAuthStatus on mount..." + isAuthenticated);
    if(isAuthenticated){
      console.log("홈으로가라")
      navigateToHome();
    }
    
  }, [isAuthenticated]);

  const handleLogin = () => {
    handleLoginService(username, password, setUsernameError, setPasswordError, usernameRef, signInResponse);
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">        
    <div className="bg-white w-full max-w-xl h-auto md:h-3/4 flex justify-center items-center rounded shadow-md">
      <div className=" p-6  w-96">
        <div className="flex items-center justify-center mb-4">
          <div className="flex flex-col items-center gap-8">
          <div
            className="text-2xl max-w-40 max-h-40 font-bold cursor-pointer pl-5"
            onClick={navigateToHome}
          >
            <img src={musicalSpotLogo} alt="Musical Spot-logo" className="scale-125 hover:animate-pulse"/>
          </div>
          <h2 className="text-2xl font-semibold text-signature mt-4">로그인</h2>
        </div>
      </div>
        <AuthInputComponent
          value={username}
          onChange={(e) => handleUsernameChange(e, setUsername, setUsernameError)}
          onKeyDown={(e) => handleUsernameKeyDown(e, username, setUsernameError, passwordRef)}
          showLabel={true}
          labelText="아이디"
          placeholderText="아이디를 입력하세요"
          errorText={usernameError}
          inputRef={usernameRef} // usernameRef 추가
        />
        <AuthInputComponent
          value={password}
          onChange={(e) => handlePasswordChange(e, setPassword, setPasswordError)}
          onKeyDown={(e) => handlePasswordKeyDown(e, handleLogin)}
          showLabel={true}
          labelText="비밀번호"
          placeholderText="비밀번호를 입력하세요"
          inputType="password"
          inputRef={passwordRef} // passwordRef 추가
          errorText={passwordError}
        />
        <div className="flex justify-between items-center mt-4">
          {/* <SaveUsernameSection />
          <UserInfoLinksSection /> */}
        </div>
        <AuthButton text="로그인" onClick={handleLogin} className="mt-4" />
        <div className="my-2"></div>
        <AuthButton text="회원가입" onClick={navigateToSignUp} variant="secondary" />
        {/* <AuthDivider /> */}
        <SNSLoginSection />
      </div>
      </div>
    </div>
  );
};

export default LoginPage;
