import express from 'express';
import { prisma } from '../uts/prisma/index.js';

const router = express.Router();
// API: 특정 사용자 ID에 따른 프로필 정보 제공
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 프로필 정보 조회
    const profile = await prisma.profiles.findUnique({
      where: { userId: Number(userId) },
    });

    if (!profile) {
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }

    // 챔피언 이미지 조회
    const championData = await prisma.champions.findMany({
      where: {
        name: {
          in: [profile.mostPlay1, profile.mostPlay2, profile.mostPlay3],
        },
      },
    });

    const championMap = championData.reduce((map, champ) => {
      map[champ.name] = champ.image_url;
      return map;
    }, {});

    // 응답 데이터 구성
    const responseData = {
      ...profile,
      mostPlay1Image: championMap[profile.mostPlay1] || null,
      mostPlay2Image: championMap[profile.mostPlay2] || null,
      mostPlay3Image: championMap[profile.mostPlay3] || null,
    };

    res.json(responseData);
  } catch (error) {
    console.error('프로필 데이터 조회 중 오류:', error);
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

export default router;
