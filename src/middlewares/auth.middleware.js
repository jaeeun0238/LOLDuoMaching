// src/middlewares/auth.middleware.js

// 모듈 가져오기
import jwt from "jsonwebtoken";
import { prisma } from "../uts/prisma/index.js";
// 미들웨어 함수 정의
export default async function (req, res, next) {
  // 토큰 확인
  try {
    // 쿠키에서 토큰 가져오기
    const authorization = req.cookies.authorization; // 쿠키 이름이 "authorization"인 경우

    if (!authorization) throw new Error("토큰이 존재하지 않습니다.");

    const [tokenType, token] = authorization.split(" ");

    if (tokenType !== "Bearer")
      throw new Error("토큰 타입이 일치하지 않습니다.");

    // 토큰 검증
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;

    // 사용자 조회
    const user = await prisma.users.findUnique({
      where: { userId: userId },
    });
    if (!user) {
      res.clearCookie("token");
      throw new Error("토큰 사용자가 존재하지 않습니다.");
    }

    // req.user에 사용자 정보를 저장
    req.user = user;
    next();
    // 오류 처리
  } catch (error) {
    res.clearCookie("token");

    // 토큰이 만료되었거나, 조작되었을 때, 에러 메시지를 다르게 출력합니다
    switch (error.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "토큰이 만료되었습니다." });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "토큰이 조작되었습니다." });
      default:
        return res
          .status(401)
          .json({ message: error.message ?? "비정상적인 요청입니다." });
    }
  }
}
