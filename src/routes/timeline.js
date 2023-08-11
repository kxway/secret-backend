const express = require("express");
const router = express.Router();
const db = require("../config/db.js");  
const authenticateJWT = require('../middlewares/authenticateJWT.js');

router.post("/post", authenticateJWT, async (req, res) => {
    try {
        const { content } = req.body;
        const userLocation = user.current_location;

        if (!content) {
            return res.status(400).json({ error: "Content is required." });
        }

        const [postId] = await db("timeline").insert({
            userId: req.user.id,
            content,
            likes: 0,
            dislikes: 0,
            relevance: 0, // Inicialmente, definimos a relevância como 0
            location: userLocation
        });

        res.json({ message: "Post created successfully!", postId });

    } catch (error) {
        res.status(500).json({ error: "Error creating post." });
    }
});

router.get("/posts", authenticateJWT, async (req, res) => {
    try {
        const posts = await db("timeline")
            .where("location", userLocation)
            .select()
            .orderBy("relevance", "desc")  
            .limit(20); 

        res.json({ posts });

    } catch (error) {
        res.status(500).json({ error: "Error fetching posts." });
    }
});

module.exports = router;
