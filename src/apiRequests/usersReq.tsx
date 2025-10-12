import apiClient from "../util/axios";
import { User, SuccessResponse, ErrorResponse } from "./usermodel";
import CryptoJS from "crypto-js";

// Custom Error class to hold both a message and a code for structured error handling
class ApiError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

// Centralized helper function to parse Axios errors into our custom ApiError
const handleError = (error: any): ApiError => {
  if (error.response && error.response.data) {
    const { error: message, code } = error.response.data as ErrorResponse;
    return new ApiError(
      message || "An unknown error occurred.",
      code || "UNKNOWN_ERROR"
    );
  }
  return new ApiError(
    "A network error occurred or the server is unreachable.",
    "NETWORK_ERROR"
  );
};

export const registerUser = async (
  userData: User
): Promise<SuccessResponse> => {
  // Password restrictions and validations (frontend)
  const { password, confirmPassword } = userData;

  if (password.length < 8) {
    throw new ApiError(
      "Password must be at least 8 characters.",
      "PASSWORD_TOO_SHORT"
    );
  }
  if (!/[A-Z]/.test(password)) {
    throw new ApiError(
      "Password must contain at least one uppercase letter.",
      "PASSWORD_NO_UPPERCASE"
    );
  }
  if (!/[a-z]/.test(password)) {
    throw new ApiError(
      "Password must contain at least one lowercase letter.",
      "PASSWORD_NO_LOWERCASE"
    );
  }
  if (!/[0-9]/.test(password)) {
    throw new ApiError(
      "Password must contain at least one number.",
      "PASSWORD_NO_NUMBER"
    );
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new ApiError(
      "Password must contain at least one special character.",
      "PASSWORD_NO_SPECIAL"
    );
  }
  if (password !== confirmPassword) {
    throw new ApiError("Passwords do not match.", "PASSWORD_MISMATCH");
  }

  try {
    // Encrypt password before sending
    const encryptedPassword = CryptoJS.SHA256(userData.password).toString();
    const response = await apiClient.post<SuccessResponse>("/register", {
      ...userData,
      password: encryptedPassword,
    });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const userLogin = async (
  email: string,
  password: string
): Promise<SuccessResponse> => {
  try {
    // Encrypt password before sending
    const encryptedPassword = CryptoJS.SHA256(password).toString();

    const response = await apiClient.post<SuccessResponse>(
      "/userlogin",
      {
        email,
        password: encryptedPassword,
      },
      { withCredentials: true }
    ); // Include cookies in the request
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const verifyUserEmail = async (
  email: string,
  code: string
): Promise<SuccessResponse> => {
  try {
    // normalize the user input before hashing
    const encryptedCode = CryptoJS.SHA256(code.trim())
      .toString(CryptoJS.enc.Hex)
      .toLowerCase();

    const response = await apiClient.post<SuccessResponse>("/verify", {
      email,
      code: encryptedCode,
    });

    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const verifyResetCode = async (
  email: string,
  code: string
): Promise<SuccessResponse> => {
  try {
    // normalize the user input before hashing
    const encryptedCode = CryptoJS.SHA256(code.trim())
      .toString(CryptoJS.enc.Hex)
      .toLowerCase();

    const response = await apiClient.post<SuccessResponse>("/verifyresetcode", {
      email,
      code: encryptedCode,
    });

    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const Passwordreset = async (
  email: string
): Promise<SuccessResponse> => {
  try {
    const response = await apiClient.post<SuccessResponse>("/forgotpassword", {
      email,
    });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const newpasswordReq = async (
  email: string,
  password: string,
  confirmPassword: string
): Promise<SuccessResponse> => {
  if (password.length < 8) {
    throw new ApiError(
      "Password must be at least 8 characters.",
      "PASSWORD_TOO_SHORT"
    );
  }
  if (!/[A-Z]/.test(password)) {
    throw new ApiError(
      "Password must contain at least one uppercase letter.",
      "PASSWORD_NO_UPPERCASE"
    );
  }
  if (!/[a-z]/.test(password)) {
    throw new ApiError(
      "Password must contain at least one lowercase letter.",
      "PASSWORD_NO_LOWERCASE"
    );
  }
  if (!/[0-9]/.test(password)) {
    throw new ApiError(
      "Password must contain at least one number.",
      "PASSWORD_NO_NUMBER"
    );
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new ApiError(
      "Password must contain at least one special character.",
      "PASSWORD_NO_SPECIAL"
    );
  }
  if (password !== confirmPassword) {
    throw new ApiError("Passwords do not match.", "PASSWORD_MISMATCH");
  }

  const encryptedNewPassword = CryptoJS.SHA256(password).toString();
  try {
    const response = await apiClient.post<SuccessResponse>("/newpassword", {
      email,
      newPassword: encryptedNewPassword,
    });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};
