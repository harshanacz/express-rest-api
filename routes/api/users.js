import express from "express";
const router = express.Router();

// @route  GET /api/users
// @desc   Test route
// @access Public

router.get("/", (req, res) => {
  res.send("User route is working!");
});

export default router;