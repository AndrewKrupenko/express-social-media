const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Create a post
router.post('/', async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (e) {
    return res.status(500).json(e);
  }
});

// Update a post
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json('The post has been updated');
    } else {
      return res.status(403).json("You can update only your posts");
    }
  } catch (e) {
    return res.status(500).json(e);
  }
});

// Delete a post
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json('The post has been deleted');
    } else {
      return res.status(403).json("You can delete only your posts");
    }
  } catch (e) {
    return res.status(500).json(e);
  }
});

// Like/remove like a post
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json('The post has been liked');
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json('The post like has been removed');
    }
  } catch (e) {
    return res.status(500).json(e);
  }
});

// Get a post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (e) {
    return res.status(500).json(e);
  }
});

// Get timeline posts
router.get('/timeline/all', async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map(friendId => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts)); // Take all posts of friends an concat them
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;