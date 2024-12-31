const socket = io();

document.addEventListener('DOMContentLoaded', () => {
  /* 채팅에 들어가기 버튼 클릭 시 실행 */
  document.getElementById('enterChat').addEventListener('click', () => {
    // 이름을 입력받고
    // ****추후 로그인후 쿠키나 세션에 전달된 닉네임을 받아 채팅에 입장하도록 수정!!!!****
    let name = prompt('반갑습니다!', ''); // let으로 변경

    // 이름이 빈칸인 경우
    if (!name) {
      name = '익명';
    }

    // 서버에 새로운 유저가 왔다고 알림
    socket.emit('newUser', name);
  });

  /* 서버로부터 데이터 받은 경우 */
  socket.on('update', (data) => {
    // 화살표 함수로 변경
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
  // window.send로 설정, 전역 함수로 만들어 HTML에서 직접 호출가능
  window.send = function send() {
    // 전역 함수로 설정
    // 입력되어있는 데이터 가져오기
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
