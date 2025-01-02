# LOL DUO Matching

---

## 1. 프로젝트 구성

저희 프로젝트는 '롤 듀오 구하기 게시판'으로, 리그 오브 레전드 유저들이 듀오를 구할 수 있도록 돕는 플랫폼입니다.

주요 목표와 기능으로는 사용자 간의 실시간 소통과 간단한 프로필 관리 기능을 제공하는 것과 실시간 채팅, 롤api를 이용한 유저 프로필 저장 및 불러오기가 있습니다.

## 2. 프로젝트 프로그램 설치 방법 및 사용 툴

$ npm install

$ npm run dev

$ npm i -D nodemon

$ npm i socket.io

$ npm i express

### 사용툴

- Visual Studio Code
- Git
- Github
- insomnia

## 3. 프로그래머 정보

[@유재은](https://github.com/jaeeun0238) [@강나연](https://github.com/nayeon0206) [@유대원](https://github.com/Rlhaa) [@윤예원](https://github.com/BlueStrobus) [@김동환](https://github.com/KimDongHwan97)

## 4. 와이어 프레임

![와이어프레임](<https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(1).png>)
(https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(2).png)
(https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(3).png)
(https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(4).png)
(https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(5).png)
(https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(6).png)
(https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(7).png)
(https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(8).png)

## ERD DIAGRAM

![ERD DIAGRAM](<https://github.com/jaeeun0238/LOLDuoMaching/blob/main/image/image%20(9).png>)

## 5. 디텍토리 구조

LOLDuoMatching

├─ app.js  
├─ prisma  
│ ├─ migrations  
│ └─ schema.prisma  
├─ src  
│ ├─ middlewares  
│ │ ├─ auth.middleware.js  
│ │ └─ error.middleware.js  
│ ├─ routers  
│ │ ├─ comments.router.js  
│ │ ├─ duoreview.router.js  
│ │ ├─ getLolInfo.router.js  
│ │ ├─ posts.router.js  
│ │ ├─ profile.router.js  
│ │ └─ user.router.js  
│ └─ uts  
│ └─ prisma  
│ └─ index.js  
└─ static  
├─ createPost  
│ ├─ createPost.css  
│ ├─ createPost.html  
│ └─ createPost.js  
├─ getPost  
│ ├─ css  
│ │ ├─ championSemple  
│ │ ├─ lolL.png  
│ │ ├─ stars  
│ │ └─ styles.css  
│ ├─ getPost.html  
│ ├─ getPost.js  
│ └─ script.js  
├─ home  
│ ├─ home.css  
│ ├─ home.html  
│ └─ home.js  
├─ login  
│ ├─ login.css  
│ ├─ login.html  
│ └─ login.js  
├─ newsFeed  
│ ├─ newsFeed.css  
│ ├─ newsFeed.html  
│ └─ newsFeed.js  
├─ setProfile  
│ ├─ setProfile.css  
│ ├─ setProfile.html  
│ └─ setProfile.js  
├─ signup  
│ ├─ signup.css  
│ ├─ signup.html  
│ └─ signup.js  
├─ userProfile  
│ ├─ userProfile.css  
│ ├─ userProfile.html  
│ └─ userProfile.js  
├─ package.json  
└─ package-lock.json
