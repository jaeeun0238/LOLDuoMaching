document.getElementById("searchButton").addEventListener("click", async () => {
  const gameName = document.getElementById("gameName").value.trim();
  const tagLine = document.getElementById("tagLine").value.trim();
  const errorMessage = document.getElementById("errorMessage");
  const resultContainer = document.getElementById("resultContainer");
  const summonerInfo = document.getElementById("summonerInfo");

  errorMessage.textContent = "";
  resultContainer.style.display = "none";
  summonerInfo.innerHTML = "";

  if (!gameName || !tagLine) {
    errorMessage.textContent = "닉네임과 태그를 모두 입력해주세요.";
    return;
  }

  try {
    const response = await fetch("/api/summoner-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameName, tagLine }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "조회 중 문제가 발생했습니다.");
    }

    const data = await response.json();
    resultContainer.style.display = "block";

    summonerInfo.innerHTML = `
          <p><strong>소환사 이름:</strong> ${data.fullName}</p>
          <p><strong>레벨:</strong> ${data.summonerLevel}</p>
          <img src="${data.profileIconLink}" alt="Profile Icon">
        `;

    // 프로필 저장을 위한 데이터 준비
    const profileData = {
      line: formData.get("line"),
      tier: formData.get("tier"),
      mostPlay1: formData.get("mostChampion1"), // 첫 번째 챔피언
      mostPlay2: formData.get("mostChampion2"), // 두 번째 챔피언
      mostPlay3: formData.get("mostChampion3"), // 세 번째 챔피언
      // Riot API에서 받은 정보 추가
      summonerName: data.fullName, // 실제 소환사 이름으로 대체
      level: data.summonerLevel, // 실제 레벨로 대체
      profileImage: data.profileIconLink, // 실제 이미지 링크로 대체
    };

    // 프로필 저장 요청
    await saveProfile(profileData);
  } catch (error) {
    console.error("조회 실패:", error.message);
    errorMessage.textContent = error.message;
  }
});

async function saveProfile(profileData) {
  try {
    const response = await fetch("/api/save-profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
      credentials: "include", // 쿠키를 포함하여 요청
    });

    if (response.ok) {
      alert("프로필이 성공적으로 저장되었습니다.");
      // 필요 시 리다이렉트 또는 다른 처리
    } else {
      const errorData = await response.json();
      alert(errorData.message || "프로필 저장 실패");
    }
  } catch (error) {
    console.error("프로필 저장 중 오류 발생:", error);
    alert("프로필 저장 중 오류가 발생했습니다.");
  }
}
