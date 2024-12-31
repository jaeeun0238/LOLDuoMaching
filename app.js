import express from 'express'; // 웹 서버 구축 프레임워크
import socketIo from 'socket.io'; //  실시간 웹 소켓 통신 위한 라이브러리

import userRouter from './src/routers/user.router.js';
import getInfo from './src/routers/getLolInfo.router.js';
import setProfile from './src/routers/profile.router.js';
import postRouter from './src/routers/posts.router.js';
import duoReviewRouter from './src/routers/duoreview.router.js';
import commentRouter from './src/routers/comments.router.js';
import imageMapping from './src/routers/image.router.js';

import http from 'http'; // Node.js 기본 내장 모듈
import fs from 'fs/promises'; // 파일 시스템 모듈로, Promise 기반으로 파일을 읽고 쓸 수 있게 해줌
import dotenv from 'dotenv'; // 환경 변수 관리 모듈
import cors from 'cors';
import cookieParser from 'cookie-parser';

import errorMiddleware from './src/middlewares/error.middleware.js';

dotenv.config();

// express 객체 생성
const app = express();

// express http 서버 생성
const server = http.createServer(app);

// 생성된 http 서버에 Socket.IO를 바인딩 >> 실시간 통신 기능을 추
const io = socketIo(server);

app.use(cookieParser());
app.use(cors()); // CORS 미들웨어 추가 >>  다른 도메인에서의 요청을 허용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', [
  imageMapping,
  userRouter,
  getInfo,
  setProfile,
  postRouter,
  duoReviewRouter,
  commentRouter,
]);
app.use('/static', express.static('static')); // static 폴더 내의 정적 파일을 제공

// 각 경로에 대한 get 요청 처리, HTML 파일을 비동기적으로 읽어 클라이언트에 응답
// 기본 경로
app.get('/', async (req, res) => {
  try {
    const data = await fs.readFile('./static/home/home.html'); // 홈 페이지 HTML 파일 경로
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  } catch (err) {
    res.send('에러');
  }
});

// 로그인 페이지
app.get('/login', async (req, res) => {
  try {
    const data = await fs.readFile('./static/login/login.html'); // 로그인 페이지 HTML 파일 경로
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  } catch (err) {
    res.send('에러');
  }
});

// 회원가입 페이지
app.get('/signup', async (req, res) => {
  try {
    const data = await fs.readFile('./static/signup/signup.html'); // 회원가입 페이지 HTML 파일 경로
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  } catch (err) {
    res.send('에러');
  }
});

// 다른 유저페이지
app.get('/userProfile/:userId', async (req, res) => {
  const { userId } = req.params; // URL 파라미터에서 userId 추출

  try {
    const data = await fs.readFile('./static/userProfile/userProfile.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  } catch (err) {
    res.send('에러');
    res.status(500).send('파일을 로드할 수 없습니다.');
  }
});

// 프로필 설정
app.get('/setProfile', async (req, res) => {
  try {
    const data = await fs.readFile('./static/setProfile/setProfile.html'); // 마이페이지 HTML 파일 경로
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data);
  } catch (err) {
    res.send('에러');
  }
});

// 클라이언트가 채팅에 연결될 때마다 호출되는 이벤트 핸들러 > 현재 버튼 형식으로 접속 가능
io.on('connection', (socket) => {
  // 새로운 유저가 접속
  socket.on('newUser', (name) => {
    console.log(`${name} 님이 접속하였습니다.`);

    // 소켓에 이름 저장해두기
    socket.name = name;

    // 모든 소켓에게 전송
    io.emit('update', {
      type: 'connect',
      name: 'SERVER',
      message: `${name}님이 접속하였습니다.`,
    });
  });

  // 전송한 메시지 받기
  socket.on('message', (data) => {
    // 받은 데이터에 누가 보냈는지 이름을 추가
    data.name = socket.name;

    console.log(data);

    // 보낸 사람을 제외한 나머지 유저에게 메시지 전송
    socket.broadcast.emit('update', data);
  });

  // 접속 종료
  socket.on('disconnect', () => {
    console.log(`${socket.name}님이 나가셨습니다.`);

    // 나가는 사람을 제외한 나머지 유저에게 메시지 전송
    socket.broadcast.emit('update', {
      type: 'disconnect',
      name: 'SERVER',
      message: `${socket.name}님이 나가셨습니다.`,
    });
  });
});

// 서버를 3000 포트로 listen
server.listen(3000, () => {
  console.log('서버 실행 중..');
});
