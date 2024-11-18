import express from "express";
const authRouter = express.Router();
import { login, register } from "./authController.js";

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
