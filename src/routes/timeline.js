const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const authenticateJWT = require("../middlewares/authenticateJWT.js");
const knexPaginate = require("knex-paginate");

knexPaginate.attachPaginate();

router.post("/post", authenticateJWT, async (req, res) => {
  try {
    const { content } = req.body;
    const userLocation = req.user.current_location;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const topPosts = await db("timeline")
      .where({ location: userLocation })
      .orderBy("relevance_score", "desc")
      .limit(10);

    let averageRelevance = 10; // valor padrão
    if (topPosts.length > 0) {
      averageRelevance =
        topPosts.reduce((sum, post) => sum + post.relevance_score, 0) /
        topPosts.length;
    }

    averageRelevance = Math.round(averageRelevance);

    const [postId] = await db("timeline").insert({
      user_id: req.user.id,
      post_content: content,
      likes: 0,
      dislikes: 0,
      relevance_score: averageRelevance,
      location: userLocation,
    });

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

    const posts = await db("timeline")
      .where("location", userLocation)
      .orderBy([
        { column: "relevance_score", order: "desc" },
        { column: "created_at", order: "desc" },
      ])
      .paginate({
        perPage: size,
        currentPage: page,
      });

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
    const existingReaction = await db("post_reactions")
      .where({
        post_id: postId,
        user_id: userId,
      })
      .first();

    const action = !existingReaction
      ? "add"
      : existingReaction.type === type
      ? "remove"
      : "update";

    switch (action) {
      case "add":
        await db("post_reactions").insert({
          post_id: postId,
          type: type,
          user_id: userId,
        });
        await db("timeline")
          .where({ id: postId })
          .increment(`${type}s`, 1)
          .increment("relevance_score", 1);
        break;

      case "remove":
        await db("post_reactions")
          .where({ post_id: postId, user_id: userId })
          .del();
        await db("timeline")
          .where({ id: postId })
          .decrement(`${type}s`, 1)
          .decrement("relevance_score", 1);
        break;

      case "update":
        await db("post_reactions")
          .where({ post_id: postId, user_id: userId })
          .update({ type });
        await db("timeline")
          .where({ id: postId })
          .increment(`${type}s`, 1)
          .decrement(`${existingReaction.type}s`, 1);
        break;
    }

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
