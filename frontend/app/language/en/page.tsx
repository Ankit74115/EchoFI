"use client";

import { useState } from "react";
import ChatInterface from "../../../components/voice/ChatInterface";
import VoiceControl from "../../../components/voice/VoiceControl";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; text: string }>>([]);

  const handleNewMessage = (text: string, type: "user" | "ai") => {
    setMessages((prev) => [...prev, { type, text }]);
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Left Side - Chat Interface */}
      <div className="flex-1 p-6">
        <ChatInterface messages={messages} />
      </div>

      {/* Right Side - Voice Control */}
      <div className="w-1/3 flex flex-col items-center justify-center p-6 border-l border-gray-700">
        <VoiceControl
          isListening={isListening}
          setIsListening={setIsListening}
          onNewMessage={handleNewMessage}
        />
      </div>
    </main>
  );
}
