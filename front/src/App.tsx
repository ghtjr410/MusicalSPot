import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HeaderProvider } from "services/HeaderService/HeaderService";
import OAuth from "services/OAuth2SignInService/oAuthResponseService";
import CreateNickNamePage from "apages/auth/CreateNickNamePage";
import Mainpage from "apages/main/Mainpage";
import TestPage from "apages/test/TestPage";
import MusicalPage from "apages/musical/MusicalPage";
import CategoryPage from "apages/Category/CategoryPage";
import ReviewList from "apages/reviewList/ReviewList";
import DetailPage from "apages/detail/DetailPage";
import AllCategoryPage from "apages/Category/AllCategoryPage";
import DynamicCategoryPage from "apages/Category/DynamicCategoryPage";
import WebSocketConnect from "components/websocket/WebSocketConnect";
import ChatIconComponent from "components/websocket/ChatBalloonIcon";
import SearchPage from "apages/search/SearchPage";
import { ChatMessage } from "hooks/connectWebSocketHook"; // import ChatMessage type
import LoginPage from "apages/auth/LoginPage";
import SignUpPage from "apages/auth/SignUpPage";
import MyPage from "apages/auth/MyPage";

function App() {
  const [isChatVisible, setIsChatVisible] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showNotification, setShowNotification] = useState<boolean>(false);

  const toggleChat = () => {
    setIsChatVisible(!isChatVisible);
    setShowNotification(false);
  };

  const handleNewMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
    setShowNotification(true);
  };

  return (
    <HeaderProvider>
      <WebSocketConnect
        isVisible={isChatVisible}
        toggleChat={toggleChat}
        messages={messages}
        setMessages={setMessages}
        handleNewMessage={handleNewMessage}
      />
      {!isChatVisible && (
        <ChatIconComponent
          toggleChat={toggleChat}
          showNotification={showNotification}
        />
      )}

      <Routes>
        <Route path="/auth">
          <Route path="search" element={<SearchPage />} />
          <Route
            path="category/:categoryId"
            element={<DynamicCategoryPage />}
          />
          <Route path="My" element={<MyPage />} />
          <Route path="all" element={<AllCategoryPage />} />
          <Route path="details/:musicalId" element={<DetailPage />} />
          <Route path="home" element={<Mainpage />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="musical" element={<MusicalPage />} />
          <Route path="reviewlist" element={<ReviewList />} />
          <Route path="reviewlist/:musicalId" element={<ReviewList />} />
          <Route path="sign-in" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route path="create-nickname" element={<CreateNickNamePage />} />
          <Route path="test" element={<TestPage />} />
        </Route>
        <Route
          path="/auth/oauth-response/:token/:expirationTime/:refreshToken/:refreshExpirationTime"
          element={<OAuth />}
        />
        <Route path="*" element={<Navigate to="/auth/home" />} />
      </Routes>
    </HeaderProvider>
  );
}

export default App;
