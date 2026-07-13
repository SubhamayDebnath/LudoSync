import { Router } from "express";
import { registerUser, loginUser, logout, getProfile } from "../controllers/user.controller.js";
import { authenticated } from "../middleware/auth.middleware.js";

const router = Router();
// create new user route
router.post("/user/register", registerUser);
// login user
router.post("/user/login", loginUser);
// logout user
router.post("/user/logout", authenticated, logout);
// get profile
router.get("/user/me", authenticated, getProfile);

export default router;
