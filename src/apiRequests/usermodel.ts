import { Address } from "cluster";

export interface User {
  id?: number;
  name: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  password: string;
  lastLogin?: Date;
  city: string;
  confirmPassword: string;
  isVerified?: boolean;
  EncryptedVerificationCode?: string;
}
export interface SuccessResponse {
  resetToken: any;
  user?: User[];
  message: string;
  address?: Address[];
  code: string;
}

export interface ErrorResponse {
  error: string;
  code: string;
}
