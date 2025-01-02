// src/middlewares/error-handling.middleware.js

export default function (err, req, res, next) {
  // 에러를 출력합니다.
  console.error(err);
  const statusCode = err.status || 500; //에러 객체에 상태 코드가 있다면 사용
  const message = err.message || '서버 내부 에러가 발생했습니다.';
  return res.status(statusCode).json({ error: message });
}
