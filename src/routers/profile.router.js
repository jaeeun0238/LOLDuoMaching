// src/routers/profile.router.js
import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { prisma } from '../uts/prisma/index.js';
const router = express.Router();

router.post('/save-profile', authMiddleware, async (req, res) => {
  const { userId } = req.user;
  const {
    lolNickname,
    profileImage,
    tier,
    line,
    mostPlay1,
    mostPlay2,
    mostPlay3,
  } = req.body;

  const userID = req.user.userId; // authMiddleware에서 설정된 userId 사용
  if (!userId) {
    return res
      .status(401)
      .json({ message: '인증된 사용자 정보가 필요합니다.' });
  }

  // 데이터 유효성 검사
  if (
    !lolNickname ||
    !tier ||
    !line ||
    !mostPlay1 ||
    !mostPlay2 ||
    !mostPlay3
  ) {
    return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
  }

  try {
    const userExists = await prisma.users.findUnique({
      where: { userId: userID },
    });

    if (!userExists) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 챔피언 이름으로 ID 조회
    const mostPlay1Champion = await prisma.champions.findUnique({
      where: { name: mostPlay1 },
    });
    const mostPlay2Champion = await prisma.champions.findUnique({
      where: { name: mostPlay2 },
    });
    const mostPlay3Champion = await prisma.champions.findUnique({
      where: { name: mostPlay3 },
    });

    // 챔피언 ID가 존재하는지 확인
    if (!mostPlay1Champion || !mostPlay2Champion || !mostPlay3Champion) {
      return res.status(404).json({ message: '챔피언을 찾을 수 없습니다.' });
    }

    // 프로필 데이터베이스에 저장
    const newProfile = await prisma.profiles.create({
      data: {
        lolNickname,
        profileImage,
        tier,
        line,
        mostPlay1: mostPlay1Champion.name,
        mostPlay2: mostPlay2Champion.name,
        mostPlay3: mostPlay3Champion.name,
        user: {
          connect: { userId: userId }, // 사용자 연결
        },
      },
    });

    res.status(201).json({
      message: '프로필이 성공적으로 생성되었습니다.',
      profile: newProfile,
    });
  } catch (error) {
    console.error('프로필 생성 중 오류 발생:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 특정 사용자의 프로필 정보 가져오기
router.get('/profile/:userId', async (req, res) => {
  const userId = parseInt(req.params.userId); // URL에서 userId 가져오기

  try {
    const profile = await prisma.profiles.findFirst({
      where: {
        userId: userId,
      },
      include: {
        user: true,
      },
    });

    if (!profile) {
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }

    res.json(profile);
  } catch (error) {
    console.error('프로필 정보를 불러오는 중 오류 발생:', error);
    res
      .status(500)
      .json({ message: '프로필 정보를 불러오는 중 오류가 발생했습니다.' });
  }
});

export default router;
