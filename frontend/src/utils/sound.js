let bgAudio = null;

export const isSoundEnabled = () => {
  return localStorage.getItem("sound-enabled") !== "false";
};

export const toggleSound = () => {
  const current = isSoundEnabled();
  localStorage.setItem("sound-enabled", String(!current));
  return !current;
};

export const playClapSound = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio("/sounds/clap.mp3");
  audio.volume = 0.8;
  audio.play().catch((err) => console.warn("Audio error:", err));
};

export const playBackgroundMusic = (url) => {
  if (!isSoundEnabled() || url === "none") return;

  stopBackgroundMusic();

  bgAudio = new Audio(url);
  bgAudio.loop = true;
  bgAudio.volume = 0.04;
  bgAudio.play().catch((err) => console.warn("BG music error:", err));
};

export const stopBackgroundMusic = () => {
  if (bgAudio) {
    bgAudio.pause();
    bgAudio = null;
  }
};
