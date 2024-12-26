import express from 'express';
import userRouter from './routers/user.router.js';
import errorMiddleware from './middlewares/error.middleware.js';
import dotenv from 'dotenv';
import userinfoRouter from './routers/userinfo.router.js';

dotenv.config();
const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// '/api' 경로에 여러 라우터 연결
app.use('/api', [userRouter, userinfoRouter]);

// 에러 처리 미들웨어
app.use(errorMiddleware);

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
