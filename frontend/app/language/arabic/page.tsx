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
      {/* زر الحساب */}
      <div className="flex justify-end p-4">
        <a
          href="/account"
          target="_blank"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          الحساب
        </a>
      </div>

      <div className="flex flex-1">
        {/* الجانب الأيسر - واجهة الدردشة */}
        <div className="flex-1 px-6">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">
                مساعد الذكاء الاصطناعي للتمويل اللامركزي
              </h1>
              <p className="text-gray-400">مساعد التمويل اللامركزي المدعوم بالصوت الخاص بك</p>
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

        {/* الجانب الأيمن - التحكم الصوتي */}
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
