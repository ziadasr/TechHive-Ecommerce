import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize/sequelize";
import Brand from "./brandmodel";

class Product extends Model {
  public id!: number;
  public title!: string;
  public imgurl!: string;
  public price!: number;
  public company!: string;
  public info!: string;
  // public incart!: boolean;
  public count!: number;
  // public sold!: number;
  public total!: number;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // sold: {
    //   type: DataTypes.INTEGER,
    //   defaultValue: 0,
    // },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imgurl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    info: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // incart: {
    //   type: DataTypes.BOOLEAN,
    //   defaultValue: false,
    // },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    total: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
    underscored: true,
  }
);

Brand.hasMany(Product, { foreignKey: "brandId", as: "products" });
Product.belongsTo(Brand, { foreignKey: "brandId", as: "brand" });
export default Product;
