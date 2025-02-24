// src/utils/navigationUtils.ts
import { useNavigate } from 'react-router-dom';

const useNavigateHelper = () => {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/home');
  };
  const navigateToMyblog = () => {
    navigate('/my');
  };

  const navigateToLogin = () => {
    navigate('/sign-in');
  };
  const navigateToSignUp = () => {
    navigate('/sign-up');
  };
  const navigateToCreateNickname = () => {
    navigate('/create-nickname');
  };
  
  const navigateToTest = () => {
    navigate('/test');
  };  
  const navigateToUserBlog= (nickname: String) => {
    navigate(`/user-blog/${nickname}`)
  };
  const navigateToEditPost = () => {
    navigate('/edit-post')
  };
  const navigateToEditEditPost = (postId: string) => {
    navigate(`/edit-post/${postId}`);
  };
  const navigateToPost = (postId: number, nickname: string) => {
    navigate(`/post/${postId}/${nickname}`);
  };
  const navigateToDeleteAccount = () => {
    navigate('/delete-account')
  };


  return { navigateToLogin, navigateToHome, navigateToSignUp, navigateToMyblog, navigateToTest, navigateToCreateNickname, navigateToUserBlog, navigateToCreatePost: navigateToEditPost, navigateToPost, navigateToDeleteAccount, navigateToEditEditPost};
};

export default useNavigateHelper;
