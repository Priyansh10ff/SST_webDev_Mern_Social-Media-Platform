import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const port = 8001;

const app = express();
app.use(cors({
  origin : 'http://localhost:5173',
  credentials : true,
  //methods
  // allowedHeaders : ['Content-Type' : 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.use("/users", userRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Db Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("Server started");
});
