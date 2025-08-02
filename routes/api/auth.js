import express from "express";
const router = express.Router();
import {authMiddleware} from "../../middleware/authMiddleware.js";
import User from "../../models/userModel.js";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

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



// @route  POST /api/auth
// @desc   Authenticate user and get token
// @access Public

router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    //check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {  email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        errors: [{ msg: "User does not exist" }],
      });
    }

    try {

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [{ msg: "Invalid credentials" }],
        });
      }
    
      // Respond with success message
      // Return jsonwebtoken

      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5 days" },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
     
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


export default router;