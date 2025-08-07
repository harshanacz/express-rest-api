import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { validationResult } from "express-validator";

//class method


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


  async getAPostbyId (req, res) {
    try {
      const post = await Post.findById(req.params.id).populate("user", ["name", "avatar"]);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      console.error(err.message);
      if (err.kind === "ObjectId") {
        return res.status(404).json({ msg: "Post not found" });
      }
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

  async addLike(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      // Check if the post has already been liked by the user
      if (post.likes.some(like => like.user.toString() === req.user.id)) {
        post.likes = post.likes.filter(like => like.user.toString() !== req.user.id);
        await post.save();

      }

      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.json(post.likes);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  //add comment
    async addComment(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }


      const newComment = {
        text,
        user: user._id,
        createdAt: Date.now(),
      };

      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  //delete comment
  async deleteComment(req, res) {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ msg: "Post not found" });
      }

      const comment = post.comments.find(comment => comment.id === req.params.commentId);
      if (!comment) {
        return res.status(404).json({ msg: "Comment not found" });
      }

      // Check if the user is the owner of the comment
      if (comment.user.toString() !== req.user.id) {
        return res.status(401).json({ msg: "User not authorized" });
      }

      post.comments = post.comments.filter(comment => comment.id !== req.params.commentId);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

}

export default new PostsController();