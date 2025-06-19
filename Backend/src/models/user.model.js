import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      lowercase: true,
      minLength: 4,
      maxLength: 22,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    avatar: {
      type: String,
      default: "https://www.gravatar.com/avatar/?d=mp",
    },
    mobile: {
      type: Number,
      default: null,
    },
    refresh_token: {
      type: String,
      default: "",
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    address_details: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    shopping_cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartProduct",
      },
    ],
    order_history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_otp_expiry: {
      type: Date,
      default: null,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = async function () {
  const token = await jwt.sign(
    { id: this._id },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: "5h",
    }
  );
  return token;
};

userSchema.methods.generateRefreshToken = async function () {
  const token = await jwt.sign(
    { id: this._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    }
  );
  this.refresh_token = token;
  await this.save();
  return token;
};




const UserModel = mongoose.model("User", userSchema);
export default UserModel;


