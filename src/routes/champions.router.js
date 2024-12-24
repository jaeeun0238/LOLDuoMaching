// ./src/routes/champions.router.js
import express from 'express';
import axios from 'axios';
import { prisma } from '../utils/prisma/index.js';

const championRoutes = express.Router();

// 기본 페이지
championRoutes.get('/champions', async (req, res) => {
  // res.json({ success: true });
  try {
    const gstChampions = await prisma.champions.findMany({
      select: { name: true, image: true },
    });
    if (!gstChampions || gstChampions.length) {
      return res
        .status(404)
        .json({ success: false, message: '저장된 챔피언이 없습니다' });
    }
    res.status(200).json({ success: true, message: gstChampions });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: `서버 에러: ${error.message}` });
  }
});

// 챔피언 리스트 업데이트
// post http://localhost:3000/api/update_champion_list/13.6.1
// championRoutes.post('/update_champion_list/:version', async (req, res) => {
//version형식 : '13.6.1'

championRoutes.post('/update_champion_list', async (req, res) => {
  //const { version } = req.params;
  const { version } = req.body;
  if (!version) {
    return res
      .status(400)
      .json({ success: false, message: '버전이 필요합니다' });
  }
  try {
    // Riot API 정보
    const RIOT_API_URL = `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`;

    // Riot API 호출
    const { data } = await axios.get(RIOT_API_URL);
    const champions = data.data;
    if (!champions) {
      return res.status(404).json({
        success: false,
        message: 'Riot API에서 챔피언 데이터를 가져오지 못했습니다',
      });
    }

    // 기존 데이터 삭제
    await prisma.champions.deleteMany();
    console.log('이게 될리가???');

    // 새 데이터 삽입
    const championList = Object.values(champions).map((champ) => ({
      //id: champ.id,
      name: champ.name,
      image: `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`,
    }));

    // 오류발생
    // TypeError: Cannot read properties of undefined (reading 'createMany')
    await prisma.champions.createMany({ data: championList });

    res.status(200).json({
      success: true,
      message: '챔피언 리스트 업데이트 완료!',
      data: championList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default championRoutes;
