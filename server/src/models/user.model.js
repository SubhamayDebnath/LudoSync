import mongoose, { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { isValidEmail, isValidPassword, isValidUsername } from "../utils/validation.js";
import envConfig from "../config/env.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      index: true,
      validate: {
        validator: isValidEmail,
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    stats: {
      wins: {
        type: Number,
        default: 0,
      },
      losses: {
        type: Number,
        default: 0,
      },
      gamesPlayed: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

// hashed the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// compare hashed password with plain password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generate token
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, envConfig.JWT_SECRET, {
    expiresIn: envConfig.JWT_EXPIRES_IN,
  });
};

const User = model("User", userSchema);

export default User;
