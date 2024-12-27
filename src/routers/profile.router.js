// src/routers/profile.router.js
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/save-profile", authMiddleware, async (req, res) => {
  const {
    lolNickname,
    profileImage,
    tier,
    line,
    mostPlay1,
    mostPlay2,
    mostPlay3,
  } = req.body;

  console.log(lolNickname);
  console.log(profileImage);
  console.log(tier);
  console.log(line);
  console.log(mostPlay1);
  console.log(mostPlay2);
  console.log(mostPlay3);

  const userId = req.user.userId; // authMiddleware에서 설정된 userId 사용
  if (!userId) {
    return res
      .status(401)
      .json({ message: "인증된 사용자 정보가 필요합니다." });
  }

  // 데이터 유효성 검사
  if (
    !lolNickname ||
    !tier ||
    !line ||
    !mostPlay1 ||
    !mostPlay2 ||
    !mostPlay3
  ) {
    return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
  }

  try {
    const userExists = await prisma.users.findUnique({
      where: { userId: userId },
    });

    if (!userExists) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    // 프로필 데이터베이스에 저장
    const newProfile = await prisma.profiles.create({
      data: {
        lolNickname,
        profileImage,
        tier,
        line,
        mostPlay1,
        mostPlay2,
        mostPlay3,
      },
    });

    res.status(201).json({
      message: "프로필이 성공적으로 생성되었습니다.",
      profile: newProfile,
    });
  } catch (error) {
    console.error("프로필 생성 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

export default router;
