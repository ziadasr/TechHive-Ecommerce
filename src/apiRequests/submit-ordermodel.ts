export interface Address {
  id: number;
  userId: number;
  street: string;
  city: string;
  state?: string | null;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
  building?: string;
  floor?: string;
  apartment?: string;
}

export interface SuccessResponse {
  message: string;
  data: {
    name: string;
    phoneNumber: string;
    addresses: Address[];
  };
  code?: string;
}
export interface SubmitOrderResponse {
  message: string;
  code?: string;
  orderId?: number;
  error?: string;
}

export interface ErrorResponse {
  error: string;
  code: string;
}
export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  priceAtOrder: number;
  product?: {
    id: number;
    title: string;
    price: number;
    imgurl: string;
  };
}

export interface orders {
  id: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  items: OrderItem[];
  // products: {
  //   name: string;
  //   quantity: number;
  //   price: number;
  // }[];
}
