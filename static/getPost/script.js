/*
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

*/
document.addEventListener('DOMContentLoaded', async () => {
  const postId = window.location.pathname.split('/').pop(); // URL에서 postId 추출
  const apiUrl = `/posts/select/${postId}`; // API URL 구성

  try {
    // 게시글 데이터 조회
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('게시글을 불러오는 데 실패했습니다.');
    }

    const { data } = await response.json(); // API 응답에서 데이터 추출

    // 데이터 반영
    document.getElementById('title').textContent = data.title;
    document.getElementById('nickname').textContent = data.nickname;
    document.getElementById('likeCount').textContent = data.likeCount;
    document.getElementById('createdAt').textContent = new Date(
      data.createdAt,
    ).toLocaleDateString();
    document.getElementById('updatedAt').textContent = new Date(
      data.updatedAt,
    ).toLocaleDateString();
    document.getElementById('postImage').src = data.postImage;
    document.getElementById('content').textContent = data.content;

    // 프로필 데이터 반영
    const profileData = data.profile;
    document.getElementById('lolNickname').textContent =
      profileData.lolNickname;
    document.getElementById('tier').textContent = profileData.tier;
    document.getElementById('line').textContent = profileData.line;
  } catch (error) {
    console.error('데이터를 불러오는 중 오류 발생:', error);
    alert('데이터를 불러올 수 없습니다. 다시 시도해주세요.');
  }
});

// 뎃글창<- 가져오기, 수정버튼 추가
