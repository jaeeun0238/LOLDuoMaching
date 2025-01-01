document.addEventListener('DOMContentLoaded', async () => {
  const postId = window.location.pathname.split('/').pop(); // URL에서 postId 추출

  try {
    // 게시글 데이터 조회
    const response = await fetch(`/post/select/${postId}`);
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
    const profileData = data.profile; // profileData를 올바르게 참조
    document.getElementById('lolNickname').textContent =
      profileData.lolNickname;
    document.getElementById('tier').textContent = profileData.tier;
    document.getElementById('line').textContent = profileData.line;
  } catch (error) {
    console.error('데이터를 불러오는 중 오류 발생:', error);
    alert('데이터를 불러올 수 없습니다. 다시 시도해주세요.');
  }
});
