import express from "express";
import path, { dirname } from "path";
import dotenv from "dotenv";
import sequelize from "./sequelize/sequelize";
import cors from "cors";
import Router from "../src/routes/routes";
import cookieParser from "cookie-parser";
import Order from "./models/ordersModel";
import OrderItem from "./models/order-items-model";
import router from "../src/routes/routes";
import Product from "./models/productModel";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

dotenv.config();
const app = express();

/**
 * *for the onlie state
 * !! string search
 * filters inside the db
 * !!order status ==> enum / lookup table
 * // !!fix auth
 * //pagenation ==> fetch page fetch
 * break point
 * debugger ===>
 * //double booking problem
 * //admin & user check
 */

/**
 * done ==> pagination
 * done ==> added more items to test
 * done ==> fetching cart is triggered when clicking on the mycart from navbar or hit /cart
 * done ==> fetchcart items is only triggered when user is logged in
 * done ==> fix the admin auth
 * done ==> admin logout
 */

/**
 * backendcaching  caching instead of fetching from session storage
 * ACID --> Atomicity, Consistency, Isolation, Durability
 * websockets --> real time notfications for admin when new order is placed
 * deployment ==> readme github
 */

// ───────────────────────────────────────────────
// ✅ Middleware setup
// ───────────────────────────────────────────────
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000", // your frontend URL
  })
);
app.use("/", Router);

// ───────────────────────────────────────────────
// ✅ Create HTTP server (for both Express + WebSockets)
// ───────────────────────────────────────────────
const httpServer = createServer(app);

// ───────────────────────────────────────────────
// ✅ Initialize Socket.IO server
// ───────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Listen for connections from the admin dashboard
io.on("connection", (socket) => {
  console.log("✅ Admin connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Admin disconnected:", socket.id);
  });
});

// Export io so controllers like submitOrderCont can emit events
export { io };

// ───────────────────────────────────────────────
// ✅ Database connection + server start
// ───────────────────────────────────────────────
sequelize
  .authenticate()
  .then(() => {
    // console.log("products model fields:", Object.keys(Product.rawAttributes));
    console.log("Sequelize connected!");
    //return sequelize.sync({ force: true }); // Uncomment to sync models with DB
  })
  .then(() => {
    httpServer.listen(5172, () => {
      console.log("server is now running at http://localhost:5172");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
