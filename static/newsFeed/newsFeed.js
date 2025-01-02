document.addEventListener('DOMContentLoaded', async () => {
  const postsContainer = document.getElementById('postsContainer');
  const paginationContainer = document.getElementById('pagination');
  const sortSelect = document.createElement('select'); // 정렬 선택을 위한 셀렉트 박스
  const postsPerPage = 8; // 한 페이지에 보여줄 게시글 수
  let currentPage = 1; // 현재 페이지
  let posts = []; // 전체 게시글 저장

  // 정렬 옵션 추가
  const sortOptions = [
    { value: 'latest', text: '최신순' },
    { value: 'likes', text: '좋아요순' },
  ];

  sortOptions.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.text;
    sortSelect.appendChild(opt);
  });

  // 정렬 선택 박스를 DOM에 추가
  postsContainer.parentNode.insertBefore(sortSelect, postsContainer);

  try {
    const response = await fetch('/api/getPosts'); // 서버의 게시글 API 호출
    if (!response.ok) {
      const errorMessage = await response.text(); // 응답 내용을 텍스트로 가져오기
      throw new Error(
        `게시글을 가져오는 데 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorMessage}`,
      );
    }

    const result = await response.json();
    posts = result.data; // 전체 게시글 저장

    // 페이지네이션 초기화
    renderPosts();
    setupPagination();
  } catch (error) {
    console.error('Error fetching posts:', error); // 에러 메시지 출력
    postsContainer.innerHTML =
      '<p>게시글을 불러오는 데 오류가 발생했습니다.</p>';
  }

  // 정렬 변경 시 게시글 렌더링
  sortSelect.addEventListener('change', () => {
    currentPage = 1; // 페이지를 1로 초기화
    renderPosts(); // 게시글 렌더링
    setupPagination(); // 페이지네이션 업데이트
  });

  function renderPosts() {
    postsContainer.innerHTML = ''; // 기존 게시글 초기화
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const currentPosts = getSortedPosts().slice(startIndex, endIndex); // 현재 페이지의 게시글

    currentPosts.forEach((post) => {
      const postElement = document.createElement('div');
      postElement.classList.add('post');

      // 클릭 이벤트 추가
      postElement.onclick = () => {
        window.location.href = `http://localhost:3000/post/select/${post.postId}`; // postId를 URL에 포함
      };

      postElement.innerHTML = `
                    <img src="${post.postImage}" alt="${post.title}" />
                      <h3 class="post-title">${post.title}</h3>
                      <p class="like-count">❤ ${post.likeCount}</p>
                      <p class="post-content" style="display: none;">${post.content}</p>
                      <p class="createdAt" style="display: none;">${new Date(post.createdAt).toLocaleString()}</p>
                      <p class="updatedAt" style="display: none;">${new Date(post.updatedAt).toLocaleString()}</p>
                  `;

      postsContainer.appendChild(postElement);
    });
  }

  function getSortedPosts() {
    const sortValue = sortSelect.value;
    return [...posts].sort((a, b) => {
      if (sortValue === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt); // 최신순 정렬
      } else if (sortValue === 'likes') {
        return b.likeCount - a.likeCount; // 좋아요순 정렬
      }
      return 0; // 기본값
    });
  }

  function setupPagination() {
    paginationContainer.innerHTML = ''; // 기존 페이지네이션 초기화
    const totalPages = Math.ceil(getSortedPosts().length / postsPerPage); // 총 페이지 수

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.onclick = () => {
        currentPage = i; // 현재 페이지 업데이트
        renderPosts(); // 게시글 렌더링
      };
      paginationContainer.appendChild(pageButton);
    }
  }
});
