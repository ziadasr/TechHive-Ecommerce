import { Request, Response } from "express";
import { Errors } from "../models/errorsModel";
import { Messages } from "../models/messages";
import admin from "../models/adminModel";
import Product from "../models/productModel";
import bcrypt from "bcrypt";
import { console } from "inspector";
import User from "../models/userModel";
import Order from "../models/ordersModel";
import Address from "../models/user-adress-model";
import OrderItem from "../models/order-items-model";
import jwtController from "./jwt-controller";
import Admin from "../models/adminModel";

const loginCont = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await admin.findOne({
      where: { email: email.toLowerCase() },
    });

    const passwordFromDB = user && user.password;
    if (!passwordFromDB) {
      return res.status(Errors.EMAIL_NOT_REGISTERED.status).json({
        error: Errors.EMAIL_NOT_REGISTERED.message,
        code: Errors.EMAIL_NOT_REGISTERED.code,
      });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, passwordFromDB);

    // user exists and account is verified
    if (isMatch) {
      const token = jwtController.issueToken({
        id: user.id,
        email: user.email,
        role: "admin",
      });
      console.log("Generated JWT:", token);
      const AdminCookie = token;
      res.cookie("AdminToken", AdminCookie, {
        httpOnly: true, // JS can't read this cookie
        //secure: process.env.NODE_ENV === "production", // only HTTPS in prod
        sameSite: "strict", // CSRF protection
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      console.log("Generated JWT:", token);
      return res.status(Messages.LOGIN_SUCCESS.status).json({
        message: Messages.LOGIN_SUCCESS.message,
        code: Messages.LOGIN_SUCCESS.code,
      });
    }
    return res.status(Errors.WRONG_PASSWORD.status).json({
      error: Errors.WRONG_PASSWORD.message,
      code: Errors.WRONG_PASSWORD.code,
    });
  } catch (err) {
    console.error(err);
    res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

//this func is used to add a hardcoded admin user to the database
//only one main admin can add other admins through the website
// const adduserCont = async () => {
//   // Hardcoded admin data
//   const adminData = {
//     name: "Ziad Yasser Asr",
//     dateOfBirth: new Date("2004-08-29"),
//     title: "Super Admin",
//     email: "aaa@mail.com",
//     password: "asdasd1", // will be encrypted
//     lastLogin: null,
//   };
//   // Encrypt password
//   const saltRounds = 10;
//   const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);
//   adminData.password = hashedPassword;

//   // Create admin in DB
//   const createdAdmin = await admin.create(adminData);
//   if (createdAdmin) {
//     console.log("Admin user created:", createdAdmin.email);
//   } else {
//     console.log("Admin user creation failed.");
//   }
// };

const dashboardProducts = async (req: Request, res: Response) => {
  try {
    console.log("Fetching all products from database...");
    const products = await Product.findAll({
      attributes: { exclude: ["imageUrl"] },
    });
    if (products.length === 0) {
      return res.status(Errors.NO_PRODUCTS.status).json({
        error: Errors.NO_PRODUCTS.message,
        code: Errors.NO_PRODUCTS.code,
      });
    }
    return res.status(Messages.SUCCESS_GET_PRODUCTS.status).json({
      message: Messages.SUCCESS_GET_PRODUCTS.message,
      code: Messages.SUCCESS_GET_PRODUCTS.code,
      data: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};
const searchProductByIdFromDashboard = async (req: Request, res: Response) => {
  const productID = req.params.id;
  try {
    console.log(`Searching for product with ID: ${productID}`);

    const product = await Product.findByPk(productID, {
      attributes: { exclude: ["imageUrl"] },
    });

    if (!product) {
      return res.status(Errors.PRODUCT_NOT_FOUND.status).json({
        error: Errors.PRODUCT_NOT_FOUND.message,
        code: Errors.PRODUCT_NOT_FOUND.code,
      });
    }

    return res.status(Messages.PRODUCT_FOUND.status).json({
      message: Messages.PRODUCT_FOUND.message,
      code: Messages.PRODUCT_FOUND.code,
      data: product,
    });
  } catch (err) {
    console.error(err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      message: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};
const searchUserByIdFromDashboard = async (req: Request, res: Response) => {
  console.log("searchUserByIdFromDashboard controller called");
  const userID = Number(req.params.id);
  try {
    console.log(`Searching for user with ID: ${userID}`);

    const user = await User.findByPk(userID, {
      attributes: {
        exclude: [
          "password",
          "EncryptedVerificationCode",
          "PasswordResetCode",
          "PasswordResetExpiry",
        ],
      },
    });

    if (!user) {
      return res.status(Errors.USER_NOT_FOUND.status).json({
        error: Errors.USER_NOT_FOUND.message,
        code: Errors.USER_NOT_FOUND.code,
      });
    }

    return res.status(Messages.USER_FOUND.status).json({
      message: Messages.USER_FOUND.message,
      code: Messages.USER_FOUND.code,
      data: user,
    });
  } catch (err) {
    console.error(err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      message: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  console.log("getAllUsers controller called");
  try {
    console.log("Fetching all users from database...");
    const users = await User.findAll({
      attributes: {
        exclude: [
          "password",
          "EncryptedVerificationCode",
          "PasswordResetCode",
          "PasswordResetExpiry",
        ],
      },
    });
    console.log("Fetched users:", users);
    if (users.length === 0) {
      return res.status(Errors.NO_USERS.status).json({
        error: Errors.NO_USERS.message,
        code: Errors.NO_USERS.code,
      });
    }
    return res.status(Messages.SUCCESS_GET_USERS.status).json({
      message: Messages.SUCCESS_GET_USERS.message,
      code: Messages.SUCCESS_GET_USERS.code,
      data: users,
    });
  } catch (err) {
    console.error(err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      Messages: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: Address,
          as: "address",
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // console.log("Fetched orders:", orders);
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentmethod: order.paymentmethod,
      createdAt: order.createdAt,
      address: order.address,
      items: order.items?.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        product: item.product
          ? {
              id: item.product.id,
              title: item.product.title,
              price: item.product.price,
              imgurl: item.product.imgurl,
            }
          : null,
      })),
    }));
    // console.log("order", formattedOrders);

    return res.status(Messages.ORDERS_FETCHED.status).json({
      orders: formattedOrders,
      message: Messages.ORDERS_FETCHED.message,
      code: Messages.ORDERS_FETCHED.code,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const searchOrderByIdFromDashboard = async (req: Request, res: Response) => {
  const orderID = Number(req.params.id);
  try {
    const orders = await Order.findAll({
      where: { id: orderID },
      include: [
        {
          model: Address,
          as: "address",
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // console.log("Fetched orders:", orders);
    const formattedOrders = orders.map((order: any) => ({
      id: order.id,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentmethod: order.paymentmethod,
      createdAt: order.createdAt,
      address: order.address,
      items: order.items?.map((item: any) => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
        product: item.product
          ? {
              id: item.product.id,
              title: item.product.title,
              price: item.product.price,
              imgurl: item.product.imgurl,
            }
          : null,
      })),
    }));
    // console.log("order", formattedOrders);

    return res.status(Messages.ORDERS_FETCHED.status).json({
      orders: formattedOrders,
      message: Messages.ORDERS_FETCHED.message,
      code: Messages.ORDERS_FETCHED.code,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const adminlogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("AdminToken");
    return res.status(200).json({ message: "loggedout" });
  } catch (err) {
    console.error(err);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const updateOrderState = async (req: Request, res: Response) => {
  console.log("updateOrderState controller called");
  const orderId = Number(req.params.id);
  const { status } = req.body;
  console.log("New status:", status);
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(Errors.ORDER_NOT_FOUND.status).json({
        error: Errors.ORDER_NOT_FOUND.message,
        code: Errors.ORDER_NOT_FOUND.code,
      });
    }
    order.status = status;

    await order.save();

    return res.status(Messages.ORDER_STATUS_UPDATED.status).json({
      message: Messages.ORDER_STATUS_UPDATED.message,
      orderId: order.id,
      orderStatus: order.status,
      code: Messages.ORDER_STATUS_UPDATED.code,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

export default {
  searchOrderByIdFromDashboard,
  loginCont,
  updateOrderState,
  getAllOrders,
  dashboardProducts,
  searchProductByIdFromDashboard,
  getAllUsers,
  searchUserByIdFromDashboard,
  adminlogout,
  // adduserCont,
};
