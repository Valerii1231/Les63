import mongoose from "mongoose";
import express from "express";
import { User } from "./model/user.js";

const app = express();
const PORT = 8000;
const url = "mongodb://127.0.0.1:27017/user";

app.use(express.static('css'));
app.set('view engine', 'pug');
app.use(express.urlencoded({ extended: true })); 

mongoose.connect(url)
  .then(() => {
    console.log("Connected to DB");
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(`DB connection error: ${err}`);
  });

app.get("/", async (req, res) => {
  try {
    const users = await User.find(); 
    res.render("index", { users });
  } catch (err) {
    console.log(err);
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);       
    res.render("edit", { user });
  } catch (err) {
    console.log(err);
  }
});
 
app.post("/change-user/:id", async (req, res) => {
  try {
    const { name, age, status, avatar } = req.body;     
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.delete("/remove/:id", async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Course deleted" });
  } catch (err) {
    console.log(err);
  }      
});
  