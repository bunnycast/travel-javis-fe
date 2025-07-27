# 1) 빌드 스테이지: node:18-alpine 사용
FROM node:18-alpine AS builder
WORKDIR /app

# 의존성만 복사해서 설치
COPY package.json package-lock.json ./
RUN npm ci

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# 2) 프로덕션 스테이지: nginx로 서빙
FROM nginx:stable-alpine
# 빌드 결과물을 nginx html 폴더에 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 기본 conf 제거 후 커스텀 conf 적용
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/app.conf   /etc/nginx/conf.d/default.conf

# 정적 파일 복사
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]