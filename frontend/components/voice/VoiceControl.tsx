import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";
import axios from "axios";
import openAIReasoning from "../../utils/openaiReasoning";
import { getTranscription, uploadAudio } from "../../utils/assemblyai";

interface VoiceControlProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  onNewMessage: (text: string, type: "user" | "ai") => void;
}

export default function VoiceControl({ setIsListening, onNewMessage }: VoiceControlProps) {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const speakText = async (text: string) => {
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

      stopSpeech(); // Stop any existing audio before playing new

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      await audio.play();
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  };

  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  // Main function to process the recorded audio
  const processAudio = async (audioBlob: Blob) => {
    try {
      const uploadUrl = await uploadAudio(audioBlob);
      const transcriptText = await getTranscription(uploadUrl);
      onNewMessage(transcriptText, "user");

      const openAIResponse = await openAIReasoning(transcriptText);

      console.log(openAIResponse);

      if (openAIResponse.action === "base-transaction") {
        onNewMessage("Performing transaction on Base Network...", "ai");
        await speakText("Performing transaction on Base Network");
        const response = await axios.post(
          "https://autonome.alt.technology/base-ai-oyweuq/chat",
          {
            message: openAIResponse.data,
          },
          {
            headers: {
              Authorization: `Basic ${process.env.NEXT_PUBLIC_AUTONOME_BASE_AGENT}`,
            },
          }
        );
        onNewMessage(response.data.response, "ai");
        await speakText(response.data.response);
      } else if (openAIResponse.action === "covalent-transaction") {
        onNewMessage("Performing Transaction using covalent agents...", "ai");
        await speakText("Performing Transaction using covalent agents");
        // const response = await axios.post("https://base-ai-agent-e88fafda6d87.herokuapp.com/chat", {
        //   message: openAIResponse.data,
        // });
        // onNewMessage(response.data.response, "ai");
        // await speakText(response.data.response);
      } else {
        onNewMessage(openAIResponse.data as string, "ai");
        await speakText(openAIResponse.data as string);
      }
    } catch (error) {
      console.error("Error processing audio", error);
    }
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
