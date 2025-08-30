import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js"
import { validateRegisterData } from "../utils/validateRegisterData.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import validateUpdateData from "../utils/validateUpdateData.js";
import generateOtp from "../utils/generateOtp.js";

//? Rigister user controller
export async function registerUserController(req, res) {
  try {
    const { name, email, password } = req.body;

    const validation = validateRegisterData({ name, email, password });
    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message,
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists",
        error: true,
        success: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new UserModel(payload);
    await newUser.save();
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser._id}`;
    const verifyEmail = await sendEmail({
      sendTo: email,
      subject: "Verify email from blinket",
      htmlContent: verifyEmailTemplate({
        name: name,
        url: verifyEmailUrl,
      }),
    });
    if (!verifyEmail) {
      return res.status(500).json({
        message: "Unable to send email",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "User register successfully",
      error: false,
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || error, error: true, success: false });
  }
}

//? Verify email controller
export async function verifyEmailController(req, res) {
  try {
    const { code } = req.body;

    const user = await UserModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({
        message: "Invalid code",
        error: true,
        success: false,
      });
    }

    const updateUser = await UserModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );

    return res.json({
      message: "Verify email done",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//? User Login controller

export async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    if (user.status !== "active") {
      return res.status(400).json({
        message: "Contact admin to activate your account",
        error: true,
        success: false,
      });
    }
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        error: true,
        success: false,
      });
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.last_login_date = new Date();
    await user.save();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("access_token", accessToken, cookieOptions);
    res.cookie("refresh_token", refreshToken, cookieOptions);
    return res.status(200).json({
      message: "Login successful",
      error: false,
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        // access_token: accessToken,
        // refresh_token: refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//? Logout user controller

export async function logoutUserController(req, res) {
  try {
    const userId = req.userId;
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("access_token", cookieOptions);
    res.clearCookie("refresh_token", cookieOptions);
    const user = await UserModel.findByIdAndUpdate(userId, {
      refresh_token: "",
    });
    return res.status(200).json({
      message: "Logout successful",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//? upload user avatar controller

export async function uploadUserAvatarController(req, res) {
  try {
    const userId = req.userId;
    const image = req.file;
    if (!image) {
      return res.status(400).json({
        message: "Image is required",
        error: true,
        success: false,
      });
    }

    const uploadImage = await uploadImageCloudinary(image);
    if (uploadImage.error) {
      return res.status(400).json({
        message: uploadImage.message,
        error: true,
        success: false,
      });
    }
    const user = await UserModel.findByIdAndUpdate(userId, {
      avatar: uploadImage.url,
    });
    return res.status(200).json({
      message: "Avatar uploaded successfully",
      error: false,
      success: true,
      data: {
        _id: user._id,
        avatar: uploadImage.url,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//? Update user controller

export async function updateUserController(req, res) {
  try {
    const userId = req.userId;
    const { name, email, password, mobile } = req.body;

    const isValid = validateUpdateData({ name, email, password, mobile });
    if (!isValid.isValid) {
      return res.status(400).json({
        message: isValid.message,
        error: true,
        success: false,
      });
    }

    const updates = {};
    let emailUpdated = false;

    if (name) updates.name = name;
    if (mobile) updates.mobile = mobile;

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      updates.password = await bcryptjs.hash(password, salt);
    }

    if (email) {
      updates.email = email;
      updates.verify_email = false;
      emailUpdated = true;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (emailUpdated) {
      const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${userId}`;
      const verifyEmail = await sendEmail({
        sendTo: email,
        subject: "Verify your updated email",
        html: verifyEmailTemplate({
          name: name || updatedUser.name,
          url: verifyEmailUrl,
        }),
      });

      if (!verifyEmail) {
        return res.status(500).json({
          message: "User updated, but failed to send verification email.",
          error: true,
          success: false,
        });
      }
    }

    return res.status(200).json({
      message: emailUpdated
        ? "User updated successfully. Please verify your new email."
        : "User updated successfully.",
      error: false,
      success: true,
      data: updatedUser,
      shouldVerify: emailUpdated, // front-end can use this
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}



//! Forgot password controller

export async function forgotUserPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date() + 60 * 60 * 1000; // 1hr

    const update = await UserModel.findByIdAndUpdate(user._id, {
      forgot_password_otp: otp,
      forgot_password_expiry: new Date(expireTime).toISOString(),
    });

    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Blinket",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.json({
      message: "check your email",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//verify forgot password otp
export async function verifyForgotUserPasswordOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide required field email, otp.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date().toISOString();

    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "Otp is expired",
        error: true,
        success: false,
      });
    }

    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Invalid otp",
        error: true,
        success: false,
      });
    }

    //if otp is not expired
    //otp === user.forgot_password_otp

    user.forgot_password_otp = "";
    user.forgot_password_expiry = "";
    await user.save();

    return res.json({
      message: "Verify otp successfully",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//reset the password
export async function resetUserPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "provide required fields email, newPassword, confirmPassword",
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email is not available",
        error: true,
        success: false,
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "newPassword and confirmPassword must be same.",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    const update = await UserModel.findOneAndUpdate(user._id, {
      password: hashPassword,
    });

    return res.json({
      message: "Password updated successfully.",
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//refresh token controler
export async function userRefreshToken(req, res) {
  try {
    const refresh_token =
      req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1]; /// [ Bearer token]

    if (!refresh_token) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    const verifyToken = await jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_SECRET
    );

    if (!verifyToken) {
      return res.status(401).json({
        message: "token is expired",
        error: true,
        success: false,
      });
    }

    const userId = verifyToken?._id;
    const user = await UserModel.findById(userId);

    const newAccessToken = await user.generateAccessToken();

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("access_token", newAccessToken, cookiesOption);

    return res.json({
      message: "New Access token generated",
      error: false,
      success: true,
      data: {
        access_token: newAccessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//get login user details
export async function userDetails(req, res) {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId).select(
      "-password -refresh_token"
    );

    return res.json({
      message: "user details",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something is wrong",
      error: true,
      success: false,
    });
  }
}
