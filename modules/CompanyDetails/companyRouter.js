import express from "express";
import { createCompany } from "./companyController.js";
const companyRouter = express.Router();

companyRouter.post("/createCompany", createCompany);
export default companyRouter;
