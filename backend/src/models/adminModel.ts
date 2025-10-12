import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize/sequelize";

class Admin extends Model {
  public id!: number;
  public name!: string;
  public dateOfBirth!: Date;
  public title!: string;
  public email!: string;
  public password!: string;
  public lastLogin!: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Admin",
    tableName: "Admins",
    timestamps: true,
    underscored: true,
  }
);

export default Admin;
