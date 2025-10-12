import productsController from "../controllers/products-controller";
import adminControllers from "../controllers/admins-controllers";
import { Router } from "express";
import jwtController from "../controllers/jwt-controller";
import userController from "../controllers/user-controller";
import cartController from "../controllers/cart-controller";
import ordersController from "../controllers/orders-controller";
const router = Router();

//admin methods ==========================================> //!admin management
router.get("/admin/check-admin-auth", jwtController.authenticateAdminJWT);

router.post(
  "/add",
  jwtController.authenticateAdminJWT,
  productsController.addProduct
);
router.post("/login", adminControllers.loginCont);
router.get(
  "/admin/products",
  jwtController.authenticateAdminJWT,
  adminControllers.dashboardProducts
);
router.get(
  "/admin/dashboard/:id",
  jwtController.authenticateAdminJWT,
  adminControllers.searchProductByIdFromDashboard
);
router.put(
  "/admin/orders/:id",
  jwtController.authenticateAdminJWT,
  adminControllers.updateOrderState
);
router.get(
  "/admin/orders",
  jwtController.authenticateAdminJWT,
  adminControllers.getAllOrders
);
router.get(
  "/admin/users/:id",
  jwtController.authenticateAdminJWT,
  adminControllers.searchUserByIdFromDashboard
);
router.get(
  "/admin/orders/:id",
  jwtController.authenticateAdminJWT,
  adminControllers.searchOrderByIdFromDashboard
);
router.get(
  "/admin/users",
  jwtController.authenticateAdminJWT,
  adminControllers.getAllUsers
);
router.get("/authuser", jwtController.authenticateJWT);

//register, verify, login, forgot password, change password =====> //!User acc management
router.post("/register", userController.registrationCont);
router.post("/verify", userController.verifyCont);
router.post("/verifyresetcode", userController.verifyResetCodeCont);
router.post("/userlogin", userController.loginCont);
router.post("/forgotpassword", userController.forgotPasswordCont);
router.post(
  "/newpassword",
  jwtController.authenticateresetJWT,
  userController.changePasswordCont
);

//cart methods ==========================================> //!cart management
router.post(
  "/addtocart",
  jwtController.authenticateJWT,
  cartController.addToCart
);

router.post(
  "/incrementcartitem",
  jwtController.authenticateJWT,
  cartController.incrementCartItem
);

router.post(
  "/decrementcartitem",
  jwtController.authenticateJWT,
  cartController.decrementCartItem
);

router.post(
  "/removecartitem",
  jwtController.authenticateJWT,
  cartController.removeSingleCartItem
);
router.delete(
  "/clearcart",
  jwtController.authenticateJWT,
  cartController.clearCart
);
router.get("/getcart", jwtController.authenticateJWT, cartController.getCart);

//user methods ==========================================> //!user management
router.get(
  "/getuser",
  jwtController.authenticateJWT,
  userController.getUserInfo
);

router.get(
  "/getuseraddresses",
  jwtController.authenticateJWT,
  userController.getUserAddresses
);

router.post(
  "/addaddress",
  jwtController.authenticateJWT,
  userController.addaddressCont
);
//orders methods ==========================================> //!orders management
router.post(
  "/submit-order",
  jwtController.authenticateJWT,
  ordersController.submitOrderCont
);

router.get(
  "/getorders",
  jwtController.authenticateJWT,
  ordersController.getOrdersCont
);

/*delete the reset token cookie after password reset or if user decides to cancel the reset process */
router.post("/clear-reset-token", userController.clearResetPassCookie);
router.post("/logout", userController.clearAuthCookie);
router.post("/admin/logout", adminControllers.adminlogout);

//main products page ==============================> //!products management
router.get("/", productsController.getAllProducts);
router.get("/getbrands", productsController.getAllBrands);

export default router;
