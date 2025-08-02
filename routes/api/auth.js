import express from "express";
const router = express.Router();
import {authMiddleware} from "../../middleware/authMiddleware.js";
import User from "../../models/userModel.js";

// @route  GET /api/auth
// @desc   Test route
// @access Public

router.get("/",authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error("Error in auth route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;