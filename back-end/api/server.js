// API -> APLICATION PROGRAME INTERFACE
// REQUISIÇÕES AO NAVEGADOR/ GET, POST, PUT, DELETE
// CRUD DAS REQUISIÇÕES CREATE=POST, READ=GET, UPDATE=PUT, DELETE=DELETE
// ENDPOINT = ROTA OU SEJA CAMINHO DENTRO DA API COMO /"CAMINHO"

import exppress, { request, response } from "express";
import cors from "cors";
import { db } from "./connect.js";
import path from "path";

const __dirname = path.resolve();

const app = exppress();
const PORT = 3000;

app.use(cors());

app.get("/api/", (request, response) => {
  response.send("endpoints `/artists´ e `/ongs´");
});

app.get("/api/songs", async (request, response) => {
  response.send(await db.collection("songs").find({}).toArray());
});

app.get("/api/artists", async (request, response) => {
  response.send(await db.collection("artists").find({}).toArray());
});

app.use(exppress.static(path.join(__dirname, "../front-end/dist")));

app.get("*", async (request, response) => {
  response.sendFile(path.join(__dirname, "../front-end/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor Operation ${PORT}`);
});
