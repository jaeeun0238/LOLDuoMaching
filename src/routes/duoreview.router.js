import express from 'express';
import { prisma } from '../uts/prisma/index.js';

const router = express.Router();

// 듀오 리뷰 생성
router.post('/duoreviews', async (req, res, next) => {
  const { myUserId, someoneUserId, content, starRating } = req.body;

  try {
    // 두 사용자 존재 여부 확인
    const myUser = await prisma.users.findUnique({
      where: { userId: myUserId },
    });

    const someoneUser = await prisma.users.findUnique({
      where: { userId: someoneUserId },
    });

    if (!myUser || !someoneUser) {
      return res
        .status(404)
        .json({ message: '리뷰를 작성하려는 사용자 정보를 찾을 수 없습니다.' });
    }

    // 리뷰 생성
    const duoReview = await prisma.duoReview.create({
      data: {
        myUserId,
        someoneUserId,
        content,
        starRating,
      },
    });

    return res
      .status(201)
      .json({ message: '듀오 리뷰가 생성되었습니다.', data: duoReview });
  } catch (error) {
    console.error('Error creating duo review:', error);
    return res.status(500).json({
      message: '듀오 리뷰 생성 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// DuoReview 수정
router.patch('/duoreviews/:duoReviewId', async (req, res, next) => {
  const { duoReviewId } = req.params;
  const { userId } = req.user; // 요청한 사용자의 ID (authMiddleware로 설정)
  const { content, starRating } = req.body;

  try {
    // DuoReview 존재 여부 및 작성자 확인
    const duoReview = await prisma.duoReview.findUnique({
      where: {
        duoReviewId: duoReviewId, // duoReviewId를 숫자로 변환
      },
    });

    if (!duoReview) {
      return res
        .status(404)
        .json({ message: 'DuoReview가 존재하지 않습니다.' });
    }

    if (duoReview.myUserId !== userId) {
      return res
        .status(403)
        .json({ message: 'DuoReview 수정 권한이 없습니다.' });
    }

    // DuoReview 업데이트
    const updatedDuoReview = await prisma.duoReview.update({
      where: {
        duoReviewId: duoReviewId,
      },
      data: {
        ...(content && { content }), // content가 제공되었을 경우만 업데이트
        ...(starRating !== undefined && { starRating }), // starRating이 제공되었을 경우만 업데이트
      },
    });

    return res
      .status(200)
      .json({ message: 'DuoReview가 수정되었습니다.', data: updatedDuoReview });
  } catch (error) {
    console.error('Error updating DuoReview:', error);
    return res.status(500).json({
      message: 'DuoReview 수정 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// DuoReview 삭제
router.delete('/duoreviews/:duoReviewId', async (req, res, next) => {
  const { duoReviewId } = req.params;
  const { userId } = req.user; // 요청한 사용자의 ID (authMiddleware에서 제공)

  try {
    // DuoReview 존재 여부 확인
    const duoReview = await prisma.duoReview.findUnique({
      where: {
        duoReviewId: duoReviewId, // duoReviewId를 숫자로 변환
      },
    });

    if (!duoReview) {
      return res
        .status(404)
        .json({ message: 'DuoReview가 존재하지 않습니다.' });
    }

    // 작성자 확인
    if (duoReview.myUserId !== userId) {
      return res
        .status(403)
        .json({ message: 'DuoReview 삭제 권한이 없습니다.' });
    }

    // DuoReview 삭제
    await prisma.duoReview.delete({
      where: {
        duoReviewId: duoReviewId,
      },
    });

    return res.status(200).json({ message: 'DuoReview가 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting DuoReview:', error);
    return res.status(500).json({
      message: 'DuoReview 삭제 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

export default router;
