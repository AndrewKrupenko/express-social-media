const User = require("../models/User");
const bcrypt = require("bcrypt");
const router = require('express').Router();

// Update user
router.put('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (e) {
        return res.status(500).json(e);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json('Account has been updated')
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    return res.status(403).json('You can update only your account');
  }
});

// Delete user
router.delete('/:id', async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json('Account has been deleted')
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    return res.status(403).json('You can delete only your account');
  }
});

// Get a user
router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    const username = req.query.username;
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc; // exclude fields from response
    res.status(200).json(other);
  } catch (e) {
    return res.status(500).json(e);
  }
});

// get friends
router.get('/friends/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map(friendId => {
        return User.findById(friendId);
      })
    );

    let friendList = [];
    friends.map(friend => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture })
    })
    res.status(200).json(friendList);
  } catch (e) {
    return res.status(500).json(e);
  }
})

// Follow a user
router.put('/:id/follow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); // the one from url
      const currentUser = await User.findById(req.body.userId); // The one that makes request

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json('user has been followed');
      } else {
        res.status(403).json('You already follow this user');
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    res.status(403).json('You can not follow yourself');
  }
});

// Unfollow a user
router.put('/:id/unfollow', async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id); // the one from url
      const currentUser = await User.findById(req.body.userId); // The one that makes request

      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json('user has been unfollowed');
      } else {
        res.status(403).json('You do not follow this user');
      }
    } catch (e) {
      return res.status(500).json(e);
    }
  } else {
    res.status(403).json('You can not unfollow yourself');
  }
});

module.exports = router;