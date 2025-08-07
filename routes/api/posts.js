import express from "express";
import PostsController from "../../controllers/postsController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

const router = express.Router();
const postsController = new PostsController();

// @route  POST /api/posts
// @desc   Create a post
// @access Public
router.post("/", authMiddleware, postsController.createPost);

// @route  GET /api/posts
// @desc   Get all posts
// @access Public
router.get("/", postsController.getAllPosts);

// @route  GET /api/posts/:id
// @desc   Get a post by ID
// @access Public
router.get("/:id", postsController.getPostById);

// @route  PUT /api/posts/:id
// @desc   Update a post by ID
// @access Public
router.put("/:id", authMiddleware, postsController.updatePost);

// @route  DELETE /api/posts/:id
// @desc   Delete a post by ID
// @access Public
router.delete("/:id", authMiddleware, postsController.deletePost);

export default router;