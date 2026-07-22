import React from "react";
import Player from "../components/Player";
import { Link, useParams, useLocation } from "react-router-dom";
import { songsArray } from "../assets/database/songs";
import { artistArray } from "../assets/database/artists";

const Song = () => {
  const { id } = useParams();
  const location = useLocation();
  const fromGlobalList = location.state?.fromGlobalList || false;

  const songObj = songsArray.find((currentSongObj) =>
    String(currentSongObj._id || currentSongObj.id) === String(id)
  );

  if (!songObj) {
    return <div className="song">Música não encontrada</div>;
  }

  const { image, name, duration, artist, audio } = songsArray.filter(
    (currentSongObj) => currentSongObj._id === id
  )[0];
  // console.log(songObj);

  const artistObj = artistArray.filter(
    (currentArtistObj) => currentArtistObj.name === artist
  )[0];
  // console.log(artistObj);

  if (!artistObj) {
    return <div className="song">Artista não encontrado</div>;
  }

  const songsArrayFromArtist = songsArray.filter(
    (currentSongObj) => currentSongObj.artist === artist
  );
  // console.log(songsArrayFromArtist);

 const randomIndex = songsArrayFromArtist.length > 0
    ? Math.floor(Math.random() * songsArrayFromArtist.length)
    : -1;
  const randomIndex2 = songsArrayFromArtist.length > 0
    ? Math.floor(Math.random() * songsArrayFromArtist.length)
    : -1;

  const randomIdFromArtist = randomIndex >= 0
    ? songsArrayFromArtist[randomIndex]._id || songsArrayFromArtist[randomIndex].id
    : null;
  const randomId2FromArtist = randomIndex2 >= 0
    ? songsArrayFromArtist[randomIndex2]._id || songsArrayFromArtist[randomIndex2].id
    : null;

  // Exemplo de configuração de anúncios por artista.
  // Cada artista recebe conteúdo próprio, logo de patrocinador e link.
  const artistAds = {
    "Henrique & Juliano": {
      title: "Novo lançamento Spotify",
      description: "Ouça o álbum oficial de Henrique & Juliano no Spotify.",
      link: "https://open.spotify.com/artist/0CSfXx7VMbgLuVT1A6W3yd",
      logo: "https://i.scdn.co/image/ab6761610000e5ebbf7a0f5a0de931c07ea73d41",
    },
    "Jorge & Mateus": {
      title: "Top hits em destaque",
      description: "Acesse agora a playlist mais tocada de Jorge & Mateus.",
      link: "https://open.spotify.com/artist/3olmZMn4wCbQ0a8udZ0A63",
      logo: "https://i.scdn.co/image/ab6761610000e5ebca8d2b35b84c30dc74f3bf76",
    },
    "MC Tuto": {
      title: "A nova faixa viral",
      description: "Descubra o último single de MC Tuto agora mesmo.",
      link: "https://open.spotify.com/artist/5vEwFuxB64rjT9EhGyUCpO",
      logo: "https://i.scdn.co/image/ab6761610000e5eb43ed3412287ffb91e4b6c246",
    },
    "Gusttavo Lima": {
      title: "Playlist sertaneja",
      description: "Ouça os maiores sucessos do Gusttavo Lima.",
      link: "https://open.spotify.com/artist/7rZLfwkYF0KiW0fM3p2QZa",
      logo: "https://i.scdn.co/image/ab6761610000e5eb365f98ce723d6042f77932cd",
    },
    "Luan Santana": {
      title: "Música nova aguardando",
      description: "Confira o mais recente lançamento de Luan Santana.",
      link: "https://open.spotify.com/artist/3aQtFhSXdMSnqEkx8HD839",
      logo: "https://i.scdn.co/image/ab6761610000e5ebf0f8adad16627d9d1e9b4739",
    },
  };

  const defaultAd = {
    title: "Promoção do app musical",
    description: "Veja o conteúdo patrocinado antes da próxima faixa.",
    link: "https://open.spotify.com",
    logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
  };

  const selectedAd = artistAds[artist] || defaultAd;

  return (
    <div className="song">
      <div className="song__container">
        <div className="song__image-container">
          <img src={image} alt={`Imagem da música ${name}`} />
        </div>
      </div>

      <div className="song__bar">
        <Link to={`/artist/${artistObj._id || artistObj.id}`} className="song__artist-image">
          <img
            width={75}
            height={75}
            src={artistObj.image}
            alt={`Imagem do Artista ${artist}`}
          />
        </Link>

        <Player
          duration={duration}
          randomIdFromArtist={randomIdFromArtist}
          randomId2FromArtist={randomId2FromArtist}
          audio={audio}
          playlist={fromGlobalList ? songsArray : songsArrayFromArtist}
          currentId={id}
        />

        <div>
          <p className="song__name">{name}</p>
          <p>{artist}</p>
        </div>
      </div>
    </div>
  );
};

export default Song;

