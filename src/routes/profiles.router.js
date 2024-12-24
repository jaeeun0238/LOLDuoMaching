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
      mostPlay,
      averageRating,
      userId, // 이미 존재하는 사용자 ID를 기반으로 프로필을 생성
      email,
      password,
      userName,
      nickname,
    } = req.body;

    // 1. 사용자가 이미 존재하는지 확인하고 없으면 새로 생성
    let user = await prisma.users.findUnique({
      where: {
        email: email, // 이메일로 기존 사용자를 찾습니다
      },
    });

    if (!user) {
      // 사용자가 없으면 새로운 사용자 생성
      user = await prisma.users.create({
        data: {
          email: email,
          password: password,
          userName: userName,
          nickname: nickname,
        },
      });
    }

    // 2. 사용자가 존재하거나 새로 생성된 후, 프로필 생성
    const profile = await prisma.profiles.create({
      data: {
        lolNickname: lolNickname,
        tier: tier,
        line: line,
        mostPlay: mostPlay,
        averageRating: averageRating,
        user: {
          connect: {
            userId: user.userId, // 이미 존재하는 사용자 ID와 연결
          },
        },
      },
    });

    return res
      .status(201)
      .json({ message: '프로필이 생성됐습니다.', data: profile });
  } catch (error) {
    next(error); // 에러를 다음 핸들러로 전달
  }
});

// 프로필 수정
router.patch('/profiles/:profileId', async (req, res, next) => {
  try {
    const { profileId } = req.params; // URL에서 profileId를 가져옵니다.
    const { lolNickname, tier, line, mostPlay, averageRating } = req.body;

    // profileId를 숫자로 변환
    const parsedProfileId = parseInt(profileId, 10);

    // 프로필 업데이트
    const updatedProfile = await prisma.profiles.update({
      where: { profileId: parsedProfileId }, // 숫자로 변환된 profileId로 프로필을 찾습니다.
      data: {
        ...(lolNickname && { lolNickname }), // 전달된 데이터만 업데이트
        ...(tier && { tier }),
        ...(line && { line }),
        ...(mostPlay && { mostPlay }),
        ...(averageRating !== undefined && { averageRating }), // averageRating이 undefined가 아닐 경우만 업데이트
      },
    });

    return res
      .status(200)
      .json({ message: '프로필이 수정됐습니다.', data: updatedProfile });
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma에서 리소스가 없을 때 발생하는 에러 처리
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }
    next(error); // 다른 에러는 다음 핸들러로 전달
  }
});

// 프로필 삭제
router.delete('/profiles/:profileId', async (req, res, next) => {
  try {
    const { profileId } = req.params; // URL에서 profileId를 가져옵니다.

    // profileId를 숫자로 변환
    const parsedProfileId = parseInt(profileId, 10);

    // 프로필 존재 여부 확인
    const profile = await prisma.profiles.findUnique({
      where: { profileId: parsedProfileId },
    });

    if (!profile) {
      return res.status(404).json({ message: '프로필을 찾을 수 없습니다.' });
    }

    // 프로필 삭제
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
