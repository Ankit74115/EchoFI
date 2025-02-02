import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";

interface VoiceControlProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  onNewMessage: (text: string, type: "user" | "ai") => void;
}

export default function VoiceControl({ setIsListening, onNewMessage }: VoiceControlProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const handleMicClick = async () => {
    if (!recording) {
      setRecording(true);
      setIsListening(true);
      recordedChunksRef.current = [];
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(recordedChunksRef.current, { type: "audio/webm" }); // When recording stops, combine chunks into a blob
          recordedChunksRef.current = [];
          await processAudio(audioBlob);
        };
      } catch (error) {
        console.error("Error accessing microphone", error);
        setRecording(false);
        setIsListening(false);
      }
    } else {
      setRecording(false);
      setIsListening(false);
      mediaRecorderRef.current?.stop();
    }
  };

  const openAIReasoning = async (
    transcriptText: string
  ): Promise<{ action: string; response?: string; data?: string }> => {
    const prompt = `You are an AI assistant that analyzes queries regarding DeFi and blockchain transactions.
                    Analyze the following user query:
                    "${transcriptText}"
                    If the user is asking to perform a transaction or asking to check wallet balance or asking to sending tokens or to swapping assets, etc. return a JSON object like "action" to be "transaction" and include "data": field and data field to be proper instruction what he is expecting.
                    If the user is only asking for information about DeFi, return a JSON object with "action": "knowledge" and data field which includes data about the query.
                    Only output valid JSON.`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const messageContent = response.data.choices[0].message.content;
    try {
      const result = JSON.parse(messageContent);
      return result;
    } catch (error) {
      console.log("Error parsing JSON", error);
      return { action: "knowledge", response: messageContent };
    }
  };

  // This function sends the transaction details to agent kit.
  const performTransaction = async (transactionData: string): Promise<string> => {
    const response = await axios.post("https://agentkit-zwih.onrender.com/chat", {
      message: transactionData,
    });
    return response.data.response;
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Convert text to speech using the browser's SpeechSynthesis API.
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech not supported in this browser.");
    }
  };

  // Main function to process the recorded audio
  const processAudio = async (audioBlob: Blob) => {
    try {
      const uploadUrl = await uploadAudio(audioBlob);

      const transcriptText = await getTranscription(uploadUrl);

      onNewMessage(transcriptText, "user");

      const openAIResponse = await openAIReasoning(transcriptText);

      console.log("OpenAI response", openAIResponse);

      if (openAIResponse.action === "transaction") {
        onNewMessage("Performing transaction...", "ai");
        speakText("Performing transaction...");
        const txResponse = await performTransaction(
          openAIResponse.data as string
          // "send 0.00001 eth to this address 0x77ed0fef5e9DFB34e776adb11c29dd19d382745C"
        );
        onNewMessage(txResponse, "ai");
        speakText(txResponse);
      } else {
        // Simply display the knowledge response and speak it
        onNewMessage(openAIResponse.data as string, "ai");
        speakText(openAIResponse.data as string);
      }
    } catch (error) {
      console.error("Error processing audio", error);
    }
  };

  const uploadAudio = async (audioBlob: Blob): Promise<string> => {
    const response = await axios({
      method: "post",
      url: process.env.NEXT_PUBLIC_ASSEMBLY_AI_FILE_UPLOAD_URL,
      headers: {
        Authorization: process.env.NEXT_PUBLIC_ASSEMBLY_AI_API_KEY,
        "Content-Type": "application/octet-stream",
      },
      data: audioBlob,
    });

    return response.data.upload_url;
  };

  // Request a transcription from AssemblyAI and poll for its completion
  const getTranscription = async (uploadUrl: string): Promise<string> => {
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

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{
          scale: recording ? [1, 1.2, 1] : 1,
          transition: {
            repeat: recording ? Infinity : 0,
            duration: 1.5,
          },
        }}
        className="relative"
      >
        {/* Ripple animation when recording */}
        {recording && (
          <motion.div
            className="absolute inset-0 bg-blue-500 rounded-full opacity-25"
            animate={{
              scale: [1, 2],
              opacity: [0.25, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        )}
        <button
          onClick={handleMicClick}
          className={`relative z-10 p-8 rounded-full ${
            recording ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          } transition-colors duration-200`}
        >
          <FaMicrophone className="text-3xl" />
        </button>
      </motion.div>
      <p className="mt-6 text-gray-400 text-center">
        {recording ? "Recording... Click to stop" : "Click to start recording"}
      </p>
      <button onClick={stopSpeech} className="mt-4 text-gray-400 hover:text-gray-200">
        Stop speaking
      </button>
    </div>
  );
}
