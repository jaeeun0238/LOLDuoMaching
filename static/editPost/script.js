document
  .getElementById('postSaveButton')
  .addEventListener('click', async () => {
    const title = document.getElementById('postTitle').value.trim(); // 제목 입력값
    const content = document.getElementById('postContent').value.trim(); // 내용 입력값
    const postImage = document.getElementById('postImage').value.trim(); // 내용 입력값
    const errorMessage = document.getElementById('errorMessage'); // 에러 메시지 표시 요소
    const message = document.getElementById('message'); // 성공 메시지 표시 요소

    errorMessage.textContent = ''; // 이전 에러 메시지 초기화
    message.textContent = ''; // 이전 성공 메시지 초기화

    if (!title || !content || !postImage) {
      errorMessage.textContent = '게시글의 제목과 내용을을 모두 입력해주세요.';
      return;
    }
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',

        body: JSON.stringify({ title, content }),
      });
      if (!response) {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시글 저장에 실패했습니다.');
      }
      const data = await response.json(); // 응답 데이터 파싱  message.textContent = data.message || '게시글이 성공적으로 저장되었습니다.';
    } catch (error) {
      console.error('개시글 저장 실패:', error);
      errorMessage.textContent =
        error.message || '알 수 없는 오류가 발생했습니다.';
    }
  });
