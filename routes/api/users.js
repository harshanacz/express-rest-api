import express from "express";
const router = express.Router();
import { check, validationResult } from "express-validator";
import User from "../../models/User.js";
import gravatar from "gravatar";
import bcrypt from "bcryptjs";

// @route  POST /api/users
// @desc   Register a new user
// @access Public

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    //check: user already exist
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        errors: [{ msg: "User already exists" }],
      });
    }

    try {
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // Create a new user instance
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();
      // Respond with success message
      // Return jsonwebtoken

      res.send("User route is working!");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

export default router;
