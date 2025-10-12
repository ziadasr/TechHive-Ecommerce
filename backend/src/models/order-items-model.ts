// models/orderItemModel.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "../sequelize/sequelize";
import Order from "./ordersModel";
import Product from "./productModel";

class OrderItem extends Model {
  public id!: number;
  public orderId!: number;
  public productId!: number;
  public quantity!: number;
  public priceAtOrder!: number;

  /**
   * These don’t exist as database columns — they are Sequelize association helpers.
   * They allow you to access related models in code:
   */

  // Associations
  public readonly order?: Order;
  public readonly product?: Product;
}

OrderItem.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER, allowNull: false },
    productId: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    priceAtOrder: { type: DataTypes.FLOAT, allowNull: false },
  },
  {
    sequelize,
    modelName: "OrderItem",
    tableName: "order_items",
    timestamps: true,
    underscored: true,
  }
);

// Associations
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId", as: "order" });

Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

export default OrderItem;
