// JavaScript Assincrono
// await async
// Fullfilled
import { MongoClient } from "mongodb";

const URI =
  "mongodb+srv://willianb2012:Vidaloka2019@cluster0.fnq5v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(URI);

export const db = client.db("riffly");
// Conexão abaixo serve para pegar as informaçções do banco de dados
// const songCollection = await db.collection("songs").find({}).toArray();

// console.log(songCollection);
