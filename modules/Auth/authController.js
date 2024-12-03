import { sendError, sendSuccess } from "../../utils/response.js";
import User from "../Users/userModel.js";

export const register = async (req, res) => {
  try {
    const { name, mobileNumber, email, password, confirmPassword } = req.body;

    const mobileNumberExists = await User.findOne({ mobileNumber });
    const emailExists = await User.findOne({ email });
    if (!name || !mobileNumber || !email || !password || !confirmPassword) {
      return sendError(res, "All fields are required", 401);
    } else if (mobileNumberExists && emailExists) {
      return sendError(res, "Mobile number and email are already in use", 401);
    } else if (mobileNumberExists) {
      return sendError(res, "Mobile number is already in use", 401);
    } else if (emailExists) {
      return sendError(res, "Email is already in use", 401);
    }

    // Create user if all fields are unique
    const userCreated = await User.create({
      name,
      mobileNumber,
      email,
      password,
      confirmPassword,
    });

    sendSuccess(res, userCreated, null, "User Created Successfully", 201);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userExist = await User.findOne({ email }).populate("companyDetails");
    if (!userExist) {
      return sendError(res, "Invalid Email and Password", 401);
    }

    // Compare password
    const isPasswordMatch = await userExist.comparedPassword(password);
    if (isPasswordMatch) {
      // Generate token if passwords match
      const token = await userExist.generateToken();

      sendSuccess(res, userExist, token, "Login Successful", 200);
    } else {
      // Send error if passwords do not match
      sendError(res, "Invalid Email and Password", 401);
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(502).json({ message: "Internal server error" });
  }
};
