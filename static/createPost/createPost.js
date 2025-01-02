document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('createPostForm');
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault(); // 기본 폼 제출 동작 방지

      // 사용자가 입력한 값 가져오기
      const title = document.getElementById('postTitle').value;
      const imageUrl = document.getElementById('imageUrl').value; // 이미지 링크 가져오기
      const content = document.getElementById('postContent').value;

      const postData = {
        title,
        imageUrl, // 이미지 링크 추가
        content,
      };

      try {
        // 서버에 게시글 생성 요청
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });

        // 응답 처리
        if (response.ok) {
          const result = await response.json(); // 성공적인 응답을 JSON으로 읽기
          alert(result.message); // 성공 메시지 표시
          // 폼 초기화
          form.reset();
        } else {
          const text = await response.text(); // 에러 응답을 텍스트로 읽기
          console.error('서버 응답:', text); // 서버 응답 로그
          alert('게시글 생성 중 오류가 발생했습니다.'); // 일반적인 오류 메시지 표시
        }
      } catch (error) {
        console.error('게시글 생성 중 오류 발생:', error);
        alert('서버 오류가 발생했습니다.');
      }
    });
  } else {
    console.error('폼 요소를 찾을 수 없습니다.');
  }
});
