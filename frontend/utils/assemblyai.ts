import axios from "axios";

export const uploadAudio = async (audioBlob: Blob): Promise<string> => {
  try {
    const uploadResponse = await axios.post(
      process.env.NEXT_PUBLIC_ASSEMBLY_AI_FILE_UPLOAD_URL as string,
      audioBlob,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY,
          "Content-Type": "application/octet-stream",
        },
      }
    );

    if (!uploadResponse.data?.upload_url) {
      throw new Error("Audio Upload Failed");
    }

    return uploadResponse.data.upload_url;
  } catch (error: unknown) {
    console.error("Unexpected error while uploading audio:", error);
    return "Error during audio upload";
  }
};

// Request a transcription from AssemblyAI and poll for its completion
export const getTranscription = async (uploadUrl: string): Promise<string> => {
  const transcriptResponse = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    {
      audio_url: uploadUrl,
    },
    {
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY,
      },
    }
  );
  const transcriptId = transcriptResponse.data.id;
  let transcriptText = "";

  // Poll until transcription is complete
  while (true) {
    const pollingResponse = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY,
        },
      }
    );

    if (pollingResponse.data.status === "completed") {
      transcriptText = pollingResponse.data.text;
      break;
    } else if (pollingResponse.data.status === "error") {
      throw new Error("Transcription failed: " + pollingResponse.data.error);
    }
    // Waiting for a few seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return transcriptText;
};
