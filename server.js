
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Importing routes
import profileRoutes from "./routes/api/profile.js";
import authRoutes from "./routes/api/auth.js";
import postRoutes from "./routes/api/posts.js";
import usersRoutes from "./routes/api/users.js";


dotenv.config();

connectDB();

const app = express();


app.use(express.urlencoded({extended: false}));
const PORT = process.env.PORT || 3000;



app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Client Management System API!");
});


// Using routes
app.use("/api/profile", profileRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});