import express, {Request, Response} from "express"
import dotenv from "dotenv"
import session from "express-session";
import jwt from "jsonwebtoken";
import ProductAdmFacadeFactory from "./Modules/factory/facade.factory";
import Product from "./Modules/domain/product.entity";
import Id from "./@shared/domain/value-object/id.value-object";


export const productRouter = express.Router();

const memoryStore = new session.MemoryStore()
dotenv.config()


productRouter.use(session({
  secret: `${process.env.SESSION_SECRET}`,
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}));

const middlewareIsAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  //@ts-expect-error - type mismatch
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

productRouter.post("/create", async (req: Request, res: Response) =>{
    console.log(req.body.name)
    const productFacade = ProductAdmFacadeFactory.create()
    try{
        const product = new Product({
            id: new Id(),
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            qtdAvailable: req.body.qtdAvailable,
            qtdTotal: req.body.qtdTotal
        });

        const productInput = {
            id: product.id.id,
            name: product.name,
            description: product.description,
            price: product.price,
            qtdAvailable: product.qtdAvailable,
            qtdTotal: product.qtdTotal
        };

        const result = await productFacade.addProduct(productInput)
        res.status(200).send(result)

    }catch(err){
        res.status(500).send(err)
    }
})

productRouter.get("/home", middlewareIsAuth, (req, res) =>{
    res.send("Product App")
})

productRouter.get('/login', (req, res) => {
  const loginParams = new URLSearchParams({
    client_id: "product",
    redirect_uri: `http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/callback`,
    response_type: 'code',
    scope: 'openid'
  })

  const url = `http://${process.env.KEYCLOAK_REDIRECT}:${process.env.KEYCLOAK_PORT}/realms/journey_realm/protocol/openid-connect/auth?${loginParams.toString()}`
  res.redirect(url)
});

productRouter.get("/logout", (req, res) => {
    const logoutParams = new URLSearchParams({
      //client_id: "fullcycle-client",
      //@ts-expect-error
      id_token_hint: req.session.id_token,
      post_logout_redirect_uri: `http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/login`,
    });
  
    req.session.destroy((err) => {
      console.error(err);
    });
  
    const url = `http://${process.env.KEYCLOAK_REDIRECT}:${process.env.KEYCLOAK_PORT}/realms/journey_realm/protocol/openid-connect/logout?${logoutParams.toString()}`;
    res.redirect(url);
  });

productRouter.get("/callback", async (req, res) => {
  //@ts-expect-error - type mismatch  
  if (req.session.user) {
    return res.redirect("/product/home");
  }

  console.log(req.query);

  const bodyParams = new URLSearchParams({
    client_id: "product",
    grant_type: "authorization_code",
    code: req.query.code as string,
    redirect_uri: `http://${process.env.PRODUCT_HOST}:${process.env.PRODUCT_PORT}/callback`,
  });

  const url = `http://${process.env.KEYCLOAK_HOST}:${process.env.KEYCLOAK_PORT}/realms/journey_realm/protocol/openid-connect/token`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: bodyParams.toString(),
  });

  const result = await response.json();

  console.log(result)

  const payloadAccessToken = jwt.decode(result.access_token) as any;

  console.log(payloadAccessToken);
  //@ts-expect-error - type mismatch
  req.session.user = payloadAccessToken;
  //@ts-expect-error - type mismatch
  req.session.access_token = result.access_token;
  //@ts-expect-error - type mismatch
  req.session.id_token = result.id_token;
  req.session.save();

  res.json(result)
})