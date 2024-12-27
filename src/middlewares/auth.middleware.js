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
    // 요청 헤더에서 Authorization 값을 가져옵니다.
    const authorization = req.headers['authorization'];
    console.log(req.headers); // 요청 헤더 내용을 로그로 출력 (디버깅용)

    // Authorization 헤더가 없을 경우 예외를 던집니다.
    if (!authorization) throw new Error('토큰이 존재하지 않습니다.');

    // Authorization 값에서 토큰 타입과 실제 토큰 값을 분리합니다.
    const [tokenType, token] = authorization.split(' ');

    // 토큰 타입이 'Bearer'가 아닌 경우 예외를 던집니다.
    if (tokenType !== 'Bearer')
      throw new Error('토큰 타입이 일치하지 않습니다.');

    // 토큰 검증
    // 클라이언트에서 전달한 JWT 토큰을 검증하여 디코딩된 정보를 가져옵니다.
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // JWT_SECRET은 .env 파일에 정의된 비밀키입니다.
    const userId = decodedToken.userId; // 토큰에 포함된 사용자 ID를 추출합니다.
    console.log(decodedToken); // 디코딩된 토큰 정보를 로그로 출력 (디버깅용)

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
    next(); // 다음 미들웨어로 요청을 전달합니다.

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
