import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
// middleware
import errorHandler from "./middleware/error.middleware.js";
// routes
import userRoutes from "./routes/user.route.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//TODO: Replace Morgan with a proper logger later.
app.use(morgan("dev"));

//api routes
app.use("/api/", userRoutes);

// 404 route
app.use((req, res) => {
  const route = req.originalUrl;
  return res.status(404).json({
    message: `Route ${route} not found!`,
    success: false,
  });
});

export default app;
