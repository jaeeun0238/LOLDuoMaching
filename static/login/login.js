document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // 기본 폼 제출 방지

    const email = document.getElementById("username").value; // 이메일 입력값
    const password = document.getElementById("password").value; // 비밀번호 입력값
    const errorMessage = document.getElementById("errorMessage"); // 에러 메시지 표시 요소
    const message = document.getElementById("message"); // 성공 메시지 표시 요소

    errorMessage.textContent = ""; // 이전 에러 메시지 초기화
    message.textContent = ""; // 이전 성공 메시지 초기화

    try {
      const response = await fetch("/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), // JSON 형식으로 요청 본문 설정
      });

      const data = await response.json(); // 응답 데이터 파싱

      if (response.ok) {
        // 로그인 성공
        // 쿠키에서 userId와 token을 가져옵니다.
        const cookies = document.cookie.split("; ");
        let userId = null;
        let token = null;

        cookies.forEach((cookie) => {
          const [key, value] = cookie.split("=");
          if (key === "userId") {
            userId = value;
          } else if (key === "token") {
            token = value;
          }
        });
        message.textContent = data.message; // 성공 메시지 표시
        // 로그인 후 리다이렉트 또는 다른 작업 수행
        window.location.href = `/userProfile/${userId}`; // 예: 마이페이지로 리다이렉트
      } else {
        // 로그인 실패
        errorMessage.textContent = data.message; // 에러 메시지 표시
      }
    } catch (error) {
      // 네트워크 오류 등 예외 처리
      errorMessage.textContent = "서버와의 연결에 문제가 발생했습니다.";
      console.error("Error:", error);
    }
  });
