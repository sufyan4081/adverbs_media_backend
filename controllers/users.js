import { model } from "mongoose";
import User from "../models/user-model.js";

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

    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidator: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({
      message: "User Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
