import express, {Request, Response} from "express"
import session from "express-session";
import jwt from "jsonwebtoken";
import PlaceOrderUseCase from "./Modules/usecase/place-order/place-order.usecase"
import OrderRepository from "./Modules/repository/repositories/order.repository"
import ProductRepository from "./Modules/repository/repositories/product.repository"
import ClientRepository from "./Modules/repository/repositories/client.repository"

export const checkoutRouter = express.Router()

const memoryStore = new session.MemoryStore()

checkoutRouter.use(session({
  secret: 'your-secret-key',
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
    const orderRepository = new OrderRepository()
    const productRepository = new ProductRepository()
    const clientRepository = new ClientRepository()

    const checkoutUsecase = new PlaceOrderUseCase(clientRepository, productRepository, orderRepository)

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

        const response = await checkoutUsecase.execute(input)
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
    redirect_uri: "http://localhost:8000/callback",
    response_type: 'code',
    scope: 'openid'
  })

  const url = `http://localhost:8080/realms/journey_realm/protocol/openid-connect/auth?${loginParams.toString()}`
  res.redirect(url)
});

checkoutRouter.get("/logout", (req, res) => {
    const logoutParams = new URLSearchParams({
      //client_id: "fullcycle-client",
      //@ts-expect-error
      id_token_hint: req.session.id_token,
      post_logout_redirect_uri: "http://localhost:8000/login",
    });
  
    req.session.destroy((err) => {
      console.error(err);
    });
  
    const url = `http://localhost:8080/realms/journey_realm/protocol/openid-connect/logout?${logoutParams.toString()}`;
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
    redirect_uri: "http://localhost:8000/callback",
  });

  const url = `http://keycloak:8080/realms/journey_realm/protocol/openid-connect/token`;

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

// "clientId": "client1223432",
// "productId": "productId453232",
// "itemQtd": 50,
// "itemTotal": 60,
// "downpayment": 10,
// "deliveryFee": 11,
// "lateFee": 6,
// "discount": 2,
// "paymentType": "cartão",
// "amount": 20,
// "description": "descricao",