document
  .getElementById('signupForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault(); // 기본 폼 제출 동작 방지

    // 사용자가 입력한 값 가져오기
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userName = document.getElementById('userName').value;
    const nickname = document.getElementById('nickname').value;

    const signupData = {
      email,
      password,
      userName,
      nickname,
    };

    try {
      // 서버에 회원가입 요청
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      });

      // 응답 처리
      if (response.ok) {
        const result = await response.json();
        document.getElementById('signupMessage').innerText = result.message; // 성공 메시지 표시
        // 인증 섹션은 항상 보여주므로 추가적인 동작은 필요 없음
      } else {
        const errorResult = await response.json();
        document.getElementById('signupMessage').innerText =
          errorResult.message; // 에러 메시지 표시
      }
    } catch (error) {
      console.error('회원가입 요청 중 오류 발생:', error);
      document.getElementById('signupMessage').innerText =
        '서버 오류가 발생했습니다.';
    }
  });

// 인증 버튼 클릭 이벤트 처리
document.getElementById('verifyButton').addEventListener('click', async () => {
  const verificationCode = document.getElementById('verificationCode').value;
  const email = document.getElementById('email').value; // 이메일을 다시 가져옵니다.

  try {
    // 인증 요청
    const response = await fetch('/api/email-verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ verificationCode, email }),
    });

    // 응답 처리
    if (response.ok) {
      const result = await response.json();
      document.getElementById('verificationMessage').innerText = result.message; // 성공 메시지 표시
      // 필요에 따라 로그인 페이지로 리다이렉트
      setTimeout(() => {
        window.location.href = '/login'; // 로그인 페이지로 이동
      }, 2000);
    } else {
      const errorResult = await response.json();
      document.getElementById('verificationMessage').innerText =
        errorResult.message; // 에러 메시지 표시
    }
  } catch (error) {
    console.error('인증 요청 중 오류 발생:', error);
    document.getElementById('verificationMessage').innerText =
      '서버 오류가 발생했습니다.';
  }
});
