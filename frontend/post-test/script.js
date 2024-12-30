// script.js

// 게시글 데이터를 렌더링하는 함수
function renderPosts(posts) {
  const postContainer = document.getElementById('post-container');
  postContainer.innerHTML = ''; // 기존 콘텐츠 초기화

  posts.forEach((post) => {
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    card.innerHTML = `
          <div class="row g-0">
              <div class="col-md-3">
                  <img src="${post.imageUrl || 'https://via.placeholder.com/200'}" class="img-fluid rounded-start" alt="..." style="width: 200px; height: 200px; object-fit: cover;">
              </div>
              <div class="col-md-8">
                  <div class="card-body">
                      <h5 class="card-title">${post.title}</h5>
                      <p class="card-text">${post.content}</p>
                      <p class="card-text"><small class="text-body-secondary">좋아요: ${post.likeCount}</small></p>
                  </div>
              </div>
          </div>
      `;

    postContainer.appendChild(card);
  });
}

// 게시글 데이터를 가져오는 함수
async function fetchPosts() {
  try {
    const response = await fetch('/api/posts');
    const data = await response.json();

    if (response.ok) {
      renderPosts(data.data);
    } else {
      console.error(data.message);
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }
}

// 정렬 기준 변경 시 데이터 정렬 함수
function sortPosts(posts, criterion) {
  if (criterion === 'likes') {
    return posts.sort((a, b) => b.likeCount - a.likeCount);
  } else if (criterion === 'title') {
    return posts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (criterion === 'updatedAt') {
    return posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
  return posts;
}

// 정렬 드롭다운 이벤트 리스너
async function handleSortChange() {
  const criterion = document.getElementById('sort-dropdown').value;
  const response = await fetch('/api/posts');
  const data = await response.json();

  if (response.ok) {
    const sortedPosts = sortPosts(data.data, criterion);
    renderPosts(sortedPosts);
  } else {
    console.error(data.message);
  }
}

// 초기화
function init() {
  fetchPosts();
  document
    .getElementById('sort-dropdown')
    .addEventListener('change', handleSortChange);
}

document.addEventListener('DOMContentLoaded', init);
