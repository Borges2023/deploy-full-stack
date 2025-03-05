// Fetch ou Axios = pega todas as requisições e manda para o artist
import axios from "axios";

const URL = "http://localhost:3000";

// Abaixo o código requisita para pegar a informação no back-end
const responseArtists = await axios.get(`${URL}/artists`);
const responseSongs = await axios.get(`${URL}/songs`);

//Abaixo exporta para o atist que faz a importação
export const artistArray = responseArtists.data;
export const songsArray = responseSongs.data;

//console.log(responseArtists.data);
