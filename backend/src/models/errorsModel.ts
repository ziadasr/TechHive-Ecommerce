export const Errors = {
  INTERNAL_ERROR: {
    code: "INTERNAL_ERROR",
    status: 500,
    message: "Internal server error",
  },
  USER_NOT_FOUND: {
    code: "USER_NOT_FOUND",
    status: 404,
    message: "User not found",
  },

  MISSING_DATA: {
    code: "MISSING_DATA",
    status: 400,
    message: "Missing required data",
  },
  PRODUCT_ALREADY_EXISTS: {
    code: "PRODUCT_ALREADY_EXISTS",
    status: 409,
    message: "Product already exists",
  },
  EMAIL_NOT_REGISTERED: {
    code: "EMAIL_NOT_REGISTERED",
    status: 401,
    message: "Email not registered",
  },
  WRONG_PASSWORD: {
    code: "WRONG_PASSWORD",
    status: 401,
    message: "Wrong password",
  },
  INVALID_OR_EXPIRED_TOKEN: {
    code: "INVALID_OR_EXPIRED_TOKEN",
    status: 403,
    message: "Invalid or expired token",
  },
  MISSING_AUTH_HEADER: {
    code: "MISSING_AUTH_HEADER",
    status: 401,
    message: "Authorization header missing",
  },
  NO_PRODUCTS: {
    code: "NO_PRODUCTS",
    status: 404,
    message: "No products yet",
  },
  PRODUCT_NOT_FOUND: {
    code: "PRODUCT_NOT_FOUND",
    status: 404,
    message: "Product not found",
  },
  PASSWORD_TOO_SHORT: {
    code: "PASSWORD_TOO_SHORT",
    status: 400,
    message: "Password must be at least 6 characters long",
  },
  PASSWORD_MISMATCH: {
    code: "PASSWORD_MISMATCH",
    status: 400,
    message: "Passwords do not match",
  },
  EMAIL_EXISTS: {
    code: "EMAIL_EXISTS",
    status: 409,
    message: "Email already exists",
  },
  INVALID_EMAIL: {
    code: "INVALID_EMAIL",
    status: 400,
    message: "Invalid email format",
  },
  VERIFICATION_FAILED: {
    code: "VERIFICATION_FAILED",
    status: 400,
    message: "Email verification failed",
  },
  EMAIL_NOT_VERIFIED: {
    code: "EMAIL_NOT_VERIFIED",
    status: 403,
    message: "Email not verified",
  },
  PASSWORD_MUST_CONTAIN_UPPERCASE: {
    code: "PASSWORD_MUST_CONTAIN_UPPERCASE",
    status: 400,
    message: "Password must contain at least one uppercase letter.",
  },
  PASSWORD_MUST_CONTAIN_LOWERCASE: {
    code: "PASSWORD_MUST_CONTAIN_LOWERCASE",
    status: 400,
    message: "Password must contain at least one lowercase letter.",
  },
  PASSWORD_MUST_CONTAIN_NUMBER: {
    code: "PASSWORD_MUST_CONTAIN_NUMBER",
    status: 400,
    message: "Password must contain at least one number.",
  },
  PASSWORD_MUST_CONTAIN_SPECIAL: {
    code: "PASSWORD_MUST_CONTAIN_SPECIAL",
    status: 400,
    message: "Password must contain at least one special character.",
  },
  NOT_LOGGED_IN: {
    code: "NOT_LOGGED_IN",
    status: 401,
    message: "Please log in to continue.",
  },
  CART_NOT_FOUND: {
    code: "CART_NOT_FOUND",
    status: 404,
    message: "Cart not found",
  },
  MINIMUM_QUANTITY: {
    code: "MINIMUM_QUANTITY",
    status: 400,
    message: "Quantity cannot be less than 1",
  },
  INVALID_ADDRESS_DATA: {
    code: "INVALID_ADDRESS_DATA",
    status: 400,
    message: "Invalid address data",
  },
  INVALID_ORDER_DATA: {
    code: "INVALID_ORDER_DATA",
    status: 400,
    message: "Invalid order data",
  },
  ADDRESS_NOT_FOUND: {
    code: "ADDRESS_NOT_FOUND",
    status: 404,
    message: "Address not found",
  },
  EMPTY_CART: {
    code: "EMPTY_CART",
    status: 400,
    message: "Cart is empty",
  },
  INSUFFICIENT_STOCK: {
    code: "INSUFFICIENT_STOCK",
    status: 400,
    message: "Insufficient stock for one or more products",
  },
  INVALID_REQUEST: {
    code: "INVALID_REQUEST",
    status: 400,
    message: "Invalid request",
  },
  TOKEN_EXPIRED: {
    code: "TOKEN_EXPIRED",
    status: 403,
    message: "Token has expired",
  },
  NO_USERS: {
    code: "NO_USERS",
    status: 404,
    message: "No users found",
  },
  ORDER_NOT_FOUND: {
    code: "ORDER_NOT_FOUND",
    status: 404,
    message: "Order not found",
  },
  NOT_AUTH: {
    code: "NOT_AUTH",
    status: 403,
    message: "Not authorized to access this resource",
  },
};
