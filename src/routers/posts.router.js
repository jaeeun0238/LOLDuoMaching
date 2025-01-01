import express from 'express';
import { prisma } from '../uts/prisma/index.js';
import errModel from '../middlewares/error.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/posts', authMiddleware, async (req, res, next) => {
  try {
    const { title, content, imageUrl } = req.body;
    const userId = req.user;

    // userId로 profileId 조회
    const profile = await prisma.profiles.findFirst({
      where: { userId: userId.id }, // userId가 객체가 아니라 단일 값이어야 함
    });

    // profile이 없을 경우 오류 처리
    if (!profile) {
      return res.status(404).json({ message: '프로필이 존재하지 않습니다.' });
    }
    const profileId = profile.profileId; // profileId를 가져옴

    const post = await prisma.posts.create({
      data: {
        title,
        likeCount: 0, // likeCount가 undefined일 경우 기본값 0으로 설정
        content,
        postImage: imageUrl,
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

// 게시글 조회
// 뎃글 조회, 체팅 기능 추가하기
router.get('/posts/select/:postId', async (req, res, next) => {
  const { postId } = req.params; // 조회할 게시글의 ID
  try {
    const post = await prisma.posts.findUnique({
      where: { postId: parseInt(postId, 10) }, // ID로 게시글 검색
      select: {
        title: true,
        postImage: true,
        likeCount: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        profile: {
          select: {
            lolNickname: true,
            tier: true,
            line: true,

            user: {
              select: {
                nickname: true, // 닉네임 포함
              },
            },
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    // 결과 데이터에 닉네임 추가
    const result = {
      nickname: post.profile.user.nickname,
      title: post.title,
      postImage: post.postImage,
      likeCount: post.likeCount,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
    const coments = [];
    return res
      .status(200)
      .json({ message: '게시글이 조회되었습니다.', data: result });
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    next(error); // 에러를 다음 핸들러로 전달
  }
});

// 게시글 전체 조회
router.get('/getPosts', async (req, res, next) => {
  // try {
  //   const { userId, nickname } = req.user;

  //   const profile = await prisma.profiles.findFirst({
  //     where: { userId: userId },
  //   });

  //   // const profileId = profile.profileId;

  //   // const lolNickname = profile.lolNickname; // lolNickname 가져옴

  //   const posts = await prisma.posts.findMany({
  //     include: {
  //       profile: true, // 프로필 정보도 포함하여 게시글과 연결된 프로필 정보도 조회
  //     },
  //     orderBy: {
  //       createdAt: 'desc', // 게시글 생성일 기준 내림차순 정렬
  //     },
  //   });

  //   return res.status(200).json({
  //     message: '게시글이 전체 조회되었습니다.',
  //     data: posts,
  //     nickname,
  //   });
  // } catch (error) {
  //   next(error); // 에러를 다음 핸들러로 전달
  // }
  const posts = await prisma.posts.findMany({
    select: {
      postId: true,
      postImage: true,
      title: true,
      likeCount: true,
      content: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return res.status(200).json({ data: posts });
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
