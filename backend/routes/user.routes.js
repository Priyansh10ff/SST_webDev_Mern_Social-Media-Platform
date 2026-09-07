import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
  getUserProfile,
} from "../controllers/user.controllers.js";
import isAuthenticated from "../middlewares/authMiddleware.js";

const userRoutes = express.Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/login", loginUser);
userRoutes.post("/logout", logoutUser);
userRoutes.get("/me", isAuthenticated, getUser);
userRoutes.get("/profile/:username", isAuthenticated, getUserProfile);
//userRoutes.post("/:id/follow", isAuthenticated, );

export default userRoutes;
