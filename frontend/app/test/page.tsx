// "use client";

// import { useState, useRef } from "react";
// import axios from "axios";
// import {
//   TranscribeClient,
//   StartTranscriptionJobCommand,
//   GetTranscriptionJobCommand,
//   StartTranscriptionJobCommandInput,
// } from "@aws-sdk/client-transcribe";
// import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";

// // Initialize AWS clients with credentials from environment variables
// const region = process.env.NEXT_PUBLIC_AWS_REGION!;
// const awsCredentials = {
//   accessKeyId: process.env.NEXT_PUBLIC_ASSEMBLY_ACCESS_KEY as string,
//   secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY as string,
// };

// const transcribeClient = new TranscribeClient({
//   region,
//   credentials: awsCredentials,
// });

// const translateClient = new TranslateClient({
//   region,
//   credentials: awsCredentials,
// });

// const s3Client = new S3Client({
//   region,
//   credentials: awsCredentials,
// });

// // --- Your existing functions for transcription, translation, and speech synthesis ---

// async function transcribeAudio(audioUri: string) {
//   const jobName = `TranscriptionJob-${uuidv4()}`;
//   const params: StartTranscriptionJobCommandInput = {
//     TranscriptionJobName: jobName,
//     LanguageCode: "hi-IN", // Hindi (India)
//     Media: { MediaFileUri: audioUri },
//     // IMPORTANT: Set MediaFormat to match the recorded file type.
//     MediaFormat: "webm",
//     OutputBucketName: "matcrypt", // Your S3 bucket name (must have CORS enabled)
//   };

//   try {
//     const startCommand = new StartTranscriptionJobCommand(params);
//     await transcribeClient.send(startCommand);
//     console.log(`Transcription job '${jobName}' started.`);

//     // Poll for job completion every second.
//     let jobStatus = "IN_PROGRESS";
//     while (jobStatus === "IN_PROGRESS") {
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       const getCommand = new GetTranscriptionJobCommand({ TranscriptionJobName: jobName });
//       const data = await transcribeClient.send(getCommand);
//       const transcriptionJob = data.TranscriptionJob;
//       if (transcriptionJob?.TranscriptionJobStatus === "COMPLETED") {
//         console.log(
//           `Transcription completed. URL: ${transcriptionJob?.Transcript?.TranscriptFileUri}`
//         );
//         return transcriptionJob?.Transcript?.TranscriptFileUri;
//       } else if (transcriptionJob?.TranscriptionJobStatus === "FAILED") {
//         throw new Error("Transcription job failed.");
//       }
//     }
//   } catch (error) {
//     console.error("Error transcribing audio:", error);
//   }
// }

// async function fetchTranscript(url: string) {
//   try {
//     const response = await axios.get(url);
//     const transcriptData = response.data;
//     return transcriptData.results.transcripts[0].transcript;
//   } catch (error) {
//     console.error("Error fetching transcript:", error);
//   }
// }

// async function translateText(text: string, sourceLang: string, targetLang: string) {
//   const params = {
//     Text: text,
//     SourceLanguageCode: sourceLang,
//     TargetLanguageCode: targetLang,
//   };

//   try {
//     const command = new TranslateTextCommand(params);
//     const data = await translateClient.send(command);
//     return data.TranslatedText;
//   } catch (error) {
//     console.error("Error translating text:", error);
//   }
// }

// function speakText(text: string) {
//   if (typeof window !== "undefined" && window.speechSynthesis) {
//     const utterance = new SpeechSynthesisUtterance(text);
//     // Set language (for example, "ko-KR" for Korean)
//     utterance.lang = "ko-KR";
//     window.speechSynthesis.speak(utterance);
//   } else {
//     console.error("Speech Synthesis not supported in this browser.");
//   }
// }

// // --- End of existing functions ---

// export default function HomePage() {
//   const [status, setStatus] = useState("Idle");
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const [recording, setRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);

//   // Function to record audio using the browser's MediaRecorder API.
//   function startRecording() {
//     setStatus("Recording...");
//     navigator.mediaDevices
//       .getUserMedia({ audio: true })
//       .then((stream) => {
//         // Set the MIME type as "audio/webm" if supported (if not, use a supported type and convert accordingly)
//         const options = { mimeType: "audio/webm" };
//         const mediaRecorder = new MediaRecorder(stream, options);
//         mediaRecorderRef.current = mediaRecorder;
//         audioChunksRef.current = [];

//         mediaRecorder.addEventListener("dataavailable", (event) => {
//           if (event.data.size > 0) {
//             audioChunksRef.current.push(event.data);
//           }
//         });

//         mediaRecorder.addEventListener("stop", async () => {
//           setStatus("Uploading audio...");
//           // Combine audio chunks into a single Blob.
//           const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
//           try {
//             const s3Url = await uploadAudioToS3(audioBlob);
//             setAudioUrl(s3Url);
//             setStatus("Audio uploaded. Processing...");
//             // Now process the audio using the S3 URL.
//             await processAudio(s3Url);
//           } catch (error) {
//             setStatus("Error uploading audio.");
//           }
//         });

//         mediaRecorder.start();
//         setRecording(true);
//       })
//       .catch((error) => {
//         console.error("Error accessing microphone:", error);
//         setStatus("Error accessing microphone.");
//       });
//   }

//   function stopRecording() {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//       setRecording(false);
//     }
//   }

//   // Function to upload the recorded audio to S3.
//   // Function to upload the recorded audio to S3.
//   async function uploadAudioToS3(audioBlob: Blob): Promise<string> {
//     const fileKey = `recordings/${uuidv4()}.webm`; // Adjust extension as needed.
//     const command = new PutObjectCommand({
//       Bucket: "matcrypt", // Your S3 bucket name.
//       Key: fileKey,
//       Body: audioBlob.stream(), // Use the Blob's stream() method here.
//       ContentType: "audio/webm",
//     });
//     try {
//       const res = await s3Client.send(command);
//       console.log("Audio uploaded:", res);
//       // Construct a public URL if your bucket is public or use a pre-signed URL.
//       return `https://${"matcrypt"}.s3.${region}.amazonaws.com/${fileKey}`;
//     } catch (error) {
//       console.error("Error uploading audio:", error);
//       throw error;
//     }
//   }

//   // Process the audio: transcribe, translate, and speak.
//   async function processAudio(audioUri: string) {
//     try {
//       setStatus("Transcribing audio...");
//       const transcriptUrl = await transcribeAudio(audioUri);
//       if (!transcriptUrl) {
//         setStatus("Transcription failed.");
//         return;
//       }

//       setStatus("Fetching transcript...");
//       const hindiTranscript = await fetchTranscript(transcriptUrl);
//       console.log("Hindi Transcript:", hindiTranscript);

//       setStatus("Translating to English...");
//       const englishTranscript = await translateText(hindiTranscript, "hi", "en");
//       console.log("English Transcript:", englishTranscript);

//       setStatus("Translating to Korean...");
//       const koreanTranscript = await translateText(englishTranscript as string, "en", "ko");
//       console.log("Korean Transcript:", koreanTranscript);

//       setStatus("Speaking out the text...");
//       speakText(koreanTranscript as string);
//       setStatus("Done");
//     } catch (error) {
//       setStatus("Error processing audio.");
//       console.error("Error processing audio:", error);
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center p-8">
//       <h1 className="text-3xl mb-4">Record, Upload, & Process Audio</h1>
//       <p>Status: {status}</p>
//       {recording ? (
//         <button onClick={stopRecording} className="mt-4 px-6 py-3 bg-red-500 text-white rounded">
//           Stop Recording
//         </button>
//       ) : (
//         <button onClick={startRecording} className="mt-4 px-6 py-3 bg-blue-500 text-white rounded">
//           Start Recording
//         </button>
//       )}
//       {audioUrl && (
//         <p className="mt-4 text-sm">
//           Uploaded Audio URL:{" "}
//           <a href={audioUrl} target="_blank" rel="noopener noreferrer" className="underline">
//             {audioUrl}
//           </a>
//         </p>
//       )}
//     </div>
//   );
// }

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl mb-4">Record, Upload, & Process Audio</h1>
      <p>Status: Idle</p>
      <button className="mt-4 px-6 py-3 bg-blue-500 text-white rounded">Start Recording</button>
    </div>
  );
}
