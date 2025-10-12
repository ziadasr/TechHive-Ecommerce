import apiClient from "../util/axios";
import { Address, SubmitOrderResponse, orders } from "./submit-ordermodel";

export const getUserInfo = async (): Promise<{
  name: string;
  phoneNumber: string;
  email: string;
}> => {
  try {
    const result = await apiClient.get<{
      name: string;
      phoneNumber: string;
      email: string;
    }>("/getuser");
    return result.data;
  } catch (err: any) {
    throw err.response?.data || { error: "Network error" };
  }
};

export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const result = await apiClient.get<{ addresses: Address[] }>(
      "/getuseraddresses"
    );
    return result.data.addresses;
  } catch (err: any) {
    throw err.response?.data || { error: "Network error" };
  }
};

export const onAddAddress = async (address: {
  street: string;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
}) => {
  try {
    const result = await apiClient.post<{ data: Address }>(
      "/addaddress",
      address
    );
    return result.data.data;
  } catch (err: any) {
    throw err.response?.data || { error: "Network error" };
  }
};
export const submitOrder = async (
  addressId: number,
  paymentmethod: "cod" | "online"
): Promise<SubmitOrderResponse> => {
  try {
    const response = await apiClient.post<SubmitOrderResponse>(
      "/submit-order",
      { addressId, paymentmethod }
    );
    return response.data;
  } catch (err: any) {
    throw err.response?.data || { error: "Network error" };
  }
};
export const getUserOrders = async () => {
  try {
    const response = await apiClient.get<{ orders: orders[] }>("getorders");
    // console.log("User orders response:", response.data);
    return response.data.orders;
  } catch (err: any) {
    throw err.response?.data || { error: "Network error" };
  }
};
