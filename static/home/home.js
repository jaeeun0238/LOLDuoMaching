document.addEventListener('DOMContentLoaded', () => {
  const logoutButton = document.getElementById('logoutButton');

  if (logoutButton) {
    logoutButton.addEventListener('click', async (event) => {
      event.preventDefault(); // 기본 링크 동작 방지

      try {
        const response = await fetch('/api/sign-out', {
          method: 'POST',
          credentials: 'include', // 쿠키를 포함하여 요청
        });

        if (response.ok) {
          // 로그아웃 성공 시 처리
          alert('로그아웃 성공');
          window.location.href = '/login'; // 로그인 페이지로 리다이렉트
        } else {
          const errorData = await response.json();
          alert(errorData.message || '로그아웃 실패');
        }
      } catch (error) {
        console.error('로그아웃 중 오류 발생:', error);
        alert('로그아웃 중 오류가 발생했습니다.');
      }
    });
  } else {
    console.error('로그아웃 버튼 요소를 찾을 수 없습니다.');
  }
});
