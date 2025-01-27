const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4030;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
mongoose.connect('mongodb://localhost/socialapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Models

// User model
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));

// Post model
const Post = mongoose.model('Post', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String
  }]
}));

// Routes

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().populate('user').populate('likes').populate('comments.user');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Create a post
app.post('/posts', async (req, res) => {
  const { userId, content } = req.body;
  const post = new Post({ user: userId, content });
  try {
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Like a post
app.post('/posts/:postId/like', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await Post.findById(postId);
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await post.save();
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'You already liked this post' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error liking post' });
  }
});

// Follow a user
app.post('/users/:userId/follow', async (req, res) => {
  const { userId } = req.params;
  const { currentUserId } = req.body;

  try {
    const user = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);
    
    if (!user.followers.includes(currentUserId)) {
      user.followers.push(currentUserId);
      currentUser.following.push(userId);

      await user.save();
      await currentUser.save();

      res.status(200).json({ message: 'Followed successfully' });
    } else {
      res.status(400).json({ message: 'Already following' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error following user' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
