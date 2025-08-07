import express from "express";
const router = express.Router();
const {check, validationResult} = require("express-validator");
import {authMiddleware} from "../../middleware/authMiddleware.js";
import Post from "../../models/post.js";
import User from "../../models/user.js";

// @route  post /api/post
// @desc   Test route
// @access Public

router.post("/", [
  authMiddleware,
  check("title", "Title is required").not().isEmpty(),

], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }

  const {title} = req.body;

  try {
   
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({msg: "User not found"});
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
});

export default router;