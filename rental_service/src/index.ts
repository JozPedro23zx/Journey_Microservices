import { app } from "./express"

const PORT = 3000;

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', "*")
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
    res.header('Access-Control-Allow-Credentials', "true")
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    next()
});

app.listen(PORT, ()=>{
    console.log("Server is listening on PORT: ", PORT)
})

