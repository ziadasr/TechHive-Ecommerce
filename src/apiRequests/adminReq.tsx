import apiClient from "../util/axios";
import { ErrorResponse } from "./models";
/**
 * todo jwt token
 * todo add admin
 * todo protect routes
 * todo last log in
 * todo admin dashboard
 */
//this is the function that sends login request to the backend
export const loginAdmin = async (email: string, password: string) => {
  try {
    const res = await apiClient.post("/login", { email, password });
    return res.data;
  } catch (err: any) {
    //console.error("Login error:", err);
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    // Create a proper Error object and include your custom data on it
    throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
  }
};

export const dashboardProducts = async () => {
  try {
    const res = await apiClient.get("/admin/products");
    // console.log(res.data);
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    // Create a proper Error object and include your custom data on it
    throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
  }
};

export const searchProductByIdFromDashboard = async (id: number) => {
  try {
    const res = await apiClient.get(`/admin/dashboard/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    // Create a proper Error object and include your custom data on it
    throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
  }
};

export const getAllUsers = async () => {
  try {
    const res = await apiClient.get("/admin/users");
    // console.log(res.data);
    // console.log(res);
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    // Create a proper Error object and include your custom data on it
    throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
  }
};

export const searchUserById = async (id: number) => {
  try {
    const res = await apiClient.get(`/admin/users/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    // Create a proper Error object and include your custom data on it
    throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
  }
};

export const getAllOrders = async () => {
  try {
    const res = await apiClient.get("/admin/orders");
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    // Create a proper Error object and include your custom data on it
    throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
  }
};
export const updateOrderState = async (orderId: number, newState: string) => {
  try {
    const res = await apiClient.put(`/admin/orders/${orderId}`, {
      status: newState,
    });
    console.log(res.data);
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    // Create a proper Error object and include your custom data on it
    throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
  }
};
export const searchOrderById = async (id: number) => {
  try {
    const res = await apiClient.get(`/admin/orders/${id}`);
    return res.data;
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    // Create a proper Error object and include your custom data on it
    throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
  }
};

/**
!from ====> throw { error: "Network error", code: "NETWORK_ERROR" } as ErrorResponse;

t0 ====> throw new Error(
      JSON.stringify({
        error: "Network error",
        code: "NETWORK_ERROR",
      } as ErrorResponse)
    );
 */

/**
 from ====> throw err.response.data as ErrorResponse;
  to ====> throw new Error(JSON.stringify(err.response.data));
 */
