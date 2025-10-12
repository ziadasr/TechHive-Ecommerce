import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize( //sequelize parameters
  process.env.database as string,
  process.env.DB_USERNAME as string,
  process.env.password as string,
  {
    host: process.env.host as string,
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
