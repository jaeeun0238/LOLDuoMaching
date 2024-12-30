// JavaScript 코드
const createPostCards = (posts) => {
  const container = document.getElementById('post-container'); // 게시글 카드가 들어갈 컨테이너
  container.innerHTML = ''; // 기존 카드 제거

  posts.forEach((post) => {
    // 카드의 HTML 요소 생성
    const card = document.createElement('div');
    card.className = 'card mb-3';

    const row = document.createElement('div');
    row.className = 'row g-0';

    const imgCol = document.createElement('div');
    imgCol.className = 'col-md-4';

    const img = document.createElement('img');
    img.src = post.postImg || 'https://via.placeholder.com/200'; // 이미지 URL
    img.className = 'img-fluid rounded-start';
    img.alt = post.title;
    img.style = 'width: 200px; height: 200px; object-fit: cover;';

    const textCol = document.createElement('div');
    textCol.className = 'col-md-8';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    const cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.textContent = post.title; // 게시글 제목

    const cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.textContent =
      post.content.slice(0, 30) + (post.content.length > 30 ? '...' : ''); // 게시글 내용 (30자)

    const cardFooter = document.createElement('p');
    cardFooter.className = 'card-text';
    const smallText = document.createElement('small');
    smallText.className = 'text-body-secondary';
    smallText.textContent = `Last updated ${new Date(post.updatedAt).toLocaleString()}`; // 마지막 수정 날짜

    // 요소 조립
    imgCol.appendChild(img);
    row.appendChild(imgCol);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardFooter.appendChild(smallText);
    cardBody.appendChild(cardFooter);

    textCol.appendChild(cardBody);
    row.appendChild(textCol);

    card.appendChild(row);
    container.appendChild(card);
  });
};

const sortPosts = (posts, criteria) => {
  if (criteria === 'likes') {
    return posts.sort((a, b) => b.like - a.like);
  } else if (criteria === 'title') {
    return posts.sort((a, b) => a.title.localeCompare(b.title));
  } else if (criteria === 'updatedAt') {
    return posts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
  return posts;
};

// 드롭다운 선택 이벤트
const handleSortChange = (posts) => {
  const dropdown = document.getElementById('sort-dropdown');
  dropdown.addEventListener('change', () => {
    const sortedPosts = sortPosts(posts, dropdown.value);
    createPostCards(sortedPosts);
  });
};
