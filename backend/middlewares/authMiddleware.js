import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(404).json({
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId);
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default isAuthenticated;
