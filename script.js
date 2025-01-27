document.getElementById('submitPost').addEventListener('click', function () {
    const postContent = document.getElementById('postContent').value;
  
    if (postContent.trim()) {
      const postFeed = document.getElementById('postsFeed');
      const postItem = document.createElement('div');
      postItem.classList.add('post-item');
      
      postItem.innerHTML = `
        <div class="post-header">
          <img src="profile-pic.jpg" alt="User Profile" class="post-user-pic">
          <h3>John Doe</h3>
        </div>
        <p>${postContent}</p>
        <div class="post-actions">
          <button class="like-btn">👍 Like</button>
          <button class="comment-btn">💬 Comment</button>
        </div>
        <div class="comments"></div>
      `;
      postFeed.prepend(postItem);
      document.getElementById('postContent').value = '';
    }
  });
  
  document.getElementById('followBtn').addEventListener('click', function () {
    this.textContent = this.textContent === 'Follow' ? 'Following' : 'Follow';
  });
  