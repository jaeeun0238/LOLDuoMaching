// express 모듈 불러오기
import express from "express";
// socket.io 모듈 불러오기
import socketIo from "socket.io"; // 기본 import
import userRouter from "./src/routers/user.router.js";
// Node.js 기본 내장 모듈 불러오기
import http from "http";
import fs from "fs/promises"; // fs를 Promise 기반으로 사용하기 위해 fs/promises로 수정
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

// express 객체 생성
const app = express();

// express http 서버 생성
const server = http.createServer(app);

// 생성된 서버를 socket.io에 바인딩
const io = socketIo(server); // socketIo로 인스턴스 생성

app.use(cors()); // CORS 미들웨어 추가
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", [userRouter]);
app.use("/static", express.static("static")); // static 폴더 내 모든 파일을 제공

// 기본 경로
app.get("/", async (req, res) => {
  try {
    const data = await fs.readFile("./static/home/home.html"); // 홈 페이지 HTML 파일 경로
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  } catch (err) {
    res.send("에러");
  }
});

// 로그인 페이지
app.get("/login", async (req, res) => {
  try {
    const data = await fs.readFile("./static/login/login.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  } catch (err) {
    res.send("에러");
  }
});

// 회원가입 페이지
app.get("/signup", async (req, res) => {
  try {
    const data = await fs.readFile("./static/signup/signup.html");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  } catch (err) {
    res.send("에러");
  }
});

// 마이페이지
app.get("/index", async (req, res) => {
  try {
    const data = await fs.readFile("./static/index/index.html"); // 마이페이지 HTML 파일 경로
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  } catch (err) {
    res.send("에러");
  }
});
io.on("connection", (socket) => {
  // 새로운 유저가 접속했을 경우 다른 소켓에게도 알려줌
  socket.on("newUser", (name) => {
    console.log(`${name} 님이 접속하였습니다.`);

    // 소켓에 이름 저장해두기
    socket.name = name;

    // 모든 소켓에게 전송
    io.emit("update", {
      type: "connect",
      name: "SERVER",
      message: `${name}님이 접속하였습니다.`,
    });
  });

  // 전송한 메시지 받기
  socket.on("message", (data) => {
    // 받은 데이터에 누가 보냈는지 이름을 추가
    data.name = socket.name;

    console.log(data);

    // 보낸 사람을 제외한 나머지 유저에게 메시지 전송
    socket.broadcast.emit("update", data);
  });

  // 접속 종료
  socket.on("disconnect", () => {
    console.log(`${socket.name}님이 나가셨습니다.`);

    // 나가는 사람을 제외한 나머지 유저에게 메시지 전송
    socket.broadcast.emit("update", {
      type: "disconnect",
      name: "SERVER",
      message: `${socket.name}님이 나가셨습니다.`,
    });
  });
});

// 서버를 8080 포트로 listen
server.listen(8080, () => {
  console.log("서버 실행 중..");
});
