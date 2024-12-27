import express from 'express';
import { prisma } from '../uts/prisma/index.js';
import errModel from '../middlewares/error.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 게시글 생성
router.post('/posts', authMiddleware, async (req, res, next) => {
  try {
    const { title, likeCount, content } = req.body;
    console.log(req.user);
    const profileId = req.user.userId; // 인증된 사용자 profileId
    // profileId가 누락된 경우 오류 처리
    if (!profileId) {
      return res.status(400).json({ message: 'profileId가 필요합니다.' });
    }

    const post = await prisma.posts.create({
      data: {
        title,
        likeCount: likeCount ?? 0, // likeCount가 undefined일 경우 기본값 0으로 설정
        content,
        profileId,
      },
    });

    return res
      .status(201)
      .json({ message: '게시글이 생성되었습니다.', data: post });
  } catch (error) {
    next(error); // 에러를 다음 핸들러로 전달
  }
});

// 게시글 전체 조회
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        profile: true, // 프로필 정보도 포함하여 게시글과 연결된 프로필 정보도 조회
      },
      orderBy: {
        createdAt: 'desc', // 게시글 생성일 기준 내림차순 정렬
      },
    });

    return res
      .status(200)
      .json({ message: '게시글이 전체 조회되었습니다.', data: posts });
  } catch (error) {
    next(error); // 에러를 다음 핸들러로 전달
  }
});

// 게시글 수정
router.patch('/posts/:postId', authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params; // 수정할 게시글의 ID
    const { title, likeCount, content } = req.body; // 수정할 데이터

    // 게시글 업데이트
    const updatedPost = await prisma.posts.update({
      where: { postId: parseInt(postId, 10) }, // ID로 게시글 검색
      data: {
        ...(title && { title }), // title이 전달되면 업데이트
        ...(likeCount !== undefined && { likeCount }), // likeCount 값이 전달되면 업데이트 (0 포함 처리)
        ...(content && { content }), // content가 전달되면 업데이트
      },
    });

    return res
      .status(200)
      .json({ message: '게시글이 수정되었습니다.', data: updatedPost });
  } catch (error) {
    if (error.code === 'P2025') {
      // Prisma에서 리소스가 없을 때 발생하는 에러 처리
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    next(error); // 에러를 다음 핸들러로 전달
  }
});

// 게시글 삭제
router.delete('/posts/:postId', authMiddleware, async (req, res, next) => {
  try {
    const { postId } = req.params;

    // 게시글 존재 여부 확인
    const post = await prisma.posts.findUnique({
      where: { postId: parseInt(postId, 10) }, // postId로 게시글 찾기
    });

    if (!post) {
      return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
    }

    // 게시글 삭제
    await prisma.posts.delete({
      where: { postId: parseInt(postId, 10) },
    });

    return res.status(200).json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    next(error); // 에러를 다음 핸들러로 전달
  }
});

export default router;
