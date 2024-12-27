import express from 'express';
import { prisma } from '../uts/prisma/index.js';
import errModel from '../middlewares/error.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const router = express.Router();

/** 사용자 회원가입 API **/
// localhost:c/api/sign-up POST
router.post('/sign-up', async (req, res) => {
  console.log('회원가입 요청:', req.body);
  const { email, password, userName, nickname } = req.body;
  console.log({
    email,
    password,
    userName,
    nickname,
  });

  //  - [ ]  **이메일 가입 및 인증 기능**
  //  - 이메일 가입 시 이메일 인증 기능을 포함하는 것이 좋습니다.
  //  - [Nodemailer](https://github.com/nodemailer/nodemailer)와 같은 패키지 사용을 하여 완료해보세요!

  // 이메일 중복 체크
  const isExistEmail = await prisma.users.findUnique({
    where: { email },
  });

  if (isExistEmail) {
    return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
  }

  // 이메일 형식 체크
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res
      .status(409)
      .json({ message: '이메일 형식이 적절하지 않습니다.' });
  }

  // 비밀번호 형식 체크
  if (!/^.{1,6}$/.test(password)) {
    return res
      .status(409)
      .json({ message: 'password는 6자리 이하로만 설정할 수 있습니다' });
  }

  // 닉네임 중복 확인
  const isExistUserByNickname = await prisma.users.findUnique({
    where: { nickname },
  });
  if (isExistUserByNickname)
    return res.status(409).json({ errorMessage: '이미 존재하는 닉네임입니다' });

  const hashedPassword = await bcrypt.hash(password, 10);

  // 사용자 정보를 account 테이블에 추가
  const userData = await prisma.users.create({
    data: {
      email,
      password: hashedPassword,
      userName,
      nickname,
    },
  });

  return res.status(201).json({
    message: '회원가입이 완료되었습니다.',
    userId: userData.userId,
  });
});

router.post('/sign-in', async (req, res) => {
  // 클라이언트에서 로그인 요청 시 받은  email, password
  const { email, password } = req.body;
  const accountData = await prisma.users.findUnique({ where: { email } });

  if (!accountData)
    return res.status(401).json({ message: '존재하지 않는 email입니다.' });
  // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
  else if (!(await bcrypt.compare(password, accountData.password)))
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
  console.log('Secret Key:', process.env.SERVER_ACCESS_KEY);

  // 비밀번호를 암호화(bcrypt 사용)하여 저장.
  // 로그인에 성공하면, 사용자의 accountId를 바탕으로 토큰을 생성합니다.
  const token = jwt.sign(
    {
      userId: accountData.userId,
    },

    // JWT를 서명하는 데 사용되는 비밀 키
    // 서버가 비밀 키를 사용하여 토큰 변조 여부를 알 수 있다
    process.env.JWT_SECRET,
    // 엑세스 토큰
    { expiresIn: '5m' },
  );

  res.cookie('userId', `Bearer ${token}`);
  return res
    .status(200)
    .json({ message: '로그인 성공', email: accountData.email, token });

  // res.cookie('userId', accountData.userId, {
  //   httpOnly: true, // XSS 공격 방지
  //   secure: process.env.NODE_ENV === 'production', // HTTPS에서만 전송 (배포 환경에서만 적용)
  //   maxAge: 10 * 60 * 1000, // 쿠키 만료 시간 설정 (10분)
  // });
  // 로그인시 jwt로 인증하고 쿠키에 저장하기
  // 쿠키를 받아올수있도록 로직 추가해야함
  // 1. 로그인 했을때 jwt 생성과 동시에 쿠키를 저장
  // 2. 클라이언트는 jwt를 서버로 전송
  // 3. 서버는 jwt를 확인하여 사용자 검증
});

// 로그아웃
router.post('/sign-out', (req, res) => {
  try {
    // authorization 쿠키를 삭제하여 로그아웃 처리
    res.clearCookie('userId');
    return res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error); // 에러 핸들링 미들웨어로 전달
  }
});

export default router;
