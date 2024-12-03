import express from "express";
import {
  deleteUser,
  getAllUsers,
  updateUser,
  updateUserCompanyDetails,
  uploadProfileImage,
} from "./usersController.js";
import { imageUploadSingle } from "../../middlewares/uploadMiddleware.js";

const userRouter = express.Router();

userRouter.get("/getAllUsers", getAllUsers);
userRouter.delete("/deleteUser/:userId", deleteUser);
userRouter.put("/updateUser/:userId", updateUser);
userRouter.put("/updateUser/:userId/companyDetails", updateUserCompanyDetails);
userRouter.put(
  "/uploadProfileImage/:userId",
  imageUploadSingle.single("file"),
  uploadProfileImage
);

export default userRouter;
