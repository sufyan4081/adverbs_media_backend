import express from "express";
import { deleteUser, getAllUsers, updateUser } from "./usersController.js";
const userRouter = express.Router();

userRouter.get("/getAllUsers", getAllUsers);
userRouter.delete("/deleteUser/:userId", deleteUser);
userRouter.put("/updateUser/:userId", updateUser);

export default userRouter;
