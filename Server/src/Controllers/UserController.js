import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../Models/UserModel.js";
import validator from "validator";

import ListingModel from "./../Models/ListingModel.js";

const CreateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const Register = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    // Check for required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    // Check if email already exists
    const exist = await userModel.findOne({ email: email });

    if (exist) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email", success: false });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
        success: false,
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser = new userModel({
      name: name, // Use 'name' instead of 'username' based on your schema
      email: email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.error("Error occurred during registration:", error);
    res.status(500).json({
      message: "Server error, please try again later",
      success: false,
    });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const { password: pass, ...rest } = user._doc;
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      message: "Login successful",
      success: true,
      user: rest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid credentials", success: false });
  }
};

const google = async (req, res) => {
  try {
    const { email, name, photo } = req.body;
    const user = await userModel.findOne({ email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password, ...rest } = user._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json({
        message: "Login successful",
        success: true,
        user: rest,
      });
    } else {
      const generatePassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(generatePassword, 10);
      const newUser = new userModel({
        name:
          name.split(" ").join(" ").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      const { password, ...rest } = newUser._doc;
      res.cookie("access_token", token, { httpOnly: true }).status(200).json({
        message: "Login successful",
        success: true,
        user: rest,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Invalid credentials or failed login through Google",
      success: false,
    });
  }
};

const Delete = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).json("You can delete only your account");
  }
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted!");
  } catch (error) {
    res.status(500).json(error);
  }
};

const getUserListings = async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await ListingModel.find({ userRef: req.params.id });
      return res.status(200).json(listings);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    return res
      .status(401)
      .json({ message: "You can only view your own listings!" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

export { Login, Register, getUserListings, Delete, google };
