"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Mic } from "lucide-react"
import { saveAudioFile } from "../app/audio/actions"

export default function AudioProcessing() {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingDuration, setRecordingDuration] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const toggleRecording = async () => {
    if (isRecording) {
      stopRecording()
    } else {
      await startRecording()
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        await saveRecording(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingDuration(0)
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }

  const saveRecording = async (audioBlob: Blob) => {
    const formData = new FormData()
    formData.append("audio", audioBlob, "recording.webm")
    try {
      await saveAudioFile(formData)
      console.log("Audio saved successfully!")
    } catch (error) {
      console.error("Error saving audio:", error)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.button
        onClick={toggleRecording}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white ${
          isRecording ? "bg-red-500" : "bg-blue-500"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          isRecording ? { scale: [1, 1.1, 1], transition: { repeat: Number.POSITIVE_INFINITY, duration: 1 } } : {}
        }
      >
        <Mic size={24} />
      </motion.button>
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg font-semibold"
        >
          {formatDuration(recordingDuration)}
        </motion.div>
      )}
    </div>
  )
}

