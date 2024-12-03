import User from "../Users/userModel.js";
import companyModel from "./companyModel.js";

export const createCompany = async (req, res) => {
  const { userId, companyName, country, state, city, pinCode } = req.body;
  try {
    // Create a new company entry
    const companyData = await companyModel.create({
      userId,
      companyName,
      country,
      state,
      city,
      pinCode,
    });

    // Update the user with the company details
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { companyDetails: companyData._id },
      { new: true } // Returns the updated user document
    ).lean(); // Convert to plain JavaScript object for easier manipulation

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch full company details
    const companyDetails = await companyModel.findById(companyData._id).lean();

    // Merge the user data with company details
    updatedUser.companyDetails = companyDetails;

    res.status(201).json({
      message: "Company Details Added Successfully",
      data: [updatedUser], // Wrapping in an array as per your example
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
};
