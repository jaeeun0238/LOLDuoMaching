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
const RIOT_API_KEY = 'RGAPI-736bb5d3-40e4-4459-91cb-e92393b28e69';

// Riot API 데이터 캐싱을 위한 객체와 캐싱 유효 시간(TTL) 설정
const riotDataCache = {}; // 캐싱된 데이터를 저장하는 객체
const CACHE_TTL = 60 * 60 * 1000; // 캐싱 유효 시간: 1시간 (밀리초)

// Riot API 호출 함수
const fetchRiotData = async (lolNickname) => {
  // 캐싱된 데이터가 있고, 유효 시간 내에 있으면 캐싱 데이터 반환
  if (
    riotDataCache[lolNickname] &&
    Date.now() - riotDataCache[lolNickname].timestamp < CACHE_TTL
  ) {
    return riotDataCache[lolNickname].data; // 캐싱된 데이터 반환
  }

  try {
    // Riot API 호출: 소환사 이름(lolNickname)을 사용해 Riot Games API에서 데이터 가져오기
    const riotResponse = await fetch(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(lolNickname)}?api_key=${RIOT_API_KEY}`,
      {
        method: 'GET', // HTTP GET 메서드 사용
        headers: {
          // 요청하는 클라이언트 정보 (Riot API에 필수로 요구됨)
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7', // 응답 언어 우선순위
          'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8', // 문자 인코딩
          Origin: 'https://developer.riotgames.com', // 요청의 출처 (필수 헤더)
        },
      },
    );

    // API 호출 실패 처리 (응답 코드가 200이 아닌 경우)
    if (!riotResponse.ok) {
      throw new Error(`Riot API 오류: ${riotResponse.status}`);
    }

    // API 응답 데이터를 JSON으로 파싱
    const riotData = await riotResponse.json();

    // 캐싱 데이터 저장: 소환사 정보와 타임스탬프
    riotDataCache[lolNickname] = {
      data: {
        lolNickname, // 요청한 소환사 이름
        summonerName: riotData.name, // 소환사 이름
        summonerLevel: riotData.summonerLevel, // 소환사 레벨
        profileIconId: riotData.profileIconId, // 소환사 프로필 아이콘 ID
      },
      timestamp: Date.now(), // 데이터가 캐싱된 시간
    };

    return riotDataCache[lolNickname].data; // 캐싱된 데이터를 반환
  } catch (error) {
    // API 호출 중 오류 발생 시 콘솔에 출력
    console.error(
      `Riot API 호출 중 오류 발생 (${lolNickname}):`,
      error.message,
    );
    return null; // 오류 발생 시 null 반환
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
        profiles: {
          select: {
            lolNickname: true, // 롤 닉네임
            tier: true, // 티어 정보
            line: true, // 선호 라인
            mostPlay1: true, // 가장 많이 플레이한 챔피언 1
            mostPlay2: true, // 가장 많이 플레이한 챔피언 2
            mostPlay3: true, // 가장 많이 플레이한 챔피언 3
            averageRating: true, // 평균 평가 점수
          },
        },
        posts: true, // 사용자 게시글 포함
        comments: true, // 사용자 댓글 포함
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
