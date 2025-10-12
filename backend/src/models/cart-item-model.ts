// models/cartItemModel.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../sequelize/sequelize";
import Cart from "./cartmodel";
import Product from "./productModel";

//data fields in the database table
interface CartItemAttributes {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  priceAtAdd: number;
}

//that means all fields are required except id which will be auto generated
//so if u forgot any field u get a type script error
interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, "id"> {}

// CartItemAttributes → what a full row looks like when fetched from the DB.
// CartItemCreationAttributes → what’s required when creating a new row.
// .findOne(), .findAll() return objects shaped like CartItemAttributes (full row).
// .create() accepts an object shaped like CartItemCreationAttributes (id optional).
class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: number;
  public cartId!: number;
  public productId!: number;
  public quantity!: number;
  public priceAtAdd!: number;

  // ✅ association fields
  public readonly cart?: Cart;
  public readonly product?: Product;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CartItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    cartId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    priceAtAdd: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    sequelize,
    modelName: "CartItem",
    tableName: "cart_items",
    timestamps: true,
    underscored: true,
  }
);

// Associations
Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default CartItem;

// models/cartItemModel.ts
// import { Model, DataTypes, Optional } from "sequelize";
// import sequelize from "../sequelize/sequelize";
// import Cart from "./cartmodel";
// import Product from "./productModel";

// class CartItem extends Model {
//   public id!: number;
//   public cartId!: number;
//   public productId!: number;
//   public quantity!: number;
//   public priceAtAdd!: number;
// }

// CartItem.init(
//   {
//     id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//     cartId: { type: DataTypes.INTEGER, allowNull: false },
//     productId: { type: DataTypes.INTEGER, allowNull: false },
//     quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
//     priceAtAdd: { type: DataTypes.FLOAT, allowNull: false },
//   },
//   {
//     sequelize,
//     modelName: "CartItem",
//     tableName: "cart_items",
//     timestamps: true,
//     underscored: true,
//   }
// );

// Associations
//This tells Sequelize which column in the child table (CartItem) links back to the parent (Cart).
//means cartId in cartItem table refers to id in cart table
// Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
// CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

// Product.hasMany(CartItem, { foreignKey: "productId", as: "cartItems" });
// CartItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// export default CartItem;

/**
 * ! as items or as -----------
 * / Query cart with its items
    const cart = await Cart.findByPk(1, {
    include: [{ model: CartItem, as: "items" }],
    });
    // Now cart.items will exist
    console.log(cart.items);
 */
