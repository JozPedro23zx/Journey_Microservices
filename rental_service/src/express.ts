import express, {Express} from "express";
import dotenv from "dotenv"
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./Modules/repository/models/client.model";
import { ProductModel } from "./Modules/repository/models/product.model";
import OrderModel from "./Modules/repository/models/order.model";
import OrderItemsModel from "./Modules/repository/models/order-item.model";
import { checkoutRouter } from "./router";
import PaymentModel from "./Modules/repository/models/payment.model";
import { ConsumerExec } from "./kafka.consumer";

export const app: Express = express();
dotenv.config()

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/", checkoutRouter)

export let sequelize: Sequelize;

async function setupDb() {
  try{
    sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD,{
      host: process.env.DB_HOST,
      dialect: "mysql",
    });
    sequelize.addModels([ClientModel, ProductModel, OrderModel, OrderItemsModel, PaymentModel]);
    await sequelize.sync();
  }
  catch(error){
    console.error('Erro to connect database:', error);
  }
};

ConsumerExec().catch(console.error);
setupDb();