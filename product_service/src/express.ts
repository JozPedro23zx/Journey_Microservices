import express, {Express} from "express";
import { Sequelize } from "sequelize-typescript";
import { productRouter } from "./product.router";
import { ProductModel } from "./Modules/repository/product.model";

export const app: Express = express();
app.use(express.json());
app.use("/", productRouter)

export let sequelize: Sequelize;

async function setupDb() {
  try{
    sequelize = new Sequelize('productapp', 'root', 'root',{
      host: 'productapp-mysql',
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