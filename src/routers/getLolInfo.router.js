import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import authMiddleware from "../middlewares/auth.middleware.js";

dotenv.config();
const router = express.Router();
const RIOT_API_KEY = process.env.RIOT_API_KEY;

/**
 * 닉네임과 태그를 입력받아 소환사 정보를 반환하는 API
 * POST /api/summoner-info
 * @body {string} gameName - 소환사 이름
 * @body {string} tagLine - 소환사 태그
 * @returns {object} { fullName, profileIconLink, summonerLevel }
 */
router.post("/summoner-info", authMiddleware, async (req, res) => {
  const { gameName, tagLine } = req.body;

  const userId = req.user.userId; // authMiddleware에서 설정된 userId 사용
  if (!userId) {
    return res
      .status(401)
      .json({ message: "인증된 사용자 정보가 필요합니다." });
  }

  if (!gameName || !tagLine) {
    return res
      .status(400)
      .json({ message: "gameName과 tagLine은 필수입니다." });
  }

  try {
    // Step 1: Riot ID로 PUUID 가져오기
    const accountResponse = await axios.get(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    const { puuid } = accountResponse.data;

    // Step 2: PUUID로 소환사 정보 가져오기
    const summonerResponse = await axios.get(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      { headers: { "X-Riot-Token": RIOT_API_KEY } }
    );

    const { profileIconId, summonerLevel } = summonerResponse.data;

    // 프로필 이미지 링크 생성
    const profileIconLink = `https://raw.communitydragon.org/latest/game/assets/ux/summonericons/profileicon${profileIconId}.png`;

    // 응답 데이터
    return res.status(200).json({
      fullName: `${gameName}#${tagLine}`,
      profileIconLink,
      summonerLevel,
    });
  } catch (error) {
    console.error(
      "API 요청 중 오류 발생:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ message: "API 요청 중 오류가 발생했습니다." });
  }
});

export default router;
