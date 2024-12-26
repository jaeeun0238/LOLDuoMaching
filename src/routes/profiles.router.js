import express from 'express';
import { prisma } from '../uts/prisma/index.js';

const router = express.Router();

// 프로필 생성
router.post('/profiles', async (req, res, next) => {
  try {
    const {
      lolNickname,
      tier,
      line,
      mostPlay1,
      mostPlay2, // 추가된 필드
      mostPlay3, // 추가된 필드
      averageRating,
      championId,
      userId,
      email,
      password,
      userName,
      nickname,
    } = req.body;

    // 1. 사용자가 이미 존재하는지 확인하고 없으면 새로 생성
    let user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      // 사용자가 없으면 새로운 사용자 생성
      user = await prisma.users.create({
        data: { email, password, userName, nickname },
      });
    }

    // 2. 프로필 생성
    const profile = await prisma.profiles.create({
      data: {
        lolNickname,
        tier,
        line,
        mostPlay1,
        mostPlay2,
        mostPlay3,
        averageRating,
        championId,
        user: { connect: { userId: user.userId } },
      },
    });

    return res
      .status(201)
      .json({ message: '프로필이 생성되었습니다.', data: profile });
  } catch (error) {
    next(error); // 에러를 다음 핸들러로 전달
  }
});

// 프로필 수정
router.patch('/profiles/:profileId', async (req, res, next) => {
  try {
    const { profileId } = req.params;
    const {
      lolNickname,
      tier,
      line,
      mostPlay1,
      mostPlay2,
      mostPlay3,
      averageRating,
      championId,
    } = req.body;

    const parsedProfileId = parseInt(profileId, 10);

    const updatedProfile = await prisma.profiles.update({
      where: { profileId: parsedProfileId },
      data: {
        ...(lolNickname && { lolNickname }),
        ...(tier && { tier }),
        ...(line && { line }),
        ...(mostPlay1 && { mostPlay1 }),
        ...(mostPlay2 && { mostPlay2 }),
        ...(mostPlay3 && { mostPlay3 }),
        ...(averageRating !== undefined && { averageRating }),
        ...(championId !== undefined && { championId }),
      },
    });

    return res
      .status(200)
      .json({ message: '프로필이 수정되었습니다.', data: updatedProfile });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }
    next(error);
  }
});

// 프로필 삭제
router.delete('/profiles/:profileId', async (req, res, next) => {
  try {
    const { profileId } = req.params;

    const parsedProfileId = parseInt(profileId, 10);

    const profile = await prisma.profiles.findUnique({
      where: { profileId: parsedProfileId },
    });

    if (!profile) {
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }

    await prisma.profiles.delete({
      where: { profileId: parsedProfileId },
    });

    return res.status(200).json({ message: '프로필이 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return res.status(500).json({
      message: '프로필 삭제 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

export default router;
