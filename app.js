import express from "express";
import dotenv from "dotenv";
import { db } from "./utils/db.js";
import cors from "cors";
import router from "./routes.js";

const app = express();

// Determine which .env file to load based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

console.log("Using :", process.env.NODE_ENV);

const PORT = process.env.PORT || "5000";
app.use(cors());
app.use(express.json());

app.use("/api", router);

const start = async () => {
  try {
    db();
    app.listen(PORT, () => {
      console.log(`Serving is running on : ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
