import axios from "axios";

let audioInstance: HTMLAudioElement | null = null;

export const speakText = async (message: string) => {
  try {
    const response = await axios.post(
      "/deepgram/tts/api",
      { text: message },
      {
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "application/json",
          Accept: "audio/wav",
        },
      }
    );

    const blob = new Blob([response.data], {
      type: "audio/wav",
    });
    const audioUrl = URL.createObjectURL(blob);

    stopSpeech(); // Stop existing audio

    const audio = new Audio(audioUrl);
    audioInstance = audio;
    await audio.play();
  } catch (error) {
    console.error("Error generating audio:", error);
  }
};

export const stopSpeech = () => {
  if (audioInstance) {
    audioInstance.pause();
    audioInstance.currentTime = 0;
    audioInstance = null;
  }
};
