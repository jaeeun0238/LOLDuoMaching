document.addEventListener('DOMContentLoaded', async () => {
  try {
    // URL에서 postId만 안전하게 추출
    const pathSegments = window.location.pathname.split('/');
    const postId = pathSegments[pathSegments.length - 1];

    // postId가 숫자인지 확인
    if (!postId || isNaN(postId)) {
      throw new Error('올바르지 않은 게시글 ID입니다.');
    }

    const apiUrl = `/api/posts/select/${postId}`;
    console.log('Requesting URL:', apiUrl); // 디버깅용

    const response = await fetch(apiUrl);
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error('게시글을 불러오는데 실패했습니다.');
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error('게시글 데이터가 없습니다.');
    }

    const post = result.data;

    // 데이터 표시
    if (document.getElementById('title'))
      document.getElementById('title').textContent = post.title;
    if (document.getElementById('content'))
      document.getElementById('content').textContent = post.content;
    if (document.getElementById('postImage') && post.postImage) {
      document.getElementById('postImage').src = post.postImage;
    }
    if (document.getElementById('likeCount'))
      document.getElementById('likeCount').textContent = post.likeCount;
    if (document.getElementById('createdAt')) {
      document.getElementById('createdAt').textContent = new Date(
        post.createdAt,
      ).toLocaleString();
    }

    // 프로필 정보 표시
    if (post.profile) {
      if (document.getElementById('nickname')) {
        document.getElementById('nickname').textContent =
          post.profile.user.nickname;
      }
      if (document.getElementById('lolNickname')) {
        document.getElementById('lolNickname').textContent =
          post.profile.lolNickname;
      }
      if (document.getElementById('tier')) {
        document.getElementById('tier').textContent = post.profile.tier;
      }
      if (document.getElementById('line')) {
        document.getElementById('line').textContent = post.profile.line;
      }
    }
  } catch (error) {
    console.error('상세 에러 정보:', error);
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = error.message;
    document.body.insertBefore(errorElement, document.body.firstChild);
  }
});
