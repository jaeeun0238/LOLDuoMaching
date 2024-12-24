import express from 'express';
import { prisma } from '../uts/prisma/index.js';
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
  const accountData = await prisma.users.findFirst({ where: { email } });

  if (!accountData)
    return res.status(401).json({ message: '존재하지 않는 email입니다.' });
  // 입력받은 사용자의 비밀번호와 데이터베이스에 저장된 비밀번호를 비교합니다.
  else if (!(await bcrypt.compare(password, accountData.password)))
    return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });

  // 로그인에 성공하면, 사용자의 accountId를 바탕으로 토큰을 생성합니다.
  const accesstoken = jwt.sign(
    {
      userId: accountData.userId,
    },
    // JWT를 서명하는 데 사용되는 비밀 키
    // 서버가 비밀 키를 사용하여 토큰 변조 여부를 알 수 있다
    process.env.SERVER_ACCESS_KEY,
    // 엑세스 토큰
    { expiresIn: '5m' },
  );

  res.setHeader('Authorization', `Bearer ${accesstoken}`);

  return res.status(200).json({
    message: '로그인 성공',
    accessToken: accesstoken,
    email: accountData.email,
  });
});

export default router;
