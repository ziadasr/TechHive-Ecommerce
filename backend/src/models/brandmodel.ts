import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize/sequelize";
import Product from "./productModel";

class Brand extends Model {
  public id!: number;
  public name!: string;
}

Brand.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Brand",
    tableName: "brands",
    timestamps: false,
    underscored: true,
  }
);

export default Brand;
