const express = require("express");
const router = express.Router();
const db = require("../config/db.js");
const authenticateJWT = require("../middlewares/authenticateJWT.js");
const knexPaginate = require('knex-paginate');

knexPaginate.attachPaginate();

router.post("/post", authenticateJWT, async (req, res) => {
  try {
    const { content } = req.body;
    const userLocation = req.user.current_location;

    if (!content) {
      return res.status(400).json({ error: "Content is required." });
    }

    const [postId] = await db("timeline").insert({
      user_id: req.user.id,
      post_content: content,
      likes: 0,
      dislikes: 0,
      relevance_score: 0, // Inicialmente, definimos a relevância como 0
      location: userLocation,
    });

    res.json({ message: "Post created successfully!", postId });
  } catch (error) {
    console.log(error)
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
          { column: 'relevance_score', order: 'desc' },
          { column: 'created_at', order: 'desc' }
        ])
        .paginate({
           perPage: size, 
           currentPage: page
        });
  
      res.json({ 
        total: posts.total, 
        lastPage: posts.lastPage,
        posts: posts.data 
      });
    } catch (error) {
      res.status(500).json({ error: "Error fetching posts." });
    }
  });

module.exports = router;
