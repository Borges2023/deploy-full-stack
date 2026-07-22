import React from "react";
import { Link, useLocation } from "react-router-dom";

const SongItem = ({ image, name, duration, artist, audio, _id, index }) => {
  const location = useLocation();
  const isGlobalList = location.pathname === "/songs";

  return (
    <Link
      to={`/song/${_id}`}
      state={{ fromGlobalList: isGlobalList }}
      className="song-item"
    >
      <div className="song-item__number-album">
        <p>{index + 1}</p>

        <div className="song-item__album">
          <img
            src={image}
            alt={`Imagem da Música ${name}`}
            className="song-item__image"
          />

          <p className="song-item__name">{name}</p>
        </div>
      </div>

      <p>{duration}</p>
    </Link>
  );
};

export default SongItem;
