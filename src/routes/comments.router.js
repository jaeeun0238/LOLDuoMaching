import express from 'express';
import { prisma } from '../uts/prisma/index.js';

const router = express.Router();

// 댓글 생성
router.post('/posts/:postId/comments', async (req, res, next) => {
  const { postId } = req.params; // URL에서 게시글 ID 가져오기
  const { userId } = req.user; // 로그인된 사용자의 ID 가져오기 (authMiddleware에서 제공)
  const { content } = req.body; // 댓글 내용 가져오기

  try {
    // 게시글 존재 여부 확인
    const post = await prisma.posts.findUnique({
      where: {
        postId: +postId, // postId를 숫자로 변환
      },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    // 댓글 생성
    const comment = await prisma.comments.create({
      data: {
        userId: +userId, // 댓글 작성자 ID
        postId: +postId, // 댓글 작성 게시글 ID
        content: content,
      },
    });

    return res
      .status(201)
      .json({ message: '댓글이 생성되었습니다.', data: comment });
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({
      message: '댓글 생성 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// 댓글 조회
router.get('/posts/:postId/comments', async (req, res, next) => {
  const { postId } = req.params;

  try {
    // 게시글 존재 여부 확인
    const post = await prisma.posts.findUnique({
      where: {
        postId: +postId, // postId를 숫자로 변환
      },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    // 댓글 조회
    const comments = await prisma.comments.findMany({
      where: {
        postId: +postId, // postId를 기준으로 댓글 필터링
      },
      orderBy: {
        createdAt: 'desc', // 최신순 정렬
      },
    });

    return res
      .status(200)
      .json({ message: '댓글을 조회했습니다.', data: comments });
  } catch (error) {
    console.error('Error retrieving comments:', error);
    return res.status(500).json({
      message: '댓글 조회 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

// 댓글 삭제
router.delete('/posts/:postId/comments/:commentId', async (req, res, next) => {
  const { postId, commentId } = req.params;
  const { userId } = req.user; // 요청한 사용자의 ID를 확인 (작성자 본인 확인용)

  try {
    // 게시글 존재 여부 확인
    const post = await prisma.posts.findUnique({
      where: {
        postId: +postId,
      },
    });

    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    // 댓글 존재 여부 및 작성자 확인
    const comment = await prisma.comments.findUnique({
      where: {
        commentId: +commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({ message: '댓글이 존재하지 않습니다.' });
    }

    // 댓글 작성자가 맞는지 확인
    if (comment.userId !== +userId) {
      return res.status(403).json({ message: '댓글 삭제 권한이 없습니다.' });
    }

    // 댓글 삭제
    await prisma.comments.delete({
      where: {
        commentId: +commentId,
      },
    });

    return res.status(200).json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({
      message: '댓글 삭제 중 오류가 발생했습니다.',
      error: error.message,
    });
  }
});

export default router;
