// addressModel.ts
import { DataTypes, Model, BelongsToGetAssociationMixin } from "sequelize";
import sequelize from "../sequelize/sequelize";
import User from "./userModel";

class Address extends Model {
  public id!: number;
  public userId!: number;
  public street!: string;
  public city!: string;
  public state!: string | null;
  public postalCode!: string | null;
  public country!: string;
  public isDefault!: boolean;
  public building!: string;
  public floor!: string;
  public apartment!: string;

  // Association helpers
  public getUser!: BelongsToGetAssociationMixin<User>;
  public readonly user?: User;
}

Address.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
    },
    building: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    floor: { type: DataTypes.STRING, allowNull: false },
    apartment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
    },
    postalCode: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Egypt",
    },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "Address",
    tableName: "Addresses", // explicit for consistency
    timestamps: true,
    underscored: true,
  }
);

// Relations
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

export default Address;
