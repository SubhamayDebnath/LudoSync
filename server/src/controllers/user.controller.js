import envConfig from "../config/env.js";
import User from "../models/user.model.js";
import { isValidEmail, isValidPassword, isValidUsername } from "../utils/validation.js";

// cookie option
const cookieOption = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
};

// create new user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }
    if (!isValidUsername(username)) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be 3-26 characters, start with a letter, and contain only letters and numbers.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters and include an uppercase letter, a lowercase letter, a number, and a special character.",
      });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists!",
      });
    }
    const createdUser = await User.create({ username, email, password });
    if (!createdUser) {
      return res.status(500).json({
        success: false,
        message: "Failed to create user.",
      });
    }
    const token = createdUser.generateToken();
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: createdUser._id,
        username: createdUser.username,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    console.error("Register User:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    console.log();
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email or Password does not match",
      });
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Email or Password does not match",
      });
    }
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Not valid user",
      });
    }
    const token = user.generateToken();
    user.password = undefined;
    res.cookie("token", token, cookieOption);
    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login User:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// logout user
export const logout = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in first.",
      });
    }
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    });
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout User:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in first.",
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: user,
    });
  } catch (error) {
    console.error("Get Profile User:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
