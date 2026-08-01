// JavaScript Assincrono
// await async
// Fullfilled
import { MongoClient } from "mongodb";

const URI =
  "mongodb+srv://tpowerinformatica2016_db_user:86BvnQ4a8wR6dUW2@cluster0.4urkt5t.mongodb.net/?appName=Cluster0";

const client = new MongoClient(URI);

export const db = client.db("rifllymusical");
// const songCollection = await db.collection("songs").find({}).toArray();

// console.log(songCollection);
