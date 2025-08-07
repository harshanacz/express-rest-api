import Post from "../models/postModel.js";
import User from "../models/user.js";
import { validationResult } from "express-validator";

class PostsController {
  // Create a new post
  async createPost(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title } = req.body;

    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      const newPost = new Post({
        user: req.user.id,
        title,
      });

      await newPost.save();
      res.json(newPost);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  // Retrieve all posts
  async getPosts(req, res) {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }).populate("user", ["name", "avatar"]);
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  // Update a post
  async updatePost(req, res) {
    const { title } = req.body;

    try {
      let post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      // Check if the user is the owner of the post
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      post.title = title;
      await post.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  // Delete a post
  async deletePost(req, res) {
    try {
      let post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      // Check if the user is the owner of the post
      if (post.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      await post.remove();
      res.json({ msg: "Post removed" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
}

export default new PostsController();