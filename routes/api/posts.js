import express from "express";
import postsController from "../../controllers/postsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();

// @route  POST /api/posts
// @desc   Create a post
// @access Public
router.post("/", authMiddleware, postsController.createPost);

// @route  GET /api/posts
// @desc   Get all posts
// @access Public
router.get("/", postsController.getPosts);

// @route  GET /api/posts/:id
// @desc   Get a post by ID
// @access Public
router.get("/:id", postsController.getAPostbyId);

// @route  PUT /api/posts/:id
// @desc   Update a post by ID
// @access Public
router.put("/:id", authMiddleware, postsController.updatePost);



// @route  DELETE /api/posts/:id
// @desc   Delete a post by ID
// @access Private
router.delete("/:id", authMiddleware, postsController.deletePost);



// @route  POST /api/posts/like/:id
// @desc   Like a post/unlike a post
// @access Private
router.put("/like/:id", authMiddleware, postsController.addLike);

// @route  POST /api/posts/comment/:id
// @desc   Add a comment to a post
// @access Private
router.post("/comment/:id", authMiddleware, postsController.addComment);

// @route  DELETE /api/posts/comment/:id/:commentId
// @desc   Delete a comment from a post
// @access Private
router.delete("/comment/:id/:commentId", authMiddleware, postsController.deleteComment);

export default router;