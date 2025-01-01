const socket = io();

// 쿠키에서 특정 키의 값을 가져오는 함수
function getCookieValue(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', async () => {
  // 현재 URL에서 사용자 ID 추출
  const userId = window.location.pathname.split('/').pop(); // URL의 마지막 부분을 가져옴

  try {
    // 프로필 데이터 가져오기
    const response = await fetch(`/api/profile/${userId}`);
    if (!response.ok) {
      throw new Error('프로필 정보를 불러올 수 없습니다.');
    }

    profile = await response.json();

    // 프로필 정보 렌더링
    const profileContainer = document.getElementById('profile');
    profileContainer.innerHTML = `
      <div class="profile-details">
        <img src="${profile.profileImage || '/static/default-avatar.png'}" alt="프로필 이미지" />
        <h3>${profile.lolNickname}</h3>
        <p>티어: ${profile.tier}</p>
        <p>라인: ${profile.line}</p>
        <p>대표 챔피언: ${profile.mostPlay1}, ${profile.mostPlay2}, ${profile.mostPlay3}</p>
      </div>
    `;
  } catch (error) {
    console.error('프로필 데이터를 불러오는 중 오류 발생:', error);
  }

  /* 채팅에 들어가기 버튼 클릭 시 실행 */
  document.getElementById('enterChat').addEventListener('click', () => {
    // 쿠키에서 닉네임 가져오기
    const nickname = getCookieValue('nickname') || '익명'; // 닉네임이 없으면 '익명'으로 설정

    // 서버에 새로운 유저가 왔다고 알림
    socket.emit('newUser', nickname);
  });

  /* 서버로부터 데이터 받은 경우 */
  socket.on('update', (data) => {
    const chat = document.getElementById('chat');

    const message = document.createElement('div');
    const node = document.createTextNode(`${data.name}: ${data.message}`);
    let className = '';

    // 타입에 따라 적용할 클래스를 다르게 지정
    switch (data.type) {
      case 'message':
        className = 'other';
        break;

      case 'connect':
        className = 'connect';
        break;

      case 'disconnect':
        className = 'disconnect';
        break;
    }

    message.classList.add(className);
    message.appendChild(node);
    chat.appendChild(message);
  });

  /* 메시지 전송 함수 */
  window.send = function send() {
    const message = document.getElementById('test').value;

    // 가져왔으니 데이터 빈칸으로 변경
    document.getElementById('test').value = '';

    // 내가 전송할 메시지 클라이언트에게 표시
    const chat = document.getElementById('chat');
    const msg = document.createElement('div');
    const node = document.createTextNode(message);
    msg.classList.add('me');
    msg.appendChild(node);
    chat.appendChild(msg);

    // 서버로 message 이벤트 전달 + 데이터와 함께
    socket.emit('message', { type: 'message', message: message });
  };

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

document.addEventListener('DOMContentLoaded', () => {
  // 리뷰 버튼 이벤트 등록
  document.getElementById('reviewEnter').addEventListener('click', () => {
    const comment = document.getElementById('comment').value.trim(); // 댓글 내용
    const rating = document.getElementById('rating').value; // 별점
    const nickname = getCookieValue('nickname') || '익명'; // 닉네임이 없으면 '익명'으로 설정
    // 입력값 검증
    if (!comment) {
      alert('댓글을 입력해주세요!');
      return;
    }

    // 리뷰 데이터를 서버로 보내거나 클라이언트에서 처리
    const reviewData = {
      nickname: nickname, // 추후 로그인 시스템으로 사용자 닉네임 연동
      comment: comment,
      rating: rating,
    };

    // 서버에 데이터 전송 (예: socket.io, API 요청 등)
    // socket.emit("newReview", reviewData); // 서버 전송

    // 서버가 없다면 클라이언트에 직접 추가
    addReviewToList(reviewData);

    // 입력 필드 초기화
    document.getElementById('comment').value = '';
    document.getElementById('rating').value = '★';
  });

  // 리뷰 리스트에 리뷰 추가하는 함수
  function addReviewToList(reviewData) {
    const reviewList = document.querySelector('.review-list');

    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');

    // 닉네임
    const nicknameSpan = document.createElement('span');
    nicknameSpan.classList.add('nickname');
    nicknameSpan.textContent = reviewData.nickname;

    // 댓글
    const commentSpan = document.createElement('span');
    commentSpan.classList.add('comment');
    commentSpan.textContent = reviewData.comment;

    // 별점
    const ratingSpan = document.createElement('span');
    ratingSpan.classList.add('rating');
    ratingSpan.textContent = reviewData.rating;

    // 조합
    reviewItem.appendChild(nicknameSpan);
    reviewItem.appendChild(commentSpan);
    reviewItem.appendChild(ratingSpan);

    reviewList.appendChild(reviewItem);
  }
});
