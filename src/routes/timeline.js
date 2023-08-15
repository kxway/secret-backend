const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middlewares/authenticateJWT.js");
const timelineService = require("../services/TimelineService.js");

router.post("/post", authenticateJWT, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const postId = await timelineService.createPost(content, req.user);
    res.json({ message: "Post created successfully!", postId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating post." });
  }
});

router.get("/posts", authenticateJWT, async (req, res) => {
  try {
    const userLocation = req.user.current_location;
    const { page = 1, size = 20 } = req.query;

    const posts = await timelineService.getPostsByUserLocation(
      userLocation,
      page,
      size
    );

    res.json({
      total: posts.total,
      lastPage: posts.lastPage,
      posts: posts.data,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching posts." });
  }
});

router.post("/post/:postId/reaction", authenticateJWT, async (req, res) => {
  const { type } = req.body;
  const postId = req.params.postId;
  const userId = req.user.id;

  if (!["like", "dislike"].includes(type)) {
    return res.status(400).json({ error: "Invalid reaction type." });
  }

  try {
    const action = await timelineService.handleReaction(
      postId,
      type,
      userId
    );

    const message =
      action === "remove"
        ? `Post ${type} removed successfully!`
        : `Post ${type}d successfully!`;
    res.json({ message });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error processing reaction." });
  }
});

module.exports = router;
