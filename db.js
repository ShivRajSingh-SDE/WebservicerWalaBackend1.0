import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose
  .connect(process.env.DATA_BASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

const Schema = mongoose.Schema;

const userData = new Schema({
  email: {
    type: "string",
    required: true,
  },
  password: {
    type: "string",
    required: true,
  },
});

const productData = new Schema({
  imageName: {
    type: "string",
    required: true,
  },
  imageLink: {
    type: "string",
    required: true,
  },
  cookies: {
    type: "string",
    required: true,
  },
  link: {
    type: "string",
    required: true,
  },
});

const User = mongoose.model("UserData", userData);
const Product = mongoose.model("ProductData", productData);

export { User, Product };
