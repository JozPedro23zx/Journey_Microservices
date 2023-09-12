import express, {Request, Response} from "express"
import session from "express-session";
import jwt from "jsonwebtoken";
import ClientAdmFacadeFactory from "./Modules/factory/facade.factory";
import Address from "./Modules/domain/value-object/address.value-object";
import Client from "./Modules/domain/client.entity";
import Id from "./@shared/domain/value-object/id.value-object";

export const clientRouter = express.Router();
const memoryStore = new session.MemoryStore()

clientRouter.use(session({
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

clientRouter.post("/create", async (req: Request, res: Response) =>{
    const clientFacade = ClientAdmFacadeFactory.create();
    try{
        const address = new Address({
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
        });

        const client = new Client({
            id: new Id(),
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: address
        });

        const input = {
            id: client.id.id,
            name: client.name,
            email: client.email,
            document: client.document,
            street: client.address.street,
            number: client.address.number,
            complement: client.address.complement,
            city: client.address.city,
            state: client.address.state,
            zipCode: client.address.zipCode
        }

        const output = await clientFacade.add(input)

        res.status(200).send(output)
    }catch(err){
        res.status(500).send(err)
    }
})

clientRouter.get("/home", middlewareIsAuth, (req, res) =>{
    res.send("Customer App")
})

clientRouter.get('/login', (req, res) => {
  const loginParams = new URLSearchParams({
    client_id: "customer",
    redirect_uri: `http://${process.env.CUSTOMER_HOST}:${process.env.CUSTOMER_PORT}/callback`,
    response_type: 'code',
    scope: 'openid'
  })

  const url = `http://${process.env.KEYCLOAK_REDIRECT}:${process.env.KEYCLOAK_PORT}/realms/journey_realm/protocol/openid-connect/auth?${loginParams.toString()}`
  res.redirect(url)
});

clientRouter.get("/logout", (req, res) => {
    const logoutParams = new URLSearchParams({
      //client_id: "fullcycle-client",
      //@ts-expect-error
      id_token_hint: req.session.id_token,
      post_logout_redirect_uri: `http://${process.env.CUSTOMER_HOST}:${process.env.CUSTOMER_PORT}/login`,
    });
  
    req.session.destroy((err) => {
      console.error(err);
    });
  
    const url = `http://${process.env.KEYCLOAK_REDIRECT}:${process.env.KEYCLOAK_PORT}/realms/journey_realm/protocol/openid-connect/logout?${logoutParams.toString()}`;
    res.redirect(url);
  });

clientRouter.get("/callback", async (req, res) => {
  //@ts-expect-error - type mismatch  
  if (req.session.user) {
    return res.redirect("/home");
  }

  console.log(req.query);

  const bodyParams = new URLSearchParams({
    client_id: "customer",
    grant_type: "authorization_code",
    code: req.query.code as string,
    redirect_uri: `http://${process.env.CUSTOMER_HOST}:${process.env.CUSTOMER_PORT}/callback`,
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