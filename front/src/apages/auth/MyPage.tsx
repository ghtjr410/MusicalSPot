//src/apages/auth/MyPage
import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuthHook';
import { HeaderProvider } from 'services/HeaderService/HeaderService';
import CommonHeader from 'acomponents/header/CommonHeader';
import useNavigateHelper from 'utils/NavigationUtil/navigationUtil';
// import Modal from 'components/Modal/Modal';
import { changePassword, userInfo } from 'services/Auth/authService';
import Modal from 'components/Modal/MyPageModal';
// import Modal from 'components/Modal/Modal';



const MyPage: React.FC = () => {
  const { isAuthenticated, myNickname, nicknameModalOpen, setNicknameModalOpen, checkAuthStatus } = useAuth();
  const [changePwdModalOpen, setChangePwdModalOpen] = useState(false);
  const [userData, setUserData] = useState({ userId: '', email: '', nickname: '', type: '' });
  const [newPassword, setNewPassword] = useState('');
  const [commonModalOpen, setCommonModalOpen] = useState<boolean>(false); // State for the login alert modal
  const [modalMessage, setModalMessage] = useState<string>('');

  const { navigateToLogin } = useNavigateHelper(); 

  const deleteAccountModalConfirm = async (inputNickname?: string) => {
    if (inputNickname) {
      console.log("회원탈퇴 진행: " + inputNickname);
      // await deleteAccount(inputNickname);
      window.location.reload();
    } else {
      console.log("닉네임이 입력되지 않았습니다.");
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await userInfo();
      if (response.data) {
        console.log(response.data)
        setUserData(response.data);
      }
    } catch (error) {
      setCommonModalOpen(true);
      setModalMessage("로그인한 회원만 이용 가능합니다.")
      // alert('로그인 후 이용해주세요');
      navigateToLogin();
      console.error("Failed to fetch user info:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  const fetchChangePassword = async (inputValue?: string) => {
    if (!inputValue) {
      setCommonModalOpen(true);
      setModalMessage("비밀번호를 입력해주세요")
      // alert("비밀번호를 입력해주세요.");
      return;
    }
    try {
      const response = await changePassword(inputValue);
      setCommonModalOpen(true);
      setModalMessage("비밀번호가 성공적으로 변경되었습니다.");
      // alert("비밀번호가 성공적으로 변경되었습니다.");
      setChangePwdModalOpen(false);
      // window.location.reload();
    } catch (error) {
      setCommonModalOpen(true);
      setModalMessage("올바른 비밀번호가 아닙니다");
    }
  };




  // todo : 버튼을 눌렀을때 인증로직발생
  const handleAuthCheck = () => {
    checkAuthStatus(
      (nickname) => {
        // todo: 인증성공시 로직실행하시면됩니다.
        console.log("인증된 사용자:", nickname);
      },
      () => {
        // todo: 인증실패시에는 로그인하라는 알림을 띄울지, 로그인화면으로 보낼지 정하면됩니다.
        console.log("인증 필요함");
      }
    );
  };
  useEffect(() => {
    console.log("마이페이지 ");
    console.log("마이페이지 로그인 상태 : " + isAuthenticated);
    console.log("마이페이지닉네임 : " + myNickname);
    
  }, [isAuthenticated, myNickname]);



  // Handle password change
  const handlePasswordChange = () => {
    console.log("Change password button clicked");
    checkAuthStatus(
      (nickname) => {
        // 인증 성공 시 로직
        console.log("인증된 사용자:", nickname);
        setChangePwdModalOpen(true);
      },
      () => {
        // 인증 실패 시 로직
        setModalMessage("로그인한 회원만 이용 가능합니다.");
        setCommonModalOpen(true);
      
      
        console.log("인증 필요함");
      }
    );
  };
  const commonModalConfirm = () => {
    setCommonModalOpen(false);
    setModalMessage("")
  };

  // bg-white w-full max-w-xl h-auto md:h-3/4 flex justify-center items-center rounded shadow-md
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
      </div>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white w-full max-w-xl flex justify-center items-center rounded shadow-md" style={{ minHeight: '700px' }}>
          <div className=" p-6"style={{ width: '700px' }}>
            <div className="flex-1 p-8">
              <div className="text-center text-3xl font-semibold mb-4">회원정보</div>
              
              <div className="container mx-auto p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">이메일</label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">아이디</label>
                  <input
                    type="text"
                    value={userData.userId} 
                    disabled
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">닉네임</label>
                  <input
                    type="test"
                    value={userData.nickname}
                    disabled
                    className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">비밀번호</label>
                    <input
                      type="password"
                      value="*************"
                      readOnly
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                    />
                  </div>
                  <button
                    onClick={handlePasswordChange}
                    className="mt-6 p-2 bg-blue-500 text-white rounded"
                  >
                    변경
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={changePwdModalOpen}
        onClose={() => setChangePwdModalOpen(false)}
        onConfirm={fetchChangePassword}
        message="비밀번호 변경"
        showInput={true}
        placeholder="8~13자 변경하실 비밀번호를 입력하세요"
      />
      <Modal
        isOpen={commonModalOpen}
        onClose={() => setCommonModalOpen(false)}
        onConfirm={commonModalConfirm}
        message={modalMessage}
      />
    </HeaderProvider>
  );
};

export default MyPage;