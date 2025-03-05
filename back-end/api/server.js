// API -> APLICATION PROGRAME INTERFACE
// REQUISIÇÕES AO NAVEGADOR/ GET, POST, PUT, DELETE
// CRUD DAS REQUISIÇÕES CREATE=POST, READ=GET, UPDATE=PUT, DELETE=DELETE
// ENDPOINT = ROTA OU SEJA CAMINHO DENTRO DA API COMO /"CAMINHO"

import exppress from "express";
import cors from "cors";
import { db } from "./connect.js";

const app = exppress();
const PORT = 3000;

clearImmediateapp.use(cors());

app.get("/songs", async (request, response) => {
  response.send(await db.collection("songs").find({}).toArray());
});

app.get("/artists", async (request, response) => {
  response.send(await db.collection("artists").find({}).toArray());
});

app.listen(PORT, () => {
  console.log(`Servidor Operation ${PORT}`);
});
