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
        body: JSON.stringify({ title, content, postImage }),
        // body: JSON.stringify({ title, content }),
      });
      // 해당 게시글로 페이지 이동

      // 응답 처리
      if (response.ok) {
        const result = await response.json();
        document.getElementById('signupMessage').innerText = result.message; // 성공 메시지 표시
        // 필요에 따라 게시물 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = '/getPost'; // 게시물 페이지로 이동
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || '게시글 저장에 실패했습니다.');
        // const errorResult = await response.json();
        // document.getElementById('signupMessage').innerText =
        //   errorResult.message; // 에러 메시지 표시
      }
    } catch (error) {
      console.error('게시글 저장 실패:', error);
      errorMessage.textContent =
        error.message || '알 수 없는 오류가 발생했습니다.';
    }
  });
