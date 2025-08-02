import express from "express";
const router = express.Router();
import {authMiddleware} from "../../middleware/authMiddleware.js";

// @route  GET /api/auth
// @desc   Test route
// @access Public

router.get("/",authMiddleware, (req, res) => {
  res.send("Auth route is working!");
});

export default router;