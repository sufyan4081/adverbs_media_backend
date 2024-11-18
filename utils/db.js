import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const db = () => {
  const uri = process.env.MONGODB_URI;
  const dbConnect = mongoose
    .connect(uri)
    .then(() => {
      console.log("Db connected successfully");
    })
    .catch((error) => {
      console.log(error);
    });
  return dbConnect;
};
