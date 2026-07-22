import React, { useState, useRef, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlay,
  faCirclePause,
  faBackwardStep,
  faForwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { songsArray } from "../assets/database/songs";
import { artistArray } from "../assets/database/artists";
import { adsArray } from "../assets/database/ads";
import Ad from "./Ad";

const formatTime = (timeInSeconds) => {
  const minutes = Math.floor(timeInSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(timeInSeconds - minutes * 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${seconds}`;
};

const timeInSeconds = (timeString) => {
  const splitArray = timeString.split(":");
  const minutes = Number(splitArray[0]);
  const seconds = Number(splitArray[1]);

  return seconds + minutes * 60;
};
// Duração de cada música é armazenada como string no formato "mm:ss" no banco de dados.
const Player = ({
  duration,
  playlist = [],
  currentId,
  audio,
}) => {
  const audioPlayer = useRef(null);
  const progressBar = useRef(null);
  const volumeBar = useRef(null);
  const previousIdRef = useRef(null);
  const shouldResumeAfterAdRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(formatTime(0));
  const [volume, setVolume] = useState(0.7);
  const [lastVolume, setLastVolume] = useState(0.7);
  const [durationInSeconds, setDurationInSeconds] = useState(
    timeInSeconds(duration)
  );
  const [isSeeking, setIsSeeking] = useState(false);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);
  const [showAd, setShowAd] = useState(false);
  const [songChangeCount, setSongChangeCount] = useState(0);
  const currentIndex = useMemo(
    () =>
      playlist.findIndex(
        (item) => String(item._id || item.id) === String(currentId)
      ),
    [playlist, currentId]
  );

  const currentSong = useMemo(
    () =>
      songsArray.find(
        (item) => String(item._id || item.id) === String(currentId)
      ),
    [currentId]
  );

  const currentArtistIndex = useMemo(() => {
    if (!currentSong) return -1;
    return artistArray.findIndex(
      (artist) => artist.name === currentSong.artist
    );
  }, [currentSong]);

  const getFirstSongForArtist = (artistName) => {
    const songs = songsArray.filter((item) => item.artist === artistName);
    return songs.length > 0 ? songs[0] : null;
  };

  const getLastSongForArtist = (artistName) => {
    const songs = songsArray.filter((item) => item.artist === artistName);
    return songs.length > 0 ? songs[songs.length - 1] : null;
  };

  // Função para obter anúncio rotativo baseado na posição da música
  const getRotatingAd = useMemo(() => {
    const songId = String(currentId);
    const hashCode = songId.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    const adIndex = Math.abs(hashCode) % adsArray.length;
    return adsArray[adIndex];
  }, [currentId]);

  const prevSongId = useMemo(() => {
    if (playlist.length === 0) return null;
    if (currentIndex > 0) {
      return playlist[currentIndex - 1]._id || playlist[currentIndex - 1].id;
    }

    if (currentArtistIndex < 0) return null;

    const previousArtistIndex =
      (currentArtistIndex - 1 + artistArray.length) % artistArray.length;
    const previousArtist = artistArray[previousArtistIndex];
    const lastSong = getLastSongForArtist(previousArtist.name);

    return lastSong ? lastSong._id || lastSong.id : null;
  }, [playlist, currentIndex, currentArtistIndex]);

  const nextSongId = useMemo(() => {
    if (playlist.length === 0) return null;
    if (currentIndex < playlist.length - 1) {
      return playlist[currentIndex + 1]._id || playlist[currentIndex + 1].id;
    }

    if (currentArtistIndex < 0) return null;

    const nextArtistIndex = (currentArtistIndex + 1) % artistArray.length;
    const nextArtist = artistArray[nextArtistIndex];
    const firstSong = getFirstSongForArtist(nextArtist.name);

    return firstSong ? firstSong._id || firstSong.id : null;
  }, [playlist, currentIndex, currentArtistIndex]);

  const updateProgress = (time) => {
    if (!audioPlayer.current || !progressBar.current) return;

    const safeTime = Math.max(0, Math.min(time, durationInSeconds));
    audioPlayer.current.currentTime = safeTime;
    setCurrentTime(formatTime(safeTime));
    const percent = durationInSeconds > 0 ? (safeTime / durationInSeconds) * 100 : 0;
    progressBar.current.style.setProperty("--_progress", percent + "%");
  };

  const updateVolume = (percentage) => {
    const safeVolume = Math.max(0, Math.min(1, percentage));

    if (audioPlayer.current) {
      audioPlayer.current.volume = safeVolume;
    }

    setVolume(safeVolume);

    if (volumeBar.current) {
      volumeBar.current.style.setProperty("--_volume", `${safeVolume * 100}%`);
    }
  };

  useEffect(() => {
    const audioEl = audioPlayer.current;
    if (!audioEl) return;

    const handleTimeUpdate = () => {
      setCurrentTime(formatTime(audioEl.currentTime));
      if (durationInSeconds > 0) {
        progressBar.current?.style.setProperty(
          "--_progress",
          (audioEl.currentTime / durationInSeconds) * 100 + "%"
        );
      }
    };

    const handleLoadedMetadata = () => {
      const actualDuration = audioEl.duration;
      if (!Number.isNaN(actualDuration) && actualDuration > 0) {
        setDurationInSeconds(actualDuration);
      }
      // Auto-play when metadata is loaded and song changed
      if (isPlaying && audioEl.paused) {
        audioEl.play().catch(() => {
          // Autoplay might be blocked
        });
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Increment song change counter and show ad every 2 songs
      setSongChangeCount((prev) => {
        const newCount = prev + 1;
        if (newCount % 2 === 0) {
          showAdOverlay();
        }
        return newCount;
      });
    };

    audioEl.addEventListener("timeupdate", handleTimeUpdate);
    audioEl.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioEl.addEventListener("ended", handleEnded);

    return () => {
      audioEl.removeEventListener("timeupdate", handleTimeUpdate);
      audioEl.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioEl.removeEventListener("ended", handleEnded);
    };
  }, [durationInSeconds]);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!isSeeking) return;

      const bar = progressBar.current?.parentElement;
      if (!bar) return;

      const rect = bar.getBoundingClientRect();
      const relativeX = Math.min(
        Math.max(event.clientX - rect.left, 0),
        rect.width
      );
      const percentage = relativeX / rect.width;
      updateProgress(durationInSeconds * percentage);
    };

    const handlePointerUp = () => {
      setIsSeeking(false);
    };

    if (isSeeking) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isSeeking, durationInSeconds]);

  const handleBarPointerDown = (event) => {
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const relativeX = Math.min(
      Math.max(event.clientX - rect.left, 0),
      rect.width
    );
    const percentage = relativeX / rect.width;
    updateProgress(durationInSeconds * percentage);
    setIsSeeking(true);
  };

  const playPause = () => {
    if (!audioPlayer.current) return;
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
    setIsPlaying((current) => !current);
  };

  const handleCloseAd = () => {
    setShowAd(false);

    if (!shouldResumeAfterAdRef.current || !audioPlayer.current) {
      shouldResumeAfterAdRef.current = false;
      return;
    }

    shouldResumeAfterAdRef.current = false;

    const resumePlayback = () => {
      audioPlayer.current?.play().catch(() => {
        // Autoplay might be blocked by browser, that's fine
      });
      setIsPlaying(true);
    };

    const resumeTimeout = setTimeout(resumePlayback, 150);
    return () => clearTimeout(resumeTimeout);
  };

  const showAdOverlay = () => {
    shouldResumeAfterAdRef.current = true;

    if (audioPlayer.current) {
      audioPlayer.current.pause();
      setIsPlaying(false);
    }

    setShowAd(true);
  };

  // Auto-play when song changes via navigation
  useEffect(() => {
    if (previousIdRef.current !== currentId && audioPlayer.current) {
      previousIdRef.current = currentId;
      // Reset the song
      audioPlayer.current.currentTime = 0;
      setCurrentTime(formatTime(0));

      const nextSongChangeCount = songChangeCount + 1;
      setSongChangeCount(nextSongChangeCount);

      if (nextSongChangeCount % 2 === 0) {
        showAdOverlay();
        return;
      }

      const playTimeout = setTimeout(() => {
        audioPlayer.current?.play().catch(() => {
          // Autoplay might be blocked by browser, that's fine
        });
        setIsPlaying(true);
      }, 100);

      return () => clearTimeout(playTimeout);
    }
  }, [currentId, songChangeCount]);

  const handleVolumePointerDown = (event) => {
    const bar = event.currentTarget;
    const rect = bar.getBoundingClientRect();
    const relativeX = Math.min(
      Math.max(event.clientX - rect.left, 0),
      rect.width
    );
    const percentage = relativeX / rect.width;
    updateVolume(percentage);
    setIsAdjustingVolume(true);
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!isAdjustingVolume) return;

      const bar = volumeBar.current?.parentElement;
      if (!bar) return;

      const rect = bar.getBoundingClientRect();
      const relativeX = Math.min(
        Math.max(event.clientX - rect.left, 0),
        rect.width
      );
      const percentage = relativeX / rect.width;
      updateVolume(percentage);
    };

    const handlePointerUp = () => {
      setIsAdjustingVolume(false);
    };

    if (isAdjustingVolume) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isAdjustingVolume]);

  return (
    <div className="player">
      <div className="player__controllers">
        {prevSongId ? (
          <Link
            to={`/song/${prevSongId}`}
            className="player__icon player__icon--nav"
          >
            <FontAwesomeIcon icon={faBackwardStep} />
          </Link>
        ) : (
          <span className="player__icon player__icon--nav player__icon--disabled">
            <FontAwesomeIcon icon={faBackwardStep} />
          </span>
        )}

        <button
          type="button"
          className="player__icon player__icon--play"
          onClick={playPause}
        >
          <FontAwesomeIcon icon={isPlaying ? faCirclePause : faCirclePlay} />
        </button>

        {nextSongId ? (
          <Link
            to={`/song/${nextSongId}`}
            className="player__icon player__icon--nav"
          >
            <FontAwesomeIcon icon={faForwardStep} />
          </Link>
        ) : (
          <span className="player__icon player__icon--nav player__icon--disabled">
            <FontAwesomeIcon icon={faForwardStep} />
          </span>
        )}
      </div>

      <div className="player__progress">
        <p className="player__time">{currentTime}</p>

        <div
          className="player__bar"
          onPointerDown={handleBarPointerDown}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={durationInSeconds}
          aria-valuenow={audioPlayer.current?.currentTime || 0}
        >
          <div ref={progressBar} className="player__bar-progress"></div>
        </div>

        <p className="player__time">{formatTime(durationInSeconds)}</p>
      </div>

      <div className="player__volume">
        <div
          className="player__volume-bar"
          onPointerDown={handleVolumePointerDown}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(volume * 100)}
        >
          <div ref={volumeBar} className="player__volume-bar-progress"></div>
        </div>
      </div>

      <audio ref={audioPlayer} src={audio}></audio>

      {showAd && (
        <Ad
          title={getRotatingAd.title}
          description={getRotatingAd.description}
          logo={getRotatingAd.logo}
          link={getRotatingAd.link}
          onClose={handleCloseAd}
          countdownSeconds={10}
        />
      )}
    </div>
  );
};

export default Player;
