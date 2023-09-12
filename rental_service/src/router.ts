import express, {Request, Response} from "express"
import dotenv from "dotenv"
import session from "express-session";
import jwt from "jsonwebtoken";
import RentalFactoryFacade from "./Modules/factory/rental.factory.facade";

export const checkoutRouter = express.Router()

const memoryStore = new session.MemoryStore()
dotenv.config()

checkoutRouter.use(session({
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

checkoutRouter.post("/create", async (req: Request, res: Response) =>{
    const rentalFacade = RentalFactoryFacade.create()

    try{
        const input = {
            clientId: req.body.clientId,
            productId: req.body.productId,
            itemQtd: req.body.itemQtd,
            itemTotal: req.body.itemTotal,
            downpayment: req.body.downpayment,
            deliveryFee: req.body.deliveryFee,
            lateFee: req.body.lateFee,
            discount: req.body.discount,
            orderDate: new Date(),
            paymentType: req.body.paymentType,
            amount: req.body.amount,
            description: req.body.descripition,
            paymentDate: new Date()
        }

        console.log(input)

        const response = await rentalFacade.addOrder(input)
        res.status(200).send(response)
    }catch(err){
        res.status(500).send(err)
    }
})

checkoutRouter.get("/home", middlewareIsAuth, (req, res) =>{
    res.send("order App")
})

checkoutRouter.get('/login', (req, res) => {
  const loginParams = new URLSearchParams({
    client_id: "rental",
    redirect_uri: `http://${process.env.RENTAL_HOST}:${process.env.RENTAL_PORT}/callback`,
    response_type: 'code',
    scope: 'openid'
  })

  const url = `http://${process.env.KEYCLOAK_REDIRECT}:${process.env.KEYCLOAK_PORT}/realms/journey_realm/protocol/openid-connect/auth?${loginParams.toString()}`
  res.redirect(url)
});

checkoutRouter.get("/logout", (req, res) => {
    const logoutParams = new URLSearchParams({
      //client_id: "fullcycle-client",
      //@ts-expect-error
      id_token_hint: req.session.id_token,
      post_logout_redirect_uri: `http://${process.env.RENTAL_HOST}:${process.env.RENTAL_PORT}/login`,
    });
  
    req.session.destroy((err) => {
      console.error(err);
    });
  
    const url = `http://${process.env.KEYCLOAK_REDIRECT}:${process.env.KEYCLOAK_PORT}/realms/journey_realm/protocol/openid-connect/logout?${logoutParams.toString()}`;
    res.redirect(url);
  });

checkoutRouter.get("/callback", async (req, res) => {
  //@ts-expect-error - type mismatch  
  if (req.session.user) {
    return res.redirect("/home");
  }

  console.log(req.query);

  const bodyParams = new URLSearchParams({
    client_id: "rental",
    grant_type: "authorization_code",
    code: req.query.code as string,
    redirect_uri: `http://${process.env.RENTAL_HOST}:${process.env.RENTAL_PORT}/callback`,
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