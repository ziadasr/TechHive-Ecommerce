export interface Product {
  id: number;
  title: string;
  imgurl: string;
  price: number;
  company: string;
  info: string;
  // incart: boolean;
  count: number;
  total: number;
  created_at?: string;
  updated_at?: string;
}
// Adjusted to match backend response structure because it's not just returning the products
export interface SuccessResponse {
  products?: Product[];
  cart?: Product[];
  message: string;
  code: string;
}

export interface ErrorResponse {
  error: string;
  code: string;
}

export interface ProductForm {
  title: string;
  imgurl: string;
  price: number;
  company: string;
  info: string;
  count: number;
  // incart: boolean;
  total: number;
}
