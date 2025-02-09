import axios from "axios";

let audioInstance: HTMLAudioElement | null = null;

export const speakText = async (text: string) => {
  try {
    const response = await axios.post(
      "https://api.hyperbolic.xyz/v1/audio/generation",
      { text },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_HYPERBOLIC_API_KEY}`,
        },
      }
    );

    const audioBase64 = response.data.audio;
    const byteCharacters = atob(audioBase64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/mpeg" });
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
