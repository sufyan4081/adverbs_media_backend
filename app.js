import express from "express";
import dotenv from "dotenv";
import { db } from "./utils/db.js";
import authRouter from "./routes/auth-router.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT || "5000";

app.use(express.json());
app.use("/api/users", authRouter);
const start = async () => {
  try {
    await db(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`Serving is running on : ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
