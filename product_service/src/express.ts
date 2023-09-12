import express, {Express} from "express";
import dotenv from "dotenv"
import { Sequelize } from "sequelize-typescript";
import { productRouter } from "./product.router";
import { ProductModel } from "./Modules/repository/product.model";

export const app: Express = express();
dotenv.config()
app.use(express.json());
app.use("/", productRouter)

export let sequelize: Sequelize;

async function setupDb() {
  try{
    sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
      host: process.env.DB_HOST,
      dialect: "mysql",
    });
    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  }
  catch(error){
    console.error('Erro to connect database:', error);
  }
};

setupDb();