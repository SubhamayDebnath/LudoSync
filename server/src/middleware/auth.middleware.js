import jwt from "jsonwebtoken";
import envConfig from "../config/env.js";

// Check if the authenticated user has the required role
export const authenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Authentication Error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// check user authorized or not
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission",
      });
    }
    next();
  };
};
