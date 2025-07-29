import { useEffect, useState, useRef } from "react";
import { isSoundEnabled, playBackgroundMusic, stopBackgroundMusic } from "../../utils/sound";

const tracks = [
  { name: "All is Well", url: "/sounds/AllisWell.mp3" },
  { name: "Sapphire", url: "/sounds/Sapphire.mp3" },
  { name: "None", url: "none" },
];

export default function BackgroundSoundPlayer() {
  const [selectedTrack, setSelectedTrack] = useState(
    localStorage.getItem("bg-track") || tracks[0].url
  );

  const hasUserInteracted = useRef(false);

  useEffect(() => {
    const handler = () => {
      hasUserInteracted.current = true;

      if (isSoundEnabled() && selectedTrack !== "none") {
        playBackgroundMusic(selectedTrack);
      }

      window.removeEventListener("click", handler);
    };

    window.addEventListener("click", handler);

    return () => window.removeEventListener("click", handler);
  }, []);

  // ✅ Track changes only after interaction
  useEffect(() => {
    localStorage.setItem("bg-track", selectedTrack);

    if (hasUserInteracted.current) {
      stopBackgroundMusic();

      if (isSoundEnabled() && selectedTrack !== "none") {
        playBackgroundMusic(selectedTrack);
      }
    }

    return () => stopBackgroundMusic();
  }, [selectedTrack]);

  const handleChange = (e) => {
    const newTrack = e.target.value;
    setSelectedTrack(newTrack);
  };

  return (
    <div className="sound-selector text-black dark:text-white">
      <label className="text-sm">🎵 Music:</label>
      <select
        value={selectedTrack}
        onChange={handleChange}
        className="bg-black/5 dark:bg-black text-black cursor-pointer dark:text-white p-1 ml-1 text-sm rounded"
      >
        {tracks.map((track) => (
          <option key={track.url} value={track.url}>
            {track.name}
          </option>
        ))}
      </select>
    </div>
  );
}
