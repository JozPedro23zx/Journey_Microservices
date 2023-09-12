import { app } from "./express"

const PORT = process.env.APP_PORT;

app.listen(PORT, ()=>{
    console.log("Server is listening on PORT: ", PORT)
})