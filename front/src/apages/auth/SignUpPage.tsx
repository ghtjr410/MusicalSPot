import React, { useEffect, useRef, useState } from 'react';
import AuthInputComponent from 'acomponents/auth/AuthInputComponent';
import AuthButton from 'acommons/auth/AuthButton';
import AuthDivider from 'acommons/auth/AuthDivider';
import SNSLoginSection from 'acomponents/auth/SNSLoginComponent';
import { onIdChangeHandler, onIdKeyDownHandler, onIdButtonClickHandler, validateUsernameFormat } from 'services/SignUpService/checkUsernameService';
import { validPasswordFormat, onPasswordChangeHandler, onPasswordCheckChangeHandler, onPasswordKeyDownHandler, onPasswordCheckKeyDownHandler } from 'services/SignUpService/passwordService';
import { onEmailChangeHandler, onEmailKeyDownHandler, onEmailButtonClickHandler } from 'services/SignUpService/emailService';
import { onCertificationNumberKeyDownHandler, onCertificationNumberButtonClickHandler, onCertificationNumberChangeHandler } from 'services/SignUpService/certificationService';
import { onSignUpButtonClickHandler } from 'services/SignUpService/signUpService'; // Import the signUp service
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
import HomeButton from 'acommons/auth/HomeButton';
import Modal from 'components/Modal/Modal';
import musicalSpotLogo from 'assets/images/musical-spot-logo.png';
import { useAuth } from 'hooks/useAuthHook';

const SignUpPage: React.FC = () => {
  const { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [certificationNumber, setCertificationNumber] = useState('');
  const [idMessage, setIdMessage] = useState('');
  const [idError, setIdError] = useState(false);
  const [idCheck, setIdCheck] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [certificationNumberMessage, setCertificationNumberMessage] = useState('');
  const [certificationNumberError, setCertificationNumberError] = useState(false);
  const [certificationCheck, setCertificationCheck] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const verificationCodeRef = useRef<HTMLInputElement | null>(null);

  const { navigateToLogin, navigateToHome } = useNavigateHelper(); 

  const usernameErrorType = !validateUsernameFormat(username) ? 'smallError' : idError ? 'error' : 'success';
  const passwordErrorType = !validPasswordFormat(password) ? 'smallError' : passwordMessage === '사용 가능한 비밀번호입니다.' ? 'success' : 'error';
  const passwordCheckErrorType = password !== confirmPassword ? 'error' : 'success';
  const emailErrorType = emailError ? 'error' : 'success';
  const certificationNumberErrorType = certificationNumberError ? 'error' : 'success';
  const handleSignUpSuccess = () => {
    setSuccessModalOpen(true);
  };
  useEffect(() => {
    console.log("Running checkAuthStatus on mount..." + isAuthenticated);
    if(isAuthenticated){
      console.log("홈으로가라")
      navigateToHome();
    }
    
  }, [isAuthenticated]);

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
          <h2 className="text-2xl font-semibold text-signature mt-4">회원가입</h2>
        </div>
      </div>
      <AuthInputComponent
        value={username}
        onChange={(e) => onIdChangeHandler(e, setUsername, setIdMessage, setIdCheck, setIdError)}
        onButtonClick={() => onIdButtonClickHandler(username, setIdError, setIdMessage, setIdCheck, usernameRef, passwordRef)}
        onKeyDown={(e) => onIdKeyDownHandler(e, () => onIdButtonClickHandler(username, setIdError, setIdMessage, setIdCheck, usernameRef, passwordRef))}
        showLabel={true}
        labelText="아이디 확인"
        buttonText="중복 확인"
        placeholderText="아이디를 입력하세요"
        errorText={idMessage}
        errorType={usernameErrorType}
        inputRef={usernameRef}
      />
      <AuthInputComponent
        value={password}
        onChange={(e) => onPasswordChangeHandler(e, setPassword, setPasswordMessage)}
        onKeyDown={(e) => onPasswordKeyDownHandler(e, passwordCheckRef, password, setPasswordMessage)}
        showLabel={true}
        labelText="비밀번호"
        placeholderText="비밀번호를 입력하세요"
        inputType="password"
        inputRef={passwordRef}
        errorText={passwordMessage}
        errorType={passwordErrorType}
      />
      <AuthInputComponent
        value={confirmPassword}
        onChange={(e) => onPasswordCheckChangeHandler(e, setConfirmPassword, setConfirmPasswordMessage)}
        onKeyDown={(e) => onPasswordCheckKeyDownHandler(e, emailRef, password, confirmPassword, setConfirmPasswordMessage)}
        showLabel={true}
        labelText="비밀번호 확인"
        placeholderText="비밀번호를 다시 입력하세요"
        inputType="password"
        inputRef={passwordCheckRef}
        errorText={confirmPasswordMessage}
        errorType={passwordCheckErrorType}
      />
      <AuthInputComponent
        value={email}
        onChange={(e) => onEmailChangeHandler(e, setEmail, setEmailMessage, setEmailError)}
        onButtonClick={() => onEmailButtonClickHandler(username, email, setEmailError, setEmailMessage, setIdError, setIdMessage, setIdCheck, verificationCodeRef)}
        onKeyDown={(e) => onEmailKeyDownHandler(e, () => onEmailButtonClickHandler(username, email, setEmailError, setEmailMessage, setIdError, setIdMessage, setIdCheck, verificationCodeRef))}
        showLabel={true}
        labelText="이메일"
        buttonText="이메일 인증"
        placeholderText="이메일 주소를 입력하세요"
        inputType="email"
        inputRef={emailRef}
        errorText={emailMessage}
        errorType={emailErrorType}
      />
      <AuthInputComponent
        value={certificationNumber}
        onChange={(e) => onCertificationNumberChangeHandler(e, setCertificationNumber, setCertificationNumberMessage, setCertificationCheck)}
        onKeyDown={(e) => onCertificationNumberKeyDownHandler(e, () => onCertificationNumberButtonClickHandler(username, email, certificationNumber, setCertificationNumberMessage, setCertificationNumberError, setCertificationCheck))}
        onButtonClick={() => onCertificationNumberButtonClickHandler(username, email, certificationNumber, setCertificationNumberMessage, setCertificationNumberError, setCertificationCheck)}
        showLabel={true}
        labelText="인증번호"
        buttonText="인증 확인"
        placeholderText="인증번호 4자리를 입력하세요"
        inputRef={verificationCodeRef} // 인증번호 입력 필드에 ref 추가
        errorText={certificationNumberMessage}
        errorType={certificationNumberErrorType}
        maxLength={4}
      />
      <AuthButton text="회원가입" onClick={() => onSignUpButtonClickHandler(
          username,
          password,
          confirmPassword,
          email,
          certificationNumber,
          idCheck,
          certificationCheck,
          setIdMessage,
          setIdError,
          setIdCheck,
          setPasswordMessage,
          setConfirmPasswordMessage,
          setEmailMessage,
          setEmailError,
          setCertificationNumberMessage,
          setCertificationNumberError,
          setCertificationCheck,
          handleSignUpSuccess
      )} className="mt-4" />
      <div className="my-2"></div>
      <AuthButton text="로그인" onClick={() => navigateToLogin()} variant="secondary" />
      {/* <AuthDivider /> */}
      <SNSLoginSection />
      <Modal
        isOpen={successModalOpen}
        onClose={() => {
          setSuccessModalOpen(false);
          navigateToLogin();
        }}
        onConfirm={() => {
          setSuccessModalOpen(false);
          navigateToLogin();
        }}
        message="회원가입에 성공하였습니다."
      />
    </div>
    </div>
    </div>
  );
};

export default SignUpPage;

