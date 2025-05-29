const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./MongodbModel");

const app = express();
const port =  8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/userdb")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Get all users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Create new user
app.post("/users", async (req, res) => {
  const { name, age, city } = req.body;
  console.log("POST /users =>", req.body);

  if (!name || !age || !city) {
    return res.status(400).send({ message: "All fields are required" });
  }

  try {
    const newUser = new User({ name, age, city });
    await newUser.save();
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ message: "Failed to add user" });
  }
});

// Update user
app.patch("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, city } = req.body;

  try {
    await User.findByIdAndUpdate(id, { name, age, city });
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send({ message: "Failed to update user" });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send({ message: "Failed to delete user" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
