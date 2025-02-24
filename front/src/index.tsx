import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter as Router } from 'react-router-dom';
import App from './App';
import './index.css'; 
// import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);
// StrictMode를 키면 useeffect가 두번실행되서 껐습니다.
// StrictMode는 개발환경에서 오류를 미리 잡을수있게 2번 실행하여 오류를 명시해주는 역할이라는데
// 오히려 헷갈려서 일단은 끕니다 향후에 여기에대해서 의견이 있으시면 의견주세요