// JavaScript Assincrono
// await async
// Fullfilled
import { MongoClient } from "mongodb";

//const URI =
  //"mongodb+srv://usuario_aqui:aqui@cluster0.4urkt5t.mongodb.net/?appName=Cluster0";
const URI = process.env.MONGODB_URI;

const client = new MongoClient(URI);

export const db = client.db("rifllymusical");
// const songCollection = await db.collection("songs").find({}).toArray();

// console.log(songCollection);
