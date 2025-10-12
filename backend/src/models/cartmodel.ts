// models/cartmodel.ts
import { Model, DataTypes, HasManyGetAssociationsMixin } from "sequelize";
import sequelize from "../sequelize/sequelize";
import CartItem from "./cart-item-model";

class Cart extends Model {
  public id!: number;
  public userId!: number;

  //since type script only recognizes properties that are explicitly defined in the model
  // so TS knows cart.items exists
  public items?: CartItem[];

  // Sequelize mixins for association (optional but handy)
  //That tells TypeScript about Sequelize’s helper methods (cart.getItems(), cart.addItem(), etc.), so you get type safety there too.
  // not required but it gives you autocomplete and prevents bugs.
  public getItems!: HasManyGetAssociationsMixin<CartItem>;
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Cart",
    tableName: "carts",
    timestamps: true,
    underscored: true,
  }
);

export default Cart;
