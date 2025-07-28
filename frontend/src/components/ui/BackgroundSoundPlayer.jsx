import { useEffect, useState } from "react";
import { isSoundEnabled, playBackgroundMusic, stopBackgroundMusic } from "../../utils/sound";

const tracks = [
  { name: "None", url: "none" },
  { name: "Saiyara", url: "/sounds/Saiyara.mp3" },
  { name: "Wavy", url: "/sounds/Wavy.mp3" },
  { name: "All is Well", url: "/sounds/AllisWell.mp3" },
  { name: "Sapphire", url: "/sounds/Sapphire.mp3" },
];

export default function BackgroundSoundPlayer() {
  const [selectedTrack, setSelectedTrack] = useState(
    localStorage.getItem("bg-track") || tracks[0].url
  );

  useEffect(() => {
    stopBackgroundMusic(); // Always stop previous music

    if (isSoundEnabled() && selectedTrack !== "none") {
      playBackgroundMusic(selectedTrack);
    }

    return () => stopBackgroundMusic();
  }, [selectedTrack]);

  const handleChange = (e) => {
    const newTrack = e.target.value;
    localStorage.setItem("bg-track", newTrack);
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
