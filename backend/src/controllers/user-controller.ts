import { Request, Response } from "express";
import { Errors } from "../models/errorsModel";
import { Messages } from "../models/messages";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import sendEmail from "./mailing";
import jwtController from "./jwt-controller";
import { resolve } from "path";
import sequelize from "../sequelize/sequelize";
import Address from "../models/user-adress-model";
import getCart from "./cart-controller";
import Cart from "../models/cartmodel";
import CartItem from "../models/cart-item-model";
import { Where } from "sequelize/types/utils";
import cartController from "./cart-controller";
import { mode } from "crypto-js";
import { Model, Transaction } from "sequelize";
import Product from "../models/productModel";
import { captureRejectionSymbol } from "events";
import Order from "../models/ordersModel";
import OrderItem from "../models/order-items-model";
import transaction from "sequelize/types/transaction";
import { count } from "console";

// Registration Controller
const registrationCont = async (req: Request, res: Response) => {
  const {
    name,
    password, // <-- This is already SHA256 hashed from frontend
    email,
    dateOfBirth,
    phoneNumber,
    city,
  } = req.body;

  // password validation and restrictions (apply on frontend before hashing, or here on the unhashed password if you want)
  // If you want to validate password strength, do it on the frontend before hashing and sending.
  try {
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      return res.status(Errors.EMAIL_EXISTS.status).json({
        error: Errors.EMAIL_EXISTS.message,
        code: Errors.EMAIL_EXISTS.code,
      });
    }

    // Hash the SHA256-hashed password with bcrypt before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification code and hash it with bcrypt
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    // Hash the code with SHA256 (to match frontend), then bcrypt
    const verificationCodeSha = require("crypto")
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");
    const encryptedVerificationCode = bcrypt.hashSync(verificationCodeSha, 10);

    await User.create({
      name: name,
      email: email.toLowerCase(),
      password: hashedPassword,
      EncryptedVerificationCode: encryptedVerificationCode,
      isVerified: false,
      dateOfBirth: dateOfBirth,
      phoneNumber: phoneNumber,
      city: city,
    });

    await sendEmail(
      email,
      "Thanks For Your Registration with TECHHIVE",
      `Hello ${name},\nYour verification code is: ${verificationCode}\nThank you for registering with TECHHIVE! We're excited to have you on board.\n\nBest regards,\nThe TECHHIVE Team`
    );

    return res.status(200).json({
      message: Messages.USER_REGISTERED.message,
      code: Messages.USER_REGISTERED.code,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

// Verification Controller
const verifyCont = async (req: Request, res: Response) => {
  console.log("======================================");
  console.log("hitting the verify controller");
  console.log("Request body:", req.body);

  try {
    const { email, code } = req.body;
    // IMPORTANT: code here is already SHA256 from frontend
    let codde = code;

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user?.EncryptedVerificationCode) {
      return res.status(Errors.INVALID_EMAIL.status).json({
        error: Errors.INVALID_EMAIL.message,
        code: Errors.INVALID_EMAIL.code,
      });
    }
    console.log("User found:", user.email);
    console.log(
      "Stored EncryptedVerificationCode (bcrypt):",
      user.EncryptedVerificationCode
    );

    console.log("Re-hashed code for comparison (SHA256):", codde);
    // Compare directly: SHA256(code) (from frontend) vs bcrypt(stored)
    const isMatch = await bcrypt.compare(code, user.EncryptedVerificationCode);

    if (isMatch) {
      await User.update(
        { isVerified: true },
        { where: { email: email.toLowerCase() } }
      );

      return res.status(200).json({
        message: Messages.EMAIL_VERIFIED.message,
        code: Messages.EMAIL_VERIFIED.code,
      });
    } else {
      console.error(
        "Verification failed: Code does not match.",
        code,
        user.EncryptedVerificationCode
      );
      return res.status(Errors.VERIFICATION_FAILED.status).json({
        error: Errors.VERIFICATION_FAILED.message,
        code: Errors.VERIFICATION_FAILED.code,
      });
    }
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const verifyResetCodeCont = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user?.PasswordResetCode || !user?.PasswordResetExpiry) {
      return res.status(Errors.INVALID_REQUEST.status).json({
        error: Errors.INVALID_REQUEST.message,
        code: Errors.INVALID_REQUEST.code,
      });
    }

    // Check expiry
    if (new Date() > new Date(user.PasswordResetExpiry)) {
      return res.status(Errors.TOKEN_EXPIRED.status).json({
        error: Errors.TOKEN_EXPIRED.message,
        code: Errors.TOKEN_EXPIRED.code,
      });
    }

    // Compare code
    const isMatch = await bcrypt.compare(code, user.PasswordResetCode);
    if (!isMatch) {
      return res.status(Errors.VERIFICATION_FAILED.status).json({
        error: Errors.VERIFICATION_FAILED.message,
        code: Errors.VERIFICATION_FAILED.code,
      });
    }

    // ✅ Generate a short-lived reset token (JWT or random string)
    const token = jwtController.issueToken({
      userId: user.id,
      email: user.email,
      role: "customer",
      purpose: "password_reset",
    });
    console.log("Generated JWT:", token);
    const resetToken = token;
    res.cookie("resetToken", resetToken, {
      httpOnly: true, // JS can't read this cookie
      //secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: "strict", // CSRF protection
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return res.status(200).json({
      message: "Code verified successfully",
      resetToken, // frontend uses this to access /newpassword
    });
  } catch (err) {
    console.error(err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

// Login Controller
const loginCont = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body; // password is SHA256 hashed from frontend

    const user = await User.findOne({
      where: { email: email.toLowerCase() },
    });

    const passwordFromDB = user?.password;

    // if user not found
    if (!passwordFromDB) {
      return res.status(Errors.EMAIL_NOT_REGISTERED.status).json({
        error: Errors.EMAIL_NOT_REGISTERED.message,
        code: Errors.EMAIL_NOT_REGISTERED.code,
      });
    }

    // Compare SHA256-hashed password with bcrypt hash in DB
    const isMatch = await bcrypt.compare(password, passwordFromDB);

    // user exists and account is verified
    if (isMatch && user?.isVerified) {
      const token = jwtController.issueToken({
        userId: user.id,
        role: "customer",
      });
      console.log("Generated JWT:", token);

      res.cookie("token", token, {
        httpOnly: true, // JS can't read this cookie
        //secure: process.env.NODE_ENV === "production", // only HTTPS in prod
        sameSite: "strict", // CSRF protection
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
      });

      return res.status(200).json({ message: Messages.LOGIN_SUCCESS.message });
    }

    // user exists but not verified
    else if (isMatch && !user?.isVerified) {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      console.log("Resending verification code:", verificationCode);
      const verificationCodeSha = require("crypto")
        .createHash("sha256")
        .update(verificationCode)
        .digest("hex");
      console.log("SHA256 of verification code:", verificationCodeSha);
      const encryptedVerificationCode = bcrypt.hashSync(
        verificationCodeSha,
        10
      );

      await User.update(
        {
          EncryptedVerificationCode: encryptedVerificationCode,
          last_login: new Date(),
        },
        { where: { email: email.toLowerCase() } }
      );
      await sendEmail(
        email,
        "TECHHIVE Account Verification",
        `Hello ${user.name},\nYour new verification code is: ${verificationCode}\nPlease use this code to verify your account.\n\nBest regards,\nThe TECHHIVE Team`
      );

      return res.status(Errors.EMAIL_NOT_VERIFIED.status).json({
        error: Errors.EMAIL_NOT_VERIFIED.message,
        code: Errors.EMAIL_NOT_VERIFIED.code,
      });
    } else {
      return res.status(Errors.WRONG_PASSWORD.status).json({
        error: Errors.WRONG_PASSWORD.message,
        code: Errors.WRONG_PASSWORD.code,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

// Forgot Password Controller
const forgotPasswordCont = async (req: Request, res: Response) => {
  console.log("hitting the forgot password controller");
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      console.log("Email not registered:", email);
      return res.status(Errors.EMAIL_NOT_REGISTERED.status).json({
        error: Errors.EMAIL_NOT_REGISTERED.message,
        code: Errors.EMAIL_NOT_REGISTERED.code,
      });
    } else {
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const resetCodeSha = require("crypto")
        .createHash("sha256")
        .update(verificationCode)
        .digest("hex")
        .toLowerCase();

      const encryptedVerificationCode = bcrypt.hashSync(resetCodeSha, 10);
      await User.update(
        {
          PasswordResetCode: encryptedVerificationCode,
          PasswordResetExpiry: new Date(
            Date.now() + 15 * 60 * 1000
          ).toISOString(), // 15 minutes from now
        },
        { where: { email: email.toLowerCase() } }
      );

      await sendEmail(
        email,
        "TECHHIVE Account Password Reset",
        `Hello ${user.name},\nYour new reset code is: ${verificationCode}\nPlease use this code to reset your password.\n\nBest regards,\nThe TECHHIVE Team`
      );
    }
    return res.status(Messages.PASSWORD_RESET_CODE_SENT.status).json({
      message: Messages.PASSWORD_RESET_CODE_SENT.message,
      code: Messages.PASSWORD_RESET_CODE_SENT.code,
    });
  } catch (err) {
    console.error(err);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};
// Change Password Controller
const changePasswordCont = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(Errors.EMAIL_NOT_REGISTERED.status).json({
        error: Errors.EMAIL_NOT_REGISTERED.message,
        code: Errors.EMAIL_NOT_REGISTERED.code,
      });
    } else {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await User.update(
        { password: hashedNewPassword },
        { where: { email: email.toLowerCase() } }
      );
      return res.status(Messages.PASSWORD_CHANGED_SUCCESSFULLY.status).json({
        message: Messages.PASSWORD_CHANGED_SUCCESSFULLY.message,
        code: Messages.PASSWORD_CHANGED_SUCCESSFULLY.code,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};
export const getUserInfo = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  try {
    const user = await User.findByPk(userId, {
      attributes: ["name", "phoneNumber", "email"],
    });
    if (!user) {
      return res.status(Errors.USER_NOT_FOUND.status).json({
        error: Errors.USER_NOT_FOUND.message,
        code: Errors.USER_NOT_FOUND.code,
      });
    }
    return res.status(Messages.USER_FOUND.status).json({
      name: user.name,
      phoneNumber: user.phoneNumber,
      email: user.email,
      code: Messages.USER_FOUND.code,
      message: Messages.USER_FOUND.message,
    });
  } catch (err) {
    console.error(err);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

export const getUserAddresses = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  try {
    const addresses = await Address.findAll({
      where: { userId },
      attributes: [
        "id",
        "userId",
        "street",
        "city",
        "state",
        "postalCode",
        "country",
        "isDefault",
      ],
    });
    return res.status(Messages.ADDRESSES_FETCHED.status).json({
      addresses,
      code: Messages.ADDRESSES_FETCHED.code,
      message: Messages.ADDRESSES_FETCHED.message,
    });
  } catch (err) {
    console.error(err);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

export const addaddressCont = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const {
    street,
    city,
    state,
    postalCode,
    country,
    isDefault,
    building,
    floor,
    apartment,
  } = req.body;

  if (
    !street ||
    !city ||
    !state ||
    !postalCode ||
    !country ||
    !building ||
    !floor
  ) {
    return res.status(Errors.INVALID_ADDRESS_DATA.status).json({
      error: Errors.INVALID_ADDRESS_DATA.message,
      code: Errors.INVALID_ADDRESS_DATA.code,
    });
  }

  if (!userId) {
    return res.status(Errors.USER_NOT_FOUND.status).json({
      error: Errors.USER_NOT_FOUND.message,
      code: Errors.USER_NOT_FOUND.code,
    });
  }

  try {
    const newAddress = await Address.create({
      building,
      floor,
      apartment,
      userId,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });
    return res.status(Messages.ADDRESS_ADDED.status).json({
      message: Messages.ADDRESS_ADDED.message,
      code: Messages.ADDRESS_ADDED.code,
      data: newAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

export const authStatus = async (req: Request, res: Response) => {
  try {
    if ((req as any).user?.userId) {
      return res.status(200).json({ isLoggedIn: true });
    } else {
      return res.status(200).json({ isLoggedIn: false });
    }
  } catch (err) {
    return res.status(200).json({ isLoggedIn: false });
  }
};
const clearResetPassCookie = async (req: Request, res: Response) => {
  try {
    res.clearCookie("resetToken");
    return res.status(200).json({ message: "Reset token cookie cleared" });
  } catch (err) {
    console.error(err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};
const clearAuthCookie = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "loggedout" });
  } catch (err) {
    console.error(err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

export default {
  registrationCont,
  verifyCont,
  loginCont,
  forgotPasswordCont,
  changePasswordCont,
  getUserInfo,
  verifyResetCodeCont,
  getUserAddresses,
  addaddressCont,
  clearResetPassCookie,
  clearAuthCookie,
  authStatus,
};
