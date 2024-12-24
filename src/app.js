// app.js

import express from 'express';

// 라우터 파일 가져오기
import championRoutes from './routes/champions.router.js';
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 연결
app.use('/api', championRoutes);

// 서버 종료 시 Prisma 연결 종료
// process.on('SIGINT', async () => {
//   await prisma.$disconnect();
//   process.exit(0);
// });

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
