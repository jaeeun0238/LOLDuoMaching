document.addEventListener('DOMContentLoaded', async () => {
  const postId = window.location.pathname.split('/').pop(); // URL에서 postId 추출

  // 게시글 데이터 로드
  try {
    const response = await fetch(`/api/posts/select/${postId}`); // API 호출
    if (response.ok) {
      const { data } = await response.json(); // 응답 데이터 파싱
      displayPostData(data); // 게시글 데이터 화면 표시
      updateComments(data.comments || []); // 댓글 리스트 업데이트
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
      const commentInput = document.getElementById('commentInput').value.trim();

      if (!commentInput) {
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
          const { newComment } = await response.json(); // 서버에서 새 댓글 데이터 반환
          alert('댓글이 추가되었습니다.');
          addCommentToUI(newComment); // 새 댓글 UI에 추가
          document.getElementById('commentInput').value = ''; // 댓글 입력란 초기화
        } else {
          alert('댓글 작성 중 오류가 발생했습니다.');
        }
      } catch (error) {
        console.error('댓글 작성 중 오류 발생:', error);
      }
    });

  // 채팅 전송 이벤트
  document.getElementById('sendChat').addEventListener('click', () => {
    const chatInput = document.getElementById('chatInput').value.trim();

    if (!chatInput) {
      alert('메시지를 입력하세요.');
      return;
    }

    addChatMessage(chatInput); // 채팅 메시지를 UI에 추가
    document.getElementById('chatInput').value = ''; // 입력 필드 초기화
  });
});

// 게시글 데이터를 화면에 표시하는 함수
function displayPostData(data) {
  document.getElementById('postTitle').textContent = data.title;
  document.getElementById('nickname').textContent = `작성자: ${data.nickname}`;
  document.getElementById('postImage').src = data.postImage;
  document.getElementById('postContent').textContent = data.content;
  document.getElementById('likeCount').textContent =
    `❤️ 좋아요: ${data.likeCount}`;
  document.getElementById('createdAt').textContent =
    `작성일: ${new Date(data.createdAt).toLocaleString()}`;
}

// 댓글 리스트를 업데이트하는 함수
function updateComments(comments) {
  const commentsList = document.getElementById('commentsList');
  commentsList.innerHTML = ''; // 기존 댓글 초기화
  comments.forEach((comment) => addCommentToUI(comment)); // 각 댓글 추가
}

// 댓글을 UI에 추가하는 함수
function addCommentToUI(comment) {
  const commentsList = document.getElementById('commentsList');
  const li = document.createElement('li');
  li.textContent = `${comment.nickname}: ${comment.content}`;
  commentsList.appendChild(li);
}

// 채팅 메시지를 UI에 추가하는 함수
function addChatMessage(message) {
  const chatBox = document.getElementById('chatBox');
  const newMessage = document.createElement('div');
  newMessage.textContent = message;
  chatBox.appendChild(newMessage);
}
