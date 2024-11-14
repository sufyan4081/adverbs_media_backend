import mongoose from "mongoose";

export const db = (uri) => {
  console.log("db is connected");
  return mongoose.connect(uri);
};
