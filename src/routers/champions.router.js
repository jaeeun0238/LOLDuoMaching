// ./src/routes/champions.router.js
import express from 'express';
import { prisma } from '../uts/prisma/index.js';
import errModel from '../middlewares/error.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

// POST /api/update_champion_list - 테이블 초기화 후 JSON 파일의 데이터 삽입
router.post('/update_champion_list', async (req, res) => {
  try {
    console.log('지나가는가2');
    const filePath = path.resolve(__dirname, '../accet/champion_data.json');
    console.log(filePath);
    const data = await fs.readFile(filePath, 'utf-8');

    console.log('지나가는가3');
    // JSON 파일 읽기
    const champions = JSON.parse(data);

    // 테이블 초기화 (기존 데이터 삭제)
    await prisma.champions.deleteMany();
    console.log('테이블 초기화');

    /*
// 챔피언 정보를 저장하는 테이블
model Champions {
    championId Int    @id @default(autoincrement()) // 챔피언 ID, 자동 증가
    image      String @unique // 챔피언 이미지 URL, 고유 값
    name       String @unique // 챔피언 이름, 고유 값
}
*/
    console.log('지나가는가4');

    // JSON 데이터 삽입
    const createdChampions = await prisma.champions.createMany({
      data: champions.map((champion) => ({
        image: champion.image,
        name: champion.name,
      })),

      skipDuplicates: true, // 중복 데이터 무시
    });

    res.status(201).json({
      message: `Champions table 에 데이터 채우기 완료. ${createdChampions.count}명.`,
    });
  } catch (error) {
    console.error('Error updating champion list:', error);
    res.status(500).json({ error: '업데이트 실패' });
  }
});

// GET /api/champions - 챔피언 테이블 전체 조회
router.get('/champions', async (req, res) => {
  try {
    const champions = await prisma.champions.findMany();
    res.status(200).json(champions);
  } catch (error) {
    console.error('Error fetching champions:', error);
    res.status(500).json({ error: 'Failed to fetch champions.' });
  }
});

export default router;
