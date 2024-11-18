import express from "express";
import authRouter from "./modules/Auth/authRouter.js";
import userRouter from "./modules/Users/usersRouter.js";
import companyRouter from "./modules/CompanyDetails/companyRouter.js";
const app = express();
const router = express.Router();

router.use("/admin", authRouter);
router.use("/users", userRouter);
router.use("/companyDetails", companyRouter);

export default router;
