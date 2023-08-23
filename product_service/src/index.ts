import { app } from "./express"

const PORT = 3000;


app.listen(PORT, ()=>{
    console.log("Server is listening on PORT: ", PORT)
})





// import express from 'express';

// const app = express();
// const PORT = 3000;

// app.get('/', (req, res) => {
//   res.send('Olá, mundo!');
// });

// app.listen(PORT, () => {
//   console.log(`Servidor rodando na porta ${PORT}`);
// });
