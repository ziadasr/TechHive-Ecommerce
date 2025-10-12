import { Request, Response } from "express";
import { Errors } from "../models/errorsModel";
import { Messages } from "../models/messages";
import bcrypt from "bcrypt";
import User from "../models/userModel";
import sendEmail from "./mailing";
import jwtController from "./jwt-controller";
import { resolve } from "path";
import sequelize from "../sequelize/sequelize";
import Address from "../models/user-adress-model";
import getCart from "./cart-controller";
import Cart from "../models/cartmodel";
import CartItem from "../models/cart-item-model";
import { Where } from "sequelize/types/utils";
import cartController from "./cart-controller";
import { mode } from "crypto-js";
import { Model, Transaction } from "sequelize";
import Product from "../models/productModel";
import { captureRejectionSymbol } from "events";
import Order from "../models/ordersModel";
import OrderItem from "../models/order-items-model";
import transaction from "sequelize/types/transaction";
import { count } from "console";
import model from "sequelize/types/model";
import { io } from "../server";
//!there as an error related to the admin dashboard cant render all the fields of the order
//!the touched files for the error are this file and orderstable.tsx
//! didnt touch them yet admindashbord.tsx adminreq.tsx

export const submitOrderCont = async (req: Request, res: Response) => {
  console.log("hitting submit order controller");

  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(Errors.USER_NOT_FOUND.status).json({
      error: Errors.USER_NOT_FOUND.message,
      code: Errors.USER_NOT_FOUND.code,
    });
  }

  const { addressId, paymentmethod } = req.body;
  if (!addressId || !paymentmethod) {
    console.log("Invalid order data:", req.body);
    return res.status(Errors.INVALID_ORDER_DATA.status).json({
      error: Errors.INVALID_ORDER_DATA.message,
      code: Errors.INVALID_ORDER_DATA.code,
    });
  }

  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    const t = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const user = await User.findByPk(userId, { transaction: t });
      if (!user) {
        await t.rollback();
        return res.status(Errors.USER_NOT_FOUND.status).json({
          error: Errors.USER_NOT_FOUND.message,
          code: Errors.USER_NOT_FOUND.code,
        });
      }

      const address = await Address.findOne({
        where: { id: addressId, userId },
        transaction: t,
      });
      if (!address) {
        await t.rollback();
        return res.status(Errors.ADDRESS_NOT_FOUND.status).json({
          error: Errors.ADDRESS_NOT_FOUND.message,
          code: Errors.ADDRESS_NOT_FOUND.code,
        });
      }

      const cart = await Cart.findOne({
        where: { userId },
        include: [
          {
            model: CartItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
        transaction: t,
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        await t.rollback();
        return res.status(Errors.EMPTY_CART.status).json({
          error: Errors.EMPTY_CART.message,
          code: Errors.EMPTY_CART.code,
        });
      }

      const cartItems = cart.items
        .filter(
          (item): item is CartItem & { product: Product } => !!item.product
        )
        .map((item) => ({
          id: item.id,
          quantity: item.quantity,
          priceAtAdd: item.priceAtAdd,
          product: {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            imgurl: item.product.imgurl,
          },
        }));

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.priceAtAdd * item.quantity,
        0
      );

      const order = await Order.create(
        {
          userId,
          addressId,
          status: "pending",
          totalAmount,
          paymentmethod,
        },
        { transaction: t }
      );

      for (const item of cartItems) {
        const product = await Product.findByPk(item.product.id, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        });

        if (!product || product.count < item.quantity) {
          await t.rollback();
          return res.status(400).json({
            error: `Product "${item.product.title}" is out of stock or insufficient quantity.`,
            code: "OUT_OF_STOCK",
          });
        }

        await OrderItem.create(
          {
            orderId: order.id,
            productId: item.product.id,
            quantity: item.quantity,
            priceAtOrder: item.priceAtAdd,
          },
          { transaction: t }
        );

        await Product.decrement(
          { count: item.quantity },
          { where: { id: item.product.id }, transaction: t }
        );
      }

      await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
      await t.commit();
      io.emit("newOrder", {
        id: order.id,
        totalAmount,
        paymentmethod,
        user: userId || "Customer",
        createdAt: new Date(),
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          country: address.country,
          building: address.building,
          floor: address.floor,
          apartment: address.apartment,
        },
        items: cartItems,
      });
      // Send email recap
      const recapHtml = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
        margin: 0;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        background: #ffffff;
        margin: auto;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }
      h2 {
        color: #333;
      }
      .section {
        margin-bottom: 20px;
      }
      .items-table {
        width: 100%;
        border-collapse: collapse;
      }
      .items-table th, .items-table td {
        border: 1px solid #ddd;
        padding: 10px;
        text-align: left;
      }
      .items-table th {
        background: #f2f2f2;
      }
      .total {
        font-size: 18px;
        font-weight: bold;
        text-align: right;
        padding-top: 10px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>🛒 Order Confirmation</h2>
      <p>Hello ${user.name || "Customer"},</p>
      <p>Thank you for shopping with us! Your order has been placed successfully </p>
      
      <div class="section">
        <strong>Order ID:</strong> ${order.id}<br />
        <strong>Payment Method:</strong> ${paymentmethod}<br />
        <strong>Shipping Address:</strong> ${address.street}, ${address.city}
      </div>

      <div class="section">
        <h3>Items Ordered</h3>
        <table class="items-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems
              .map(
                (i) => `
              <tr>
                <td>${i.product.title}</td>
                <td>${i.quantity}</td>
                <td>${i.priceAtAdd * i.quantity} EGP</td>
              </tr>`
              )
              .join("")}
          </tbody>
        </table>
        <p class="total">Total: ${totalAmount} EGP</p>
      </div>

      <p>Your order should be delivered within 5-7 business days.</p>

      <div class="footer">
        💙 Thank you for choosing us!<br />
        If you have any questions, just reply to this email.
      </div>
    </div>
  </body>
</html>
`; // Your existing HTML template
      if (user.email)
        await sendEmail(user.email, "Your Order Confirmation", recapHtml);

      return res.status(Messages.ORDER_PLACED.status).json({
        message: Messages.ORDER_PLACED.message,
        code: Messages.ORDER_PLACED.code,
        orderId: order.id,
      });
    } catch (error: any) {
      await t.rollback();

      const isDeadlock =
        error?.original?.code === "1213" || // MySQL
        error?.original?.code === "40P01"; // PostgreSQL

      if (isDeadlock) {
        attempt++;
        console.log(`Deadlock detected, retrying transaction... (${attempt})`);
        continue; // retry the loop
      }

      console.error("Order submission error:", error);
      return res.status(Errors.INTERNAL_ERROR.status).json({
        error: Errors.INTERNAL_ERROR.message,
        code: Errors.INTERNAL_ERROR.code,
      });
    }
  }

  return res.status(Errors.INTERNAL_ERROR.status).json({
    error: "Transaction failed after multiple retries due to deadlocks",
    code: "DEADLOCK_RETRIES_EXCEEDED",
  });
};

// export const submitOrderCont = async (req: Request, res: Response) => {
//   console.log("hitting submit order controller");
//   const userId = (req as any).user?.userId;
//   if (!userId) {
//     return res.status(Errors.USER_NOT_FOUND.status).json({
//       error: Errors.USER_NOT_FOUND.message,
//       code: Errors.USER_NOT_FOUND.code,
//     });
//   }

//   const { addressId, paymentmethod } = req.body;
//   if (!addressId || !paymentmethod) {
//     console.log("Invalid order data:", req.body);
//     return res.status(Errors.INVALID_ORDER_DATA.status).json({
//       error: Errors.INVALID_ORDER_DATA.message,
//       code: Errors.INVALID_ORDER_DATA.code,
//     });
//   }
//   const t = await sequelize.transaction({
//     isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
//   });

//   try {
//     const user = await User.findByPk(userId, { transaction: t });
//     if (!user) {
//       await t.rollback();
//       return res.status(Errors.USER_NOT_FOUND.status).json({
//         error: Errors.USER_NOT_FOUND.message,
//         code: Errors.USER_NOT_FOUND.code,
//       });
//     }
//     const address = await Address.findOne({
//       where: { id: addressId, userId },
//       transaction: t,
//     });
//     if (!address) {
//       await t.rollback();
//       return res.status(Errors.ADDRESS_NOT_FOUND.status).json({
//         error: Errors.ADDRESS_NOT_FOUND.message,
//         code: Errors.ADDRESS_NOT_FOUND.code,
//       });
//     }
//     const cart = await Cart.findOne({
//       where: { userId },
//       include: [
//         {
//           model: CartItem,
//           as: "items",
//           include: [{ model: Product, as: "product" }],
//         },
//       ],
//       transaction: t,
//     });

//     if (!cart || !cart.items || cart.items.length === 0) {
//       await t.rollback();
//       return res.status(Errors.EMPTY_CART.status).json({
//         error: Errors.EMPTY_CART.message,
//         code: Errors.EMPTY_CART.code,
//       });
//     }
//     // Safely map cart items with products

//     const cartItems = cart.items //array of cart items each item has a product attached to it
//       .filter((item): item is CartItem & { product: Product } => !!item.product) //make sure each item has a product if not remove it from the array
//       .map((item) => ({
//         id: item.id,
//         quantity: item.quantity,
//         priceAtAdd: item.priceAtAdd,
//         product: {
//           id: item.product.id,
//           title: item.product.title,
//           price: item.product.price,
//           imgurl: item.product.imgurl,
//         },
//       }));
//     // console.log("cartItems", cartItems);
//     const totalAmount = cartItems.reduce(
//       //reduce combine all items to get total amount loops over them all and does the sum
//       (sum, item) => sum + item.priceAtAdd * item.quantity,
//       0
//     );

//     const order = await Order.create(
//       {
//         userId,
//         addressId,
//         status: "pending",
//         totalAmount,
//         paymentmethod,
//       },
//       { transaction: t }
//     );
//     for (const item of cartItems) {
//       // Fetch the latest product stock
//       const product = await Product.findByPk(item.product.id, {
//         transaction: t,
//         lock: Transaction.LOCK.UPDATE,
//       });
//       if (!product || product.count < item.quantity) {
//         await t.rollback();
//         return res.status(400).json({
//           error: `Product "${item.product.title}" is out of stock or insufficient quantity.`,
//           code: "OUT_OF_STOCK",
//         });
//       }

//       // Create order item
//       await OrderItem.create(
//         {
//           orderId: order.id,
//           productId: item.product.id,
//           quantity: item.quantity,
//           priceAtOrder: item.priceAtAdd,
//         },
//         { transaction: t }
//       );

//       // Decrement product stock
//       await Product.decrement(
//         { count: item.quantity },
//         { where: { id: item.product.id }, transaction: t }
//       );
//     }
//     await CartItem.destroy({ where: { cartId: cart.id }, transaction: t });
//     await t.commit();
//     const recapHtml = `
// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="UTF-8" />
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         background-color: #f6f6f6;
//         margin: 0;
//         padding: 20px;
//       }
//       .container {
//         max-width: 600px;
//         background: #ffffff;
//         margin: auto;
//         padding: 20px;
//         border-radius: 10px;
//         box-shadow: 0 2px 5px rgba(0,0,0,0.1);
//       }
//       h2 {
//         color: #333;
//       }
//       .section {
//         margin-bottom: 20px;
//       }
//       .items-table {
//         width: 100%;
//         border-collapse: collapse;
//       }
//       .items-table th, .items-table td {
//         border: 1px solid #ddd;
//         padding: 10px;
//         text-align: left;
//       }
//       .items-table th {
//         background: #f2f2f2;
//       }
//       .total {
//         font-size: 18px;
//         font-weight: bold;
//         text-align: right;
//         padding-top: 10px;
//       }
//       .footer {
//         margin-top: 30px;
//         font-size: 12px;
//         color: #777;
//         text-align: center;
//       }
//     </style>
//   </head>
//   <body>
//     <div class="container">
//       <h2>🛒 Order Confirmation</h2>
//       <p>Hello ${user.name || "Customer"},</p>
//       <p>Thank you for shopping with us! Your order has been placed successfully </p>

//       <div class="section">
//         <strong>Order ID:</strong> ${order.id}<br />
//         <strong>Payment Method:</strong> ${paymentmethod}<br />
//         <strong>Shipping Address:</strong> ${address.street}, ${address.city}
//       </div>

//       <div class="section">
//         <h3>Items Ordered</h3>
//         <table class="items-table">
//           <thead>
//             <tr>
//               <th>Product</th>
//               <th>Qty</th>
//               <th>Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             ${cartItems
//               .map(
//                 (i) => `
//               <tr>
//                 <td>${i.product.title}</td>
//                 <td>${i.quantity}</td>
//                 <td>${i.priceAtAdd * i.quantity} EGP</td>
//               </tr>`
//               )
//               .join("")}
//           </tbody>
//         </table>
//         <p class="total">Total: ${totalAmount} EGP</p>
//       </div>

//       <p>Your order should be delivered within 5-7 business days.</p>

//       <div class="footer">
//         💙 Thank you for choosing us!<br />
//         If you have any questions, just reply to this email.
//       </div>
//     </div>
//   </body>
// </html>
// `;

//     try {
//       if (user.email) {
//         await sendEmail(user.email, "Your Order Confirmation", recapHtml);
//       }
//     } catch (emailError) {
//       console.error(
//         "Failed to send recap email your order is submitted:",
//         emailError
//       );
//     }
//     return res.status(Messages.ORDER_PLACED.status).json({
//       message: Messages.ORDER_PLACED.message,
//       code: Messages.ORDER_PLACED.code,
//       orderId: order.id,
//     });
//   } catch (error) {
//     // Always rollback on error
//     console.log("error", error);
//     if (typeof t !== "undefined") {
//       try {
//         await t.rollback();
//       } catch (rollbackError) {
//         console.error("Rollback error:", rollbackError);
//       }
//     }
//     console.error("Order submission error:", error);
//     return res.status(Errors.INTERNAL_ERROR.status).json({
//       error: Errors.INTERNAL_ERROR.message,
//       code: Errors.INTERNAL_ERROR.code,
//     });
//   }
// };

export const getOrdersCont = async (req: Request, res: Response) => {
  // const userId = (req as any).user?.userId;
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(Errors.USER_NOT_FOUND.status).json({
      error: Errors.USER_NOT_FOUND.message,
      code: Errors.USER_NOT_FOUND.code,
    });
  }

  try {
    const orders = await Order.findAll({
      where: { userId },
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
    console.log("order", formattedOrders);

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

export default { submitOrderCont, getOrdersCont };
