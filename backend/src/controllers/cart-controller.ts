import e, { Request, Response } from "express";
import { Errors } from "../models/errorsModel";
import { Messages } from "../models/messages";
import User from "../models/userModel";
import Cart from "../models/cartmodel";
import CartItem from "../models/cart-item-model";
import Product from "../models/productModel";
import sequelize from "../sequelize/sequelize";
import { where } from "sequelize";
import { error } from "console";

/**
 * todo remove req as any
 * //todo remove ==> as any
 * //todo undertand the cart-items
 * @param req
 * @param res
 * @returns
 */

const addToCart = async (req: Request, res: Response) => {
  console.log("Add to cart called");
  console.log("Add to cart request body:", req.body);
  const userId = (req as any).user?.userId;
  const { productId, quantity } = req.body;

  if (!userId) {
    return res.status(Errors.NOT_LOGGED_IN.status).json({
      message: Errors.NOT_LOGGED_IN.message,
      code: Errors.NOT_LOGGED_IN.code,
    });
  }

  if (!productId || !quantity || Number(quantity) <= 0) {
    return res.status(Errors.MISSING_DATA.status).json({
      message: Errors.MISSING_DATA.message,
      code: Errors.MISSING_DATA.code,
    });
  }

  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    // Check if user exists
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(Errors.USER_NOT_FOUND.status).json({
        message: Errors.USER_NOT_FOUND.message,
        code: Errors.USER_NOT_FOUND.code,
      });
    }

    // Get or create the cart for this user
    let cart = await Cart.findOne({ where: { userId: userId }, transaction });
    if (!cart) {
      cart = await Cart.create({ userId: userId }, { transaction });
    }

    // Check if product exists
    const product = await Product.findByPk(productId, { transaction });
    if (!product) {
      await transaction.rollback();
      return res.status(Errors.PRODUCT_NOT_FOUND.status).json({
        message: Errors.PRODUCT_NOT_FOUND.message,
        code: Errors.PRODUCT_NOT_FOUND.code,
      });
    }
    if (product.count < Number(quantity)) {
      return res.status(Errors.INSUFFICIENT_STOCK.status).json({
        message: Errors.INSUFFICIENT_STOCK.message,
        code: Errors.INSUFFICIENT_STOCK.code,
      });
    }

    // Find if the product is already in the cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
      transaction,
    });

    if (cartItem) {
      // Update quantity
      cartItem.quantity += Number(quantity);
      await cartItem.save({ transaction });
    } else {
      // Create new cart item
      cartItem = await CartItem.create(
        {
          cartId: cart.id,
          productId,
          quantity: Number(quantity),
          priceAtAdd: product.price,
        },
        { transaction }
      );
    }

    // Commit the transaction
    await transaction.commit();

    return res.status(Messages.PRODUCT_ADDED_TO_CART.status).json({
      success: true,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: cartItem.quantity,
      },
      message: Messages.PRODUCT_ADDED_TO_CART.message,
      code: Messages.PRODUCT_ADDED_TO_CART.code,
    });
  } catch (error) {
    // Rollback on any error
    if (transaction) await transaction.rollback();
    console.error("Error adding to cart:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      message: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const getCart = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(Errors.NOT_LOGGED_IN.status).json({
      message: Errors.NOT_LOGGED_IN.message,
      code: Errors.NOT_LOGGED_IN.code,
    });
  }

  try {
    // Fetch the user's cart with items and product info
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          /**
           * If you omit as in the include, Sequelize will try to match the default association name, which is usually the model name in camelCase (cartItems instead of items).
           * If the as doesn’t match what you defined in your model associations, Sequelize won’t be able to load the relation and you might get undefined for cart.items.
           */
          model: CartItem,
          as: "items", //why do we need as ??
          // "as" must match the name used in the association; otherwise Sequelize won't find the related items

          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(Messages.EMPTY_CART.status).json({
        success: true,
        cart: [],
        message: Messages.EMPTY_CART.message,
        code: Messages.EMPTY_CART.code,
      });
    }

    // Safely map cart items that have products

    const cartItems = cart.items //array of cart items each item has a product attached to it
      .filter((item): item is CartItem & { product: Product } => !!item.product) //make sure each item has a product if not remove it from the array
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

    return res.status(Messages.SUCCESS_GET_CART.status).json({
      success: true,
      cart: cartItems,
      message: Messages.SUCCESS_GET_CART.message,
      code: Messages.SUCCESS_GET_CART.code,
    });
  } catch (error) {
    console.error("Error getting cart:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      message: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};
const clearCart = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(Errors.NOT_LOGGED_IN.status).json({
      message: Errors.NOT_LOGGED_IN.message,
      code: Errors.NOT_LOGGED_IN.code,
    });
  }
  console.log("User ID:", userId);

  const t = await sequelize.transaction();
  try {
    const cart = await Cart.findOne({
      where: { userId },
      transaction: t,
      //  lock: t.LOCK.UPDATE,
    });

    if (!cart) {
      await t.rollback();
      return res.status(Messages.EMPTY_CART.status).json({
        message: Messages.EMPTY_CART.message,
        code: Messages.EMPTY_CART.code,
      });
    }

    // Delete all items for this cart
    const deletedCount = await CartItem.destroy({
      where: { cartId: cart.id },
      transaction: t,
    });
    console.log("Deleted count:", deletedCount);

    if (deletedCount === 0) {
      await t.rollback();
      return res.status(Messages.EMPTY_CART.status).json({
        message: Messages.EMPTY_CART.message,
        code: Messages.EMPTY_CART.code,
      });
    }

    await t.commit();
    return res.status(Messages.CART_CLEARED.status).json({
      message: Messages.CART_CLEARED.message,
      code: Messages.CART_CLEARED.code,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error clearing cart:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      message: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};
const incrementCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { productId } = req.body;
  console.log("productId from body:", productId);

  if (!userId) {
    return res.status(Errors.NOT_LOGGED_IN.status).json({
      message: Errors.NOT_LOGGED_IN.message,
      code: Errors.NOT_LOGGED_IN.code,
    });
  }
  console.log("Product ID:", productId);
  if (!productId) {
    return res.status(Errors.PRODUCT_NOT_FOUND.status).json({
      message: Errors.PRODUCT_NOT_FOUND.message,
      code: Errors.PRODUCT_NOT_FOUND.code,
    });
  }

  try {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });
    //no cart found is actually when user has no items in cartS
    if (!cart) {
      return res.status(Errors.CART_NOT_FOUND.status).json({
        message: Errors.CART_NOT_FOUND.message,
        code: Errors.CART_NOT_FOUND.code,
      });
    }

    // Convert productId to number
    const productIdNum = Number(productId); //it is recieved as a string ftom the http

    const cartItem = cart.items?.find(
      (item) => item.productId === productIdNum
    );

    console.log("Cart item found:", cartItem ? cartItem.toJSON() : "Not found");

    if (!cartItem) {
      return res.status(Errors.PRODUCT_NOT_FOUND.status).json({
        message: Errors.PRODUCT_NOT_FOUND.message,
        code: Errors.PRODUCT_NOT_FOUND.code,
      });
    }

    cartItem.quantity += 1;
    await cartItem.save();

    const updatedCart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!updatedCart || !updatedCart.items) {
      return res.status(Errors.CART_NOT_FOUND.status).json({
        message: Errors.CART_NOT_FOUND.message,
        code: Errors.CART_NOT_FOUND.code,
      });
    }
    //* in case in future casses logic changed instead of recall fetchcart in the front end again get the items directly
    // const cartItems = updatedCart.items
    //   .filter((item) => !!item.product)
    //   .map((item) => ({
    //     id: item.id,
    //     quantity: item.quantity,
    //     priceAtAdd: item.priceAtAdd,
    //     product: item.product
    //       ? {
    //           id: item.product.id,
    //           title: item.product.title,
    //           price: item.product.price,
    //           imgurl: item.product.imgurl,
    //         }
    //       : null,
    //   }));

    return res.status(Messages.CART_ITEM_INCREMENTED.status).json({
      success: true,
      // cart: cartItems,
      message: Messages.CART_ITEM_INCREMENTED.message,
      code: Messages.CART_ITEM_INCREMENTED.code,
    });
  } catch (error) {
    console.error("Error incrementing cart item:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      message: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const decrementCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { productId } = req.body;
  console.log("productId from body:", productId);

  if (!userId) {
    return res.status(Errors.NOT_LOGGED_IN.status).json({
      error: Errors.NOT_LOGGED_IN.message,
      code: Errors.NOT_LOGGED_IN.code,
    });
  }
  console.log("Product ID:", productId);
  if (!productId) {
    return res.status(Errors.PRODUCT_NOT_FOUND.status).json({
      error: Errors.PRODUCT_NOT_FOUND.message,
      code: Errors.PRODUCT_NOT_FOUND.code,
    });
  }

  try {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    //no cart found is actually when user has no items in cartS
    if (!cart) {
      return res.status(Errors.CART_NOT_FOUND.status).json({
        error: Errors.CART_NOT_FOUND.message,
        code: Errors.CART_NOT_FOUND.code,
      });
    }

    // Convert productId to number
    const productIdNum = Number(productId); //it is recieved as a string ftom the http

    const cartItem = cart.items?.find(
      (item) => item.productId === productIdNum
    );

    console.log("Cart item found:", cartItem ? cartItem.toJSON() : "Not found");

    if (!cartItem) {
      return res.status(Errors.PRODUCT_NOT_FOUND.status).json({
        error: Errors.PRODUCT_NOT_FOUND.message,
        code: Errors.PRODUCT_NOT_FOUND.code,
      });
    }
    if (cartItem.quantity <= 1) {
      return res.status(Errors.MINIMUM_QUANTITY.status).json({
        success: false,
        error: Errors.MINIMUM_QUANTITY.message,
        code: Errors.MINIMUM_QUANTITY.code,
      });
    }
    cartItem.quantity -= 1;
    await cartItem.save();

    const updatedCart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [{ model: Product, as: "product" }],
        },
      ],
    });

    if (!updatedCart || !updatedCart.items) {
      return res.status(Errors.CART_NOT_FOUND.status).json({
        error: Errors.CART_NOT_FOUND.message,
        code: Errors.CART_NOT_FOUND.code,
      });
    }

    //* in case in future casses logic changed instead of recall fetchcart in the front end again get the items directly
    // const cartItems = updatedCart.items
    //   .filter((item) => !!item.product)
    //   .map((item) => ({
    //     id: item.id,
    //     quantity: item.quantity,
    //     priceAtAdd: item.priceAtAdd,
    //     product: item.product
    //       ? {
    //           id: item.product.id,
    //           title: item.product.title,
    //           price: item.product.price,
    //           imgurl: item.product.imgurl,
    //         }
    //       : null,
    //   }));

    return res.status(Messages.CART_ITEM_INCREMENTED.status).json({
      success: true,
      // cart: cartItems,
      message: Messages.CART_ITEM_INCREMENTED.message,
      code: Messages.CART_ITEM_INCREMENTED.code,
    });
  } catch (error) {
    console.error("Error incrementing cart item:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      error: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

const removeSingleCartItem = async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    return res.status(Errors.NOT_LOGGED_IN.status).json({
      message: Errors.NOT_LOGGED_IN.message,
      code: Errors.NOT_LOGGED_IN.code,
    });
  }
  const productId = req.body.productId;
  if (!productId) {
    return res.status(Errors.PRODUCT_NOT_FOUND.status).json({
      message: Errors.PRODUCT_NOT_FOUND.message,
      code: Errors.PRODUCT_NOT_FOUND.code,
    });
  }
  try {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
            },
          ],
        },
      ],
    });
    if (!cart) {
      return res.status(Errors.CART_NOT_FOUND.status).json({
        message: Errors.CART_NOT_FOUND.message,
        code: Errors.CART_NOT_FOUND.code,
      });
    }
    const productIdNum = Number(productId); //it is recieved as a string ftom the http
    const cartItem = cart.items?.find(
      (item) => item.productId === productIdNum
    );
    if (!cartItem) {
      return res.status(Errors.PRODUCT_NOT_FOUND.status).json({
        message: Errors.PRODUCT_NOT_FOUND.message,
        code: Errors.PRODUCT_NOT_FOUND.code,
      });
    }
    await cartItem.destroy();
    return res.status(Messages.CART_ITEM_REMOVED.status).json({
      success: true,
      message: Messages.CART_ITEM_REMOVED.message,
      code: Messages.CART_ITEM_REMOVED.code,
    });
  } catch (error) {
    console.error("Error removing cart item:", error);
    return res.status(Errors.INTERNAL_ERROR.status).json({
      message: Errors.INTERNAL_ERROR.message,
      code: Errors.INTERNAL_ERROR.code,
    });
  }
};

export default {
  incrementCartItem,
  addToCart,
  getCart,
  clearCart,
  decrementCartItem,
  removeSingleCartItem,
};

/**
 * OLD CODE (caused error in PostgreSQL):
  const cart = await Cart.findOne({
  where: { userId },
  include: [{ model: CartItem, as: "items" }],
  transaction: t,
  lock: t.LOCK.UPDATE, // ❌ Error: FOR UPDATE cannot be applied to the nullable side of an outer join
});

FIX:
Lock only the Cart row to avoid the LEFT OUTER JOIN issue, then delete CartItems separately in the transaction.

 */

//*-------------------------------------------------------------------------------------------

/**
     * this is an example of the return type in success case
      {
  "success": true,
  "cart": [
    {
      "id": 12,
      "quantity": 2,
      "priceAtAdd": 150,
      "product": {
        "id": 5,
        "title": "Nike Air Zoom",
        "price": 150,
        "imgurl": "https://example.com/products/nike.jpg"
      }
    },
    {
      "id": 13,
      "quantity": 1,
      "priceAtAdd": 250,
      "product": {
        "id": 8,
        "title": "Adidas Ultraboost",
        "price": 250,
        "imgurl": "https://example.com/products/adidas.jpg"
      }
    }
  ],
  "message": "Cart retrieved successfully",
  "code": "SUCCESS_GET_CART"
}

     */
//*-------------------------------------------------------------------------------------------

/**
 * and it all sent as one command
 * * Cart.findOne({ where: { userId: userid } })
 * find the cart that belongs to the user with id `userid`
 * *include: [ { model: CartItem, as: "items" } ]
 * when u get the cart, also get all the cart items that belong to that cart
 * *{ model: Product, as: "product" }
 * when u get the cart items, also get the product that belongs to that cart item
 *
 */
//*-------------------------------------------------------------------------------------------
/**
 * * The SQL query generated by Sequelize for the above code:
        SELECT 
          c.id AS cartId,
          c.userId,
          ci.id AS cartItemId,
          ci.quantity,
          p.id AS productId,
          p.title,
          p.price,
          p.imgurl
        FROM Carts c
        LEFT JOIN CartItems ci ON ci.cartId = c.id
        LEFT JOIN Products p ON ci.productId = p.id
        WHERE c.userId = ?;

 */

//*-------------------------------------------------------------------------------------------
/**
 * ! Why not use `(req as any).user`?
 * - `any` disables TypeScript's type checking → no autocomplete, no error checking.
 * - Bugs like typos (`req.usr`) won’t be caught at compile time.
 * - The shape of `req.user` (id, role, etc.) becomes unclear for other devs.

 * Safer way:
 * - Extend Express.Request in `types/express.d.ts` to include `.user`.
 * - This way, every request has a typed `user` field (id, role, isLoggedIn).
 * - Keeps TypeScript protections + cleaner, maintainable code.
 */

//*-------------------------------------------------------------------------------------------
/**
 * getCart Controller
 * -----------------
 * Issue:
 * ! Previously, the cart items and associated products were accessed using 'any' types:
 *
 *   const cartItems = (cart as any).items.map((item: any) => ({
 *     id: item.id,
 *     quantity: item.quantity,
 *     priceAtAdd: item.priceAtAdd,
 *     product: {
 *       id: item.product.id,
 *       title: item.product.title,
 *       price: item.product.price,
 *       imgurl: item.product.imgurl,
 *     },
 *   }));
 *
 * This bypassed TypeScript's type checking and could cause runtime errors if
 * a CartItem didn't have an associated Product.
 *
 * Handling:
 * 1. Strongly typed the CartItem model to include optional `product` and `cart` associations.
 * 2. Used a type guard to safely filter CartItems with associated Products.
 * 3. Removed all `any` casts and used proper typing:
 *
 *   const cartItems = cart.items
 *     .filter((item): item is CartItem & { product: Product } => !!item.product)
 *     * this is the type guard and used to check if the product exist
 *     .map((item) => ({
 *       id: item.id,
 *       quantity: item.quantity,
 *       priceAtAdd: item.priceAtAdd,
 *       product: {
 *         id: item.product.id,
 *         title: item.product.title,
 *         price: item.product.price,
 *         imgurl: item.product.imgurl,
 *       },
 *     }));
 *
 * Result:
 * Now the function is fully type-safe, avoids runtime crashes, and correctly returns
 * cart items with their product data.
 */
