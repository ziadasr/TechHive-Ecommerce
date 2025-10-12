import apiClient from "../util/axios";
import { ProductForm, SuccessResponse } from "./models";

//this is the function that fetches the products from the backend
export const fetchProducts = async (
  page: number,
  size: number = 12,
  minPrice?: number,
  maxPrice?: number,
  selectedBrandIds?: (number | string)[],
  sortBy?: string
): Promise<SuccessResponse> => {
  try {
    //intialize params with page and size
    //that means that the parameter keys is a string and the param itself could be anyvalue and then assign the page and size
    const params: Record<string, any> = { page, size };
    if (sortBy !== undefined) params.sort_by = sortBy;
    if (minPrice !== undefined) params.min_price = minPrice;
    if (maxPrice !== undefined) params.max_price = maxPrice;
    //// if (selectedBrandIds !== undefined) params.brand = selectedBrandIds; wrong with array
    // * If 'brandIds' is an array (multiple selections), it must be converted
    // to a comma-separated string (e.g., "1,5,12") before being added to query params.
    // This is the standard RESTful practice for sending multiple IDs to the backend.
    if (selectedBrandIds !== undefined && selectedBrandIds.length > 0)
      params.brand_ids = selectedBrandIds.join(",");
    const res = await apiClient.get<SuccessResponse>(`/`, {
      params: params,
    });
    return res.data;
  } catch (err: any) {
    console.error("Fetch products error:", err);
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    throw new Error(
      JSON.stringify({ error: "Network error", code: "NETWORK_ERROR" })
    );
  }
};

//everything Axios knows about the failed HTTP response
//err.res.data is the data returned from the backend  ==> code and message in errror model backend
export const addItem = async (form: ProductForm): Promise<void> => {
  const item = { ...form };
  try {
    await apiClient.post("/add", item);
  } catch (err: any) {
    if (err.response && err.response.data) {
      throw new Error(JSON.stringify(err.response.data));
    }
    throw new Error(
      JSON.stringify({ error: "Network error", code: "NETWORK_ERROR" })
    );
  }
};
