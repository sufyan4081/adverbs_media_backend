import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
});

// this is a middleware it is working before data saving;
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password") && !user.isModified("confirmPassword")) {
    next();
  }
  try {
    const saltRound = await bcrypt.genSalt(10);

    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, saltRound);
    }
    if (user.isModified("confirmPassword")) {
      user.confirmPassword = await bcrypt.hash(user.confirmPassword, saltRound);
    }
    next();
  } catch (error) {
    next(error);
  }
});

// password compared
userSchema.methods.comparedPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// generate token
userSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userId: this._id.toString(),
        email: this.email,
        password: this.password,
      },
      process.env.JWT_SECRETE_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.log(error);
  }
};
const User = new mongoose.model("User", userSchema);
export default User;
