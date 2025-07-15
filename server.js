
import express from "express";



const app = express();
app.use(express.urlencoded({extended: false}));
const PORT = process.env.PORT || 3000;



app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});