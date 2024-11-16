import companyModel from "../models/companyModel.js";
import User from "../models/user-model.js";

export const createCompany = async (req, res) => {
  const { userId, companyName, country, state, city, pinCode } = req.body;
  try {
    const companyData = await companyModel.create({
      userId,
      companyName,
      country,
      state,
      city,
      pinCode,
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { companyDetails: companyData._id },
      { new: true }
    );
    res.status(201).json({
      message: "Company Details Added Successfully",
      data: companyData,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
