import express from 'express';
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

// Express 라우터 객체 생성
const router = express.Router();

// Prisma Client 인스턴스 생성 (데이터베이스와 상호작용)
const prisma = new PrismaClient();

// Riot API 키를 가져옴
const RIOT_API_KEY = 'RGAPI-f439ab65-a4a0-4beb-9f00-9f8560565640';

// Riot API 데이터 캐싱을 위한 객체와 캐싱 유효 시간(TTL) 설정
const riotDataCache = {}; // 캐싱된 데이터를 저장하는 객체
const CACHE_TTL = 60 * 60 * 1000; // 캐싱 유효 시간: 1시간 (밀리초)

// Riot API 호출 함수
export const fetchRiotData = async (lolNickname) => {
  if (
    riotDataCache[lolNickname] &&
    Date.now() - riotDataCache[lolNickname].timestamp < CACHE_TTL
  ) {
    return riotDataCache[lolNickname].data; // 캐싱된 데이터 반환
  }

  try {
    const riotResponse = await fetch(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(lolNickname)}?api_key=${RIOT_API_KEY}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'Node.js Riot API Client',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        },
      },
    );

    if (!riotResponse.ok) {
      if (riotResponse.status === 403) {
        console.error('API 키가 유효하지 않거나 만료되었습니다.');
      } else if (riotResponse.status === 429) {
        console.error('Rate limit 초과: 요청을 잠시 멈추세요.');
      }
      throw new Error(`Riot API 오류: ${riotResponse.status}`);
    }

    const riotData = await riotResponse.json();

    riotDataCache[lolNickname] = {
      data: {
        lolNickname,
        summonerName: riotData.name,
        summonerLevel: riotData.summonerLevel,
        profileIconId: riotData.profileIconId,
      },
      timestamp: Date.now(),
    };

    return riotDataCache[lolNickname].data;
  } catch (error) {
    console.error(
      `Riot API 호출 중 오류 발생 (${lolNickname}):`,
      error.message,
    );
    return null;
  }
};

// 특정 userId로 사용자 정보를 가져오는 라우터 정의
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params; // 요청 경로에서 userId 추출

  try {
    console.log(`요청된 userId: ${userId}`); // 요청받은 userId 출력
    // 데이터베이스에서 해당 userId를 가진 사용자 정보 검색
    const user = await prisma.users.findUnique({
      where: { userId: parseInt(userId) }, // userId를 정수로 변환하여 검색
      include: {
        Comments: true,
        profiles: {
          select: {
            Posts: true,
            lolNickname: true, // 롤 닉네임
            tier: true, // 티어 정보
            line: true, // 선호 라인
            mostPlay1: true, // 가장 많이 플레이한 챔피언 1
            mostPlay2: true, // 가장 많이 플레이한 챔피언 2
            mostPlay3: true, // 가장 많이 플레이한 챔피언 3
            averageRating: true, // 평균 평가 점수
          },
        },
      },
    });

    // 사용자가 데이터베이스에 없으면 404 상태 코드와 메시지 반환
    if (!user) {
      console.log(`유저를 찾을 수 없습니다: userId=${userId}`);
      return res.status(404).json({ error: '유저를 찾을 수 없습니다.' });
    }

    console.log(`DB에서 찾은 유저 정보:`, user); // 유저 데이터 확인

    // Riot API를 호출하여 각 프로필에 대한 추가 데이터를 가져옴
    const riotDataPromises = user.profiles.map(async (profile) => {
      // 각 프로필의 lolNickname으로 Riot API 호출
      const riotData = await fetchRiotData(profile.lolNickname);

      return {
        lolNickname: profile.lolNickname,
        mostPlay1: profile.mostPlay1,
        mostPlay2: profile.mostPlay2,
        mostPlay3: profile.mostPlay3,
        riotInfo: riotData, // Riot API에서 가져온 추가 데이터
      };
    });

    // 모든 Riot API 요청이 완료될 때까지 대기
    const riotData = await Promise.all(riotDataPromises);

    console.log(`Riot API에서 받은 데이터:`, riotData); // Riot API 데이터 확인

    // 사용자 정보와 Riot API 데이터를 JSON 형식으로 클라이언트에 반환
    res.json({
      user, // 데이터베이스에서 가져온 사용자 정보
      riotData, // Riot API에서 가져온 추가 정보
    });
  } catch (error) {
    // 처리 중 오류가 발생하면 콘솔에 로그를 남기고 500 상태 코드와 메시지 반환
    console.error('유저 데이터 가져오는 중 오류 발생:', error.message);
    res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
});

export default router;
