import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";
import { getTranscription, uploadAudio } from "../../utils/assemblyai";
import { stopSpeech } from "../../utils/hyperbolic";

interface VoiceControlProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  handleUserInput: (text: string) => void;
}

export default function VoiceControl({ setIsListening, handleUserInput }: VoiceControlProps) {
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

  const processAudio = async (audioBlob: Blob) => {
    try {
      const uploadUrl = await uploadAudio(audioBlob);
      const transcriptText = await getTranscription(uploadUrl);
      handleUserInput(transcriptText);
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
