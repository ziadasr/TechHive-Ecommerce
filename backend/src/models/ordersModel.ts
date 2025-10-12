// models/orderModel.ts
import { Model, DataTypes, HasManyGetAssociationsMixin } from "sequelize";
import sequelize from "../sequelize/sequelize";
import User from "./userModel";
import Address from "./user-adress-model";
import OrderItem from "./order-items-model";

class Order extends Model {
  public id!: number;
  public userId!: number;
  public addressId!: number;
  public status!: string;
  public totalAmount!: number;
  paymentmethod!: string;

  // Associations
  public getItems!: HasManyGetAssociationsMixin<OrderItem>;
  public readonly items?: OrderItem[];
  public readonly user?: User;
  public readonly address?: Address;
}
/**
 * getItems is an instance method created by Sequelize for one-to-many relationships.
 * It allows you to fetch related records programmatically without writing raw queries.
 */

/**
     const order = await Order.findByPk(1);
    if (order) {
      const items = await order.getItems(); // fetches all OrderItems for this order
      console.log(items);
    }
  ** this is equevilant to
  const items = await OrderItem.findAll({ where: { orderId: order.id } });
 
*/

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    addressId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "pending" },
    totalAmount: { type: DataTypes.FLOAT, allowNull: false },
    paymentmethod: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
    underscored: true,
  }
);

// Associations
User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

Address.hasMany(Order, { foreignKey: "addressId", as: "orders" });
Order.belongsTo(Address, { foreignKey: "addressId", as: "address" });

export default Order;
