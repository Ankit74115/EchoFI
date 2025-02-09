"use client";

import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import VoiceControl from "../../../components/voice/VoiceControl";
import openAIReasoning from "../../../utils/openaiReasoning";
import { speakText } from "../../../utils/hyperbolic";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; text: string }>>([]);
  const [inputText, setInputText] = useState("");

  const handleUserInput = async (userText: string) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: userText }]);

    try {
      const openAIResponse = await openAIReasoning(userText);

      if (openAIResponse.action === "base-transaction") {
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "Performing transaction on Base Network..." },
        ]);
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
        setMessages((prev) => [...prev, { type: "ai", text: response.data.response }]);
        await speakText(response.data.response);
      } else if (openAIResponse.action === "covalent-transaction") {
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "Performing Transaction using covalent agents..." },
        ]);
        await speakText("Performing Transaction using covalent agents");
      } else {
        setMessages((prev) => [...prev, { type: "ai", text: openAIResponse.data as string }]);
        await speakText(openAIResponse.data as string);
      }
    } catch (error) {
      console.error("Error processing user input:", error);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, there was an error processing your request." },
      ]);
      await speakText("Sorry, there was an error processing your request.");
    }
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    await handleUserInput(inputText.trim());
    setInputText("");
  };

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Account Button */}
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
        {/* Left Side - Chat Interface */}
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

            {/* Text Input Form */}
            <form onSubmit={handleTextSubmit} className="mt-4 pb-6">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message or address here..."
              />
              <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Voice Control */}
        <div className="w-1/3 flex flex-col items-center justify-center p-6 border-l border-gray-700">
          <VoiceControl
            isListening={isListening}
            setIsListening={setIsListening}
            handleUserInput={handleUserInput}
          />
        </div>
      </div>
    </main>
  );
}
