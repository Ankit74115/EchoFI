"use client";

import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { speakText } from "../../../utils/hyperbolic";
import mistralReasoning from "../../../utils/mistral";
import VoiceControl from "../../../components/voice/VoiceControl";

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: "user" | "ai"; text: string }>>([]);
  const [inputText, setInputText] = useState("");

  const handleUserInput = async (userText: string) => {
    // Voeg gebruikersbericht toe
    setMessages((prev) => [...prev, { type: "user", text: userText }]);

    try {
      const aiResponse = await mistralReasoning(userText);

      if (aiResponse.type === "base-transaction") {
        await speakText("Transacties uitvoeren met behulp van basisagenten");
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "Transacties uitvoeren met behulp van basisagenten..." },
        ]);
        const response = await axios.post(
          "https://autonome.alt.technology/base-ai-oyweuq/chat",
          {
            message: aiResponse.messageInEnglish,
          },
          {
            headers: {
              Authorization: `Basic ${process.env.NEXT_PUBLIC_AUTONOME_BASE_AGENT}`,
            },
          }
        );
        await speakText(response.data.response);
        setMessages((prev) => [...prev, { type: "ai", text: response.data.response }]);
      } else if (aiResponse.type === "covalent-transaction") {
        await speakText("Transactie uitvoeren met behulp van covalente agenten");
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "Transactie uitvoeren met behulp van covalente agenten..." },
        ]);
      } else {
        await speakText(aiResponse.messageInNative as string);
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: aiResponse.messageInNative as string },
        ]);
      }
    } catch (error) {
      console.error("Fout bij het verwerken van gebruikersinvoer:", error);
      await speakText("Sorry, er is een fout opgetreden bij het verwerken van uw verzoek.");
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "Sorry, er is een fout opgetreden bij het verwerken van uw verzoek." },
      ]);
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
      {/* Accountknop */}
      <div className="flex justify-end p-4">
        <a
          href="/account"
          target="_blank"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Account
        </a>
      </div>

      <div className="flex flex-1">
        {/* Linkerkant - Chatinterface */}
        <div className="flex-1 px-6">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">DeFi AI-assistent</h1>
              <p className="text-gray-400">
                Uw spraakgestuurde gedecentraliseerde financiële assistent
              </p>
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

            {/* Tekstinvoervorm */}
            <form onSubmit={handleTextSubmit} className="mt-4 pb-6">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Typ hier uw bericht of adres..."
              />
              <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Verstuur bericht
              </button>
            </form>
          </div>
        </div>

        {/* Rechterkant - Spraakbesturing */}
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
