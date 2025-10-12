import apiClient from "../util/axios";
import { SuccessResponse, ErrorResponse } from "./models";

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

/**
 * Adds a product to the cart.
 * - Sends only productId and quantity (userId is taken from JWT on backend).
 * - If not logged in, throws an error with code "NOT_LOGGED_IN".
 */
export const addToCart = async (productId: number, quantity: number = 1) => {
  try {
    const response = await apiClient.post("/addtocart", {
      productId,
      quantity,
    });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const clearCartReq = async () => {
  try {
    const response = await apiClient.delete("/clearcart");
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const getCartItems = async (): Promise<SuccessResponse> => {
  try {
    const res = await apiClient.get<SuccessResponse>("/getcart");
    return res.data;
  } catch (err: any) {
    throw handleError(err);
  }
};

export const incrementCartItem = async (productId: number) => {
  try {
    const response = await apiClient.post("/incrementcartitem", { productId });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const decrementCartItem = async (productId: number) => {
  try {
    const response = await apiClient.post("/decrementcartitem", { productId });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};

export const removeCartItem = async (productId: number) => {
  try {
    const response = await apiClient.post("/removecartitem", { productId });
    return response.data;
  } catch (error: any) {
    throw handleError(error);
  }
};
