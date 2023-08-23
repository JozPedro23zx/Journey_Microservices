import express, {Express} from "express";
import session from "express-session";
import Keycloak from "keycloak-connect"
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./Modules/repository/models/client.model";
import { ProductModel } from "./Modules/repository/models/product.model";
import OrderModel from "./Modules/repository/models/order.model";
import OrderItemsModel from "./Modules/repository/models/order-item.model";
import { clientRouter } from "./client.router";
import { ConsumerExec } from "./kafka.consumer";
const memoryStore = new session.MemoryStore()

export const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/client", clientRouter)

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const kcConfig = {
  "realm": "Microservice_Journey_Realm",
  "auth-server-url": "http://localhost:8080/auth/",
  "ssl-required": "external",
  "resource": "customer",
  "verify-token-audience": true,
  "credentials": {
    "secret": "jLePnvSiucxTYuaxTFCQAzVWzbRvpkGY"
  },
  "confidential-port": 0,
  "realm-public-key": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAkEUcltPi3/7nIzem9AeGNt6lq1UBAQHoP0GTlRnHcSgu3QSRK7wtXZ+kC3AigdDsMbOfzo4r7zOrKfvqfknsjZh8lUf4LdWegSvk5JT5reISG/B4Su8X12p8SAyUfoHM5P9OJd0okw/XLONxA122YwqTxmKyDafRQSA/THzBD3pC4apirDChOhhbbxtBPgMFkotG65+7QEd4iGWPndHpKLaxdfc9jNQLTfBYapmPesbRa1kbN/NtoMjGOrM8PgnIXwmEVRUdmDLEmpX7SIHAvwj63TOAUil8Rn1fhB7vQzJ1PKD3MPDUebzUdnTJWGMEYdci+Z9kOl1fF22e6sKgfwIDAQAB",
  "policy-enforcer": {}
}

const keycloak = new Keycloak({store: memoryStore}, kcConfig);


app.use(keycloak.middleware());

export let sequelize: Sequelize;

async function setupDb() {
  try{
    sequelize = new Sequelize('customerapp', 'root', 'root',{
      host: 'customerapp-mysql',
      dialect: "mysql",
    });
    sequelize.addModels([ClientModel, ProductModel, OrderModel, OrderItemsModel]);
    await sequelize.sync();
  }
  catch(error){
    console.error('Erro to connect database:', error);
  }
};


app.get('/', keycloak.protect('user'), (req, res) => {
  res.send('customer');
});

ConsumerExec().catch(console.error);
setupDb();

