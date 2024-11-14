import User from "../models/user-model.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, mobileNumber, email, password, confirmPassword } = req.body;
    let errorMessages = [];

    const mobileNumberExists = await User.findOne({ mobileNumber });
    if (mobileNumberExists) {
      errorMessages.push("Mobile number is already in use");
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      errorMessages.push("Email is already in use");
    }

    // If there are any error messages, return them in a single 'error' key
    if (errorMessages.length > 0) {
      return res.status(400).json({ error: errorMessages });
    }

    // Create user if all fields are unique
    const userCreated = await User.create({
      name,
      mobileNumber,
      email,
      password,
      confirmPassword,
    });

    res.status(201).json({ data: userCreated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ["Internal server error"] });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Compare password
    const isPasswordMatch = await userExist.comparedPassword(password);
    if (isPasswordMatch) {
      // Generate token if passwords match
      const token = await userExist.generateToken();
      res.status(200).json({
        message: "Login Successful",
        token: token,
        userId: userExist._id.toString(),
      });
    } else {
      // Send error if passwords do not match
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(502).json({ message: "Internal server error" });
  }
};
