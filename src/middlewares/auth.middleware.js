// src/middlewares/auth.middleware.js

// 모듈 가져오기
// 이 코드에서는 JSON Web Token(jwt)를 사용하기 위해 'jsonwebtoken'을, 데이터베이스 접근을 위해 prisma를 가져옵니다.
import jwt from 'jsonwebtoken';
import { prisma } from '../uts/prisma/index.js';

// 미들웨어 함수 정의
// 이 미들웨어는 요청(request)이 적합한 인증 토큰을 가지고 있는지 확인합니다.
export default async function (req, res, next) {
  // 토큰 확인
  try {
    // 쿠키에서 토큰 가져오기
    const authorization = req.cookies.authorization; // 쿠키 이름이 "authorization"인 경우

    if (!authorization) throw new Error('토큰이 존재하지 않습니다.');

    const [tokenType, token] = authorization.split(' ');

    if (tokenType !== 'Bearer')
      throw new Error('토큰 타입이 일치하지 않습니다.');

    // 토큰 검증
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // 사용자 조회
    // prisma를 이용하여 데이터베이스에서 해당 userId를 가진 사용자를 검색합니다.
    const user = await prisma.users.findUnique({
      where: { userId: userId },
    });

    // 사용자가 존재하지 않을 경우 쿠키를 삭제하고 예외를 던집니다.
    if (!user) {
      res.clearCookie('authorization'); // 'authorization' 쿠키를 제거합니다.
      throw new Error('토큰 사용자가 존재하지 않습니다.');
    }

    // req.user에 사용자 정보를 저장
    // 요청 객체(req)에 사용자 정보를 추가하여 이후의 핸들러에서 사용 가능하도록 합니다.
    req.user = user;
    next();
    // 오류 처리
  } catch (error) {
    // 에러가 발생한 경우, 쿠키를 삭제합니다.
    res.clearCookie('authorization');

    // 에러의 종류에 따라 적절한 응답 메시지를 반환합니다.
    switch (error.name) {
      case 'TokenExpiredError':
        // 토큰이 만료된 경우
        return res.status(401).json({ message: '토큰이 만료되었습니다.' });
      case 'JsonWebTokenError':
        // 토큰이 조작된 경우
        return res.status(401).json({ message: '토큰이 조작되었습니다.' });
      default:
        // 그 외의 오류
        return res
          .status(401)
          .json({ message: error.message ?? '비정상적인 요청입니다.' });
    }
  }
}
