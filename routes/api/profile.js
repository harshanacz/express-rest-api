import express from "express";
const router = express.Router();
import Profile from "../../models/profileModel.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";

// @route  GET /api/profile/me
// @desc   Get current user's profile
// @access Private

router.get("/me", authMiddleware,async (req,  res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);
    
    if (!profile) {
      return res.status(404).json({ msg: "There is no profile for this user" });
    }
    
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;