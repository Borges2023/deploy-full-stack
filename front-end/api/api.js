// Fetch ou Axios = pega todas as requisições e manda para o artist
import "dotenv/config";
import axios from "axios";

//const { NODE_ENV } = process.env;
//const URL = "http://localhost:3000/api";
const URL = "https://deploy-full-stack-l3y8.onrender.com/api/api";

// Abaixo o código requisita para pegar a informação no back-end
const responseArtists = await axios.get(`${URL}/artists`);
const responseSongs = await axios.get(`${URL}/songs`);

//Abaixo exporta para o atist que faz a importação
export const artistArray = responseArtists.data;
export const songsArray = responseSongs.data;

//console.log(responseArtists.data);
