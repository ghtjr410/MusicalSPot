# MusicalSpot

뮤지컬 정보와 후기를 공유하는 커뮤니티 플랫폼

## 🚀 기술 스택

- **Backend**: Java, Spring Boot, Spring Security, JPA
- **Database**: MySQL, Redis
- **Infra**: Docker
- **Frontend**: React
- **CI/CD**: GitHub Actions
- **Cloud**: Azure Web App, Azure Static Web Apps, Azure Database for MySQL, Azure Cache for Redis

## 🕰️ 개발 기간
- **2024.07** ~ **2024.08**

## 👥 팀 구성

- **팀장** : 최호석 - REST API 설계, JWT 인증 인가 구현, 비즈니스 로직 개발, Azure 환경 구성, GitHub Actions 배포 자동화
- **팀원** : 이지훈 - 채팅 구현
- **팀원** : 조보경 - Front 
- **팀원** : 이환희 - Front


## ✨ 주요 기능

### 📝 회원 기능
- **회원가입**
  - ID, 닉네임, 이메일 중복 체크
  - 이메일 인증을 통한 가입 승인
- **로그인**
  - Access Token & Refresh Token 발급
- **로그아웃**
  - Refresh Token 폐기 및 블랙리스트 등록

### 📰 뮤지컬 기능
- **카테고리 별 뮤지컬 조회**
- **상세 뮤지컬 조회**
- **뮤지컬 티켓정보 조회**

### 📰 리뷰 기능
- **리뷰 작성 및 수정**
- **리뷰 삭제**
- **리뷰 조회 (페이징 포함)**

### 💬 리뷰 댓글 기능
- **리뷰 댓글 작성 및 수정**
- **리뷰 댓글 삭제**
- **리뷰 댓글 조회**

### ❤️ 좋아요 기능
- **뮤지컬 좋아요 및 취소 (토글 방식)**
- **리뷰 좋아요 및 취소 (토글 방식)**