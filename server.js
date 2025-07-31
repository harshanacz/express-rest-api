
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();

connectDB();

const app = express();
app.use(express.urlencoded({extended: false}));
const PORT = process.env.PORT || 3000;



app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Client Management System API!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});