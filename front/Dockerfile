# 빌드 단계
FROM node:20 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Nginx 설정을 적용한 배포 단계
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 Nginx HTML 디렉토리에 복사
COPY --from=build /app/build /usr/share/nginx/html