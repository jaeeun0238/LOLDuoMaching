document.addEventListener('DOMContentLoaded', async () => {
  const postId = window.location.pathname.split('/').pop(); // URL에서 postId 추출

  // 게시글 데이터를 로드합니다.
  try {
    const response = await fetch(`/posts/select/${postId}`);
    if (response.ok) {
      const { data } = await response.json();

      // 게시글 데이터를 화면에 표시합니다.
      document.getElementById('postTitle').textContent = data.title;
      document.getElementById('nickname').textContent =
        `작성자: ${data.nickname}`;
      document.getElementById('postImage').src = data.postImage;
      document.getElementById('postContent').textContent = data.content;
      document.getElementById('likeCount').textContent =
        `좋아요: ${data.likeCount}`;
      document.getElementById('createdAt').textContent = `작성일: ${new Date(
        data.createdAt,
      ).toLocaleString()}`;
    } else {
      alert('게시글을 불러오지 못했습니다.');
    }
  } catch (error) {
    console.error('게시글 데이터를 로드하는 중 오류 발생:', error);
  }

  // 댓글 작성 이벤트
  document
    .getElementById('submitComment')
    .addEventListener('click', async () => {
      const commentInput = document.getElementById('commentInput').value;

      if (!commentInput.trim()) {
        alert('댓글 내용을 입력하세요.');
        return;
      }

      try {
        const response = await fetch(`/comments/add/${postId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: commentInput }),
        });

        if (response.ok) {
          alert('댓글이 추가되었습니다.');
          document.getElementById('commentInput').value = ''; // 댓글 입력란 초기화
          location.reload(); // 페이지 새로고침으로 댓글 업데이트
        } else {
          alert('댓글 작성 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('댓글 작성 중 오류 발생:', error);
      }
    });

  // 채팅 전송 이벤트
  document.getElementById('sendChat').addEventListener('click', () => {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();

    if (!message) {
      alert('메시지를 입력하세요.');
      return;
    }

    // 채팅창에 메시지 추가
    const chatBox = document.getElementById('chatBox');
    const newMessage = document.createElement('div');
    newMessage.textContent = message;
    chatBox.appendChild(newMessage);

    chatInput.value = ''; // 입력 필드 초기화
  });
});
