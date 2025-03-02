import React from 'react';
import { useAuth } from 'hooks/useAuthHook';
import { HeaderProvider } from 'services/HeaderService/HeaderService';
import CommonHeader from 'acomponents/header/CommonHeader';

const MusicalPage: React.FC = () => {
  const { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus } = useAuth();

  // todo : 버튼을 눌렀을때 인증로직발생
  const handleAuthCheck = () => {
    checkAuthStatus(
      (nickname) => {
        // todo: 인증성공시 로직실행하시면됩니다.
        // console.log("인증된 사용자:", nickname);
      },
      () => {
        // todo: 인증실패시에는 로그인하라는 알림을 띄울지, 로그인화면으로 보낼지 정하면됩니다.
        // console.log("인증 필요함");
      }
    );
  };

  return (
    <HeaderProvider>
      <div className="pt-20"> 
        <CommonHeader
          isAuthenticated={isAuthenticated}
          myNickname={myNickname}
          nicknameModalOpen={nicknameModalOpen}
          setNicknameModalOpen={setNicknameModalOpen}
          checkAuthStatus={checkAuthStatus}
        />
        <div className="container mx-auto p-4">
          뮤지컬 페이지
          <button 
            onClick={handleAuthCheck} 
            className="mt-4 p-2 bg-blue-500 text-white rounded"
          >
            인증 여부 확인
          </button>
        </div>
      </div>
    </HeaderProvider>
  );
};

export default MusicalPage;