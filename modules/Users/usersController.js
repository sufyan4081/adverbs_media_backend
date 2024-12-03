import mongoose from "mongoose";
import { sendError, sendSuccess } from "../../utils/response.js";
import companyModel from "../CompanyDetails/companyModel.js";
import User from "./userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("companyDetails");
    if (users) {
      res
        .status(200)
        .json({ message: "User data fetched successful", data: users });
    } else {
      res.status(200).json({ message: "Not data available", data: [] });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User Not Found" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, mobileNumber, email, password, confirmPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    // Check for duplicate email or mobile number in other users
    const duplicateUser = await User.findOne({
      $or: [{ email }, { mobileNumber }],
      _id: { $ne: userId },
    });

    if (duplicateUser) {
      const duplicateField =
        duplicateUser.email === email ? "Email" : "Mobile Number";
      return sendError(res, `This ${duplicateField} already exists`, 409);
    }

    // Update the user's fields
    if (name) user.name = name;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (email) user.email = email;

    // Optional: Validate password and confirmPassword match before updating
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return sendError(
          res,
          "Password and Confirm Password do not match",
          400
        );
      }
      user.password = password; // Assume hashing is handled by the User model
    }

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: user,
    });
  } catch (error) {
    sendError(res, "Internal Server Error", 500);
  }
};

export const updateUserCompanyDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { companyName, country, state, city, pinCode } = req.body;

    const user = await User.findById(userId).populate("companyDetails");
    console.log("user", user);
    if (!user) {
      sendError(res, "User not found", 404);
    }

    const companyId = user.companyDetails._id;
    console.log("companyId", companyId);
    if (!companyId) {
      sendError(res, "Company not found for this user", 404);
    }

    const updateCompany = await companyModel.findByIdAndUpdate(
      companyId,
      { companyName, country, state, city, pinCode },
      { new: true, runValidator: true }
    );

    console.log("updateCompany", updateCompany);
    if (!updateCompany) {
      sendError(res, "Company not found", 404);
    }
    res.status(200).json({
      message: "Company Details Updated Successfully",
      companyDetails: updateCompany,
    });
  } catch (error) {
    sendError(res, "Internal Server Error", 500);
  }
};

export const uploadProfileImage = async (req, res) => {
  const { userId } = req.params;
  const { file } = req.body;

  try {
    // Check if file is uploaded
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Generate the image URL (assuming the server serves from the 'uploads' folder)
    const imageUrl = `/uploads/profileImages/${file.filename}`;

    // Update user's profile image
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImage: imageUrl },
      { new: true } // `new: true` ensures we get the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile image updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
