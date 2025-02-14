import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";
export const userModel = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "A name is a required Field!!"],
    maxLength: [40, "username mustNot Exceed 40 characters"],
    minLength: [5, "username must be of length 5"],
  },
  password: {
    type: String,
    required: [true, "A password is a required Field!!"],
    minLength: [true, "minLength must be of 8 characters"],
  },
  // confirmPassword: {
  //   type: String,
  //   required: [true, "A password is a required Field!!"],
  //   minLength: [8, "minLength must be of 8 characters"],
  //   validate: {
  //     validator: function (val) {
  //       return val === this.password;
  //     },
  //     message: "Password and ConfirmPassword must be same",
  //   },
  // },
  role: {
    type: String,
    enum: ["user", "admin", "guide", "lead-guide"],
    default: "user",
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A Email is a required Field!!"],
  },
  active:{
    type:Boolean,
    default:true,
    select:false,
  },

  photo: String,
  passwordChangeDate: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});
userModel.pre("save", async function (next) {
if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangeDate = Date.now() - 1000;
  next();
});
userModel.pre(/^find/,function(next)
{
  this.find({active:{$ne:false}});
  next();
})
userModel.methods.isPasswordCorrect = async function (password) {
  return bcrypt.compare(password, this.password);
};
userModel.methods.isPasswordUpdated = function (jwtIat) {
  const passwordUpdatedDate = parseInt(
    this.passwordChangeDate?.getTime() / 1000
  );
  
  if (passwordUpdatedDate > jwtIat) {
    return true;
  }
  return false;
};
userModel.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = new mongoose.model("User", userModel);
export { User };
