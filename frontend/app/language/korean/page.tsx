"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import VoiceControl from "../../../components/voice/VoiceControl";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; text: string }>>([]);

  const handleNewMessage = (text: string, type: "user" | "ai") => {
    setMessages((prev) => [...prev, { type, text }]);
  };

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* 계정 버튼 */}
      <div className="flex justify-end p-4">
        <a
          href="/account"
          target="_blank"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          계정
        </a>
      </div>

      <div className="flex flex-1">
        {/* 왼쪽 - 채팅 인터페이스 */}
        <div className="flex-1 px-6">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">DeFi AI 어시스턴트</h1>
              <p className="text-gray-400">당신의 음성 지원 분산 금융 어시스턴트</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽 - 음성 제어 */}
        <div className="w-1/3 flex flex-col items-center justify-center p-6 border-l border-gray-700">
          <VoiceControl
            isListening={isListening}
            setIsListening={setIsListening}
            onNewMessage={handleNewMessage}
          />
        </div>
      </div>
    </main>
  );
}
