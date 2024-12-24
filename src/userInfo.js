// userInfo.js
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const RIOT_API_KEY = process.env.RIOT_API_KEY;

// userId로 유저 정보 가져오기
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // 데이터베이스에서 유저 데이터 가져오기
    const user = await prisma.users.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        profiles: true,
        posts: true,
        comments: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
    }

    // lolNickname을 기반으로 Riot API에서 추가 정보 가져오기
    const riotDataPromises = user.profiles.map(async (profile) => {
      try {
        // Riot API 호출 로직 작성 (npm 사용)
        const riotResponse = await fetch(
          `https://<RIOT_API_ENDPOINT>/summoner/v4/summoners/by-name/${profile.lolNickname}?api_key=${RIOT_API_KEY}`,
        );
        const riotData = await riotResponse.json();
        return {
          lolNickname: profile.lolNickname,
          riotData,
        };
      } catch (error) {
        console.error(
          'Riot API에서 데이터 가져오는 중 오류 발생:',
          error.message,
        );
        return { lolNickname: profile.lolNickname, riotData: null };
      }
    });

    const riotData = await Promise.all(riotDataPromises);

    // 유저 데이터와 Riot API 데이터를 합쳐서 반환
    res.json({
      user,
      riotData,
    });
  } catch (error) {
    console.error('유저 데이터 가져오는 중 오류 발생:', error.message);
    res.status(500).json({ error: '서버 내부 오류' });
  }
});

export default router;
