import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";
import nodemailer from "nodemailer";

import { User } from "./db.js";
import { Product } from "./db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Register
app.post("/api/data", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({ message: "User data saved successfully." });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(201).json({ message: "User data saved successfully." });
  } catch (error) {
    console.error("Error saving user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add Product
app.post("/api/products", async (req, res) => {
  try {
    const { image, Name, Live, Code, Commit, Social } = req.body;

    const newProduct = new Product({
      image,
      Name,
      Live,
      Code,
      Commit,
      Social,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/user/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Context Send
app.post("/api/context", async (req, res) => {
  const { email, context } = req.body;
  try {
    await sendOTPEmail(email, context);
    res.json("OTP sent successfully");
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gitamapptech@gmail.com",
    pass: "ajza yvpi ptur jinv",
  },
});

const sendOTPEmail = async (email, context) => {
  try {
    const mailOptions = {
      from: "gitamapptech@gmail.com",
      to: "shivrajsingh.info.me@gmail.com",
      subject: "Password Reset OTP",
      text: `

      ${email}
      
      Context: ${context}
      
      shivrajsingh.info.me@gmail.com Support Team`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

const port = process.env.PORT || 5454;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
