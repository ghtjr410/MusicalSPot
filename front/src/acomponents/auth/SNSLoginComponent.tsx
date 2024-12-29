import React from 'react';
import kakaoSignInImage from 'assets/images/kakao-sign-in.png';
import naverSignInImage from 'assets/images/naver-sign-in.png';
import { onSnsSignInButtonClickHandler } from 'services/OAuth2SignInService/snsSignInService';

const SNSLoginSection: React.FC = () => {
  const handleKakaoSignIn = () => {
    // 카카오 로그인 로직
    console.log('카카오 로그인');
    onSnsSignInButtonClickHandler('kakao');
  };

  const handleNaverSignIn = () => {
    // 네이버 로그인 로직
    console.log('네이버 로그인');
    onSnsSignInButtonClickHandler('naver');
  };

  return (
    <div className="text-center mt-4">
      <div className="text-gray-500 mb-2">　　　</div>
      <div className="flex justify-center space-x-4">
        <div className='w-12 h-12'></div>
        {/* <img
          src={kakaoSignInImage}
          alt="카카오 로그인"
          className="w-12 h-12 cursor-pointer"
          onClick={handleKakaoSignIn}
        />
        <img
          src={naverSignInImage}
          alt="네이버 로그인"
          className="w-12 h-12 cursor-pointer"
          onClick={handleNaverSignIn}
        /> */}
      </div>
    </div>
  );
};

export default SNSLoginSection;
