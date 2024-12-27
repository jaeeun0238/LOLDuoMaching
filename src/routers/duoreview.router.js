import express from 'express';
import { prisma } from '../uts/prisma/index.js';
import errModel from '../middlewares/error.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 듀오 리뷰 생성
router.post('/duoreviews', authMiddleware, async (req, res, next) => {
  const { someoneUserId, content, starRating } = req.body;

  try {
    const myUserId = req.user.userId; // authMiddleware에서 설정된 userId 사용
    if (!myUserId) {
      return res
        .status(401)
        .json({ message: '인증된 사용자 정보가 필요합니다.' });
    }
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

// 듀오 리뷰 수정
router.patch(
  '/duoreviews/:duoReviewId',
  authMiddleware,
  async (req, res, next) => {
    const { duoReviewId } = req.params;
    const { userId } = req.user; // 요청한 사용자의 ID (authMiddleware로 설정)
    const { content, starRating } = req.body;

    try {
      // DuoReview 존재 여부 및 작성자 확인
      const duoReview = await prisma.duoReview.findUnique({
        where: { duoReviewId: parseInt(duoReviewId, 10) },
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
        where: { duoReviewId: parseInt(duoReviewId, 10) },
        data: {
          ...(content && { content }),
          ...(starRating !== undefined && { starRating }),
        },
      });

      return res.status(200).json({
        message: 'DuoReview가 수정되었습니다.',
        data: updatedDuoReview,
      });
    } catch (error) {
      console.error('Error updating DuoReview:', error);
      return res.status(500).json({
        message: 'DuoReview 수정 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },
);

// 듀오 리뷰 삭제
router.delete(
  '/duoreviews/:duoReviewId',
  authMiddleware,
  async (req, res, next) => {
    const { duoReviewId } = req.params;
    const { userId } = req.user; // 요청한 사용자의 ID (authMiddleware에서 제공)

    try {
      // DuoReview 존재 여부 확인
      const duoReview = await prisma.duoReview.findUnique({
        where: { duoReviewId: parseInt(duoReviewId, 10) },
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
        where: { duoReviewId: parseInt(duoReviewId, 10) },
      });

      return res.status(200).json({ message: 'DuoReview가 삭제되었습니다.' });
    } catch (error) {
      console.error('Error deleting DuoReview:', error);
      return res.status(500).json({
        message: 'DuoReview 삭제 중 오류가 발생했습니다.',
        error: error.message,
      });
    }
  },
);

export default router;
