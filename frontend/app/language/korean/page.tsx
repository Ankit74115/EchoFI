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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleUserInput = async (userText: string) => {
    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { type: "user", text: userText }]);

    try {
      const aiResponse = await mistralReasoning(userText);

      if (aiResponse.type === "base-transaction") {
        await speakText("기본 에이전트를 사용하여 트랜잭션 수행");
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "기본 에이전트를 사용하여 트랜잭션 수행 중..." },
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
        await speakText("공유 에이전트를 사용하여 트랜잭션 수행");
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: "공유 에이전트를 사용하여 트랜잭션 수행 중..." },
        ]);
      } else {
        await speakText(aiResponse.messageInNative as string);
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: aiResponse.messageInNative as string },
        ]);
      }
    } catch (error) {
      console.error("사용자 입력 처리 중 오류 발생:", error);
      await speakText("요청을 처리하는 중 오류가 발생했습니다.");
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "요청을 처리하는 중 오류가 발생했습니다." },
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
              <p className="text-gray-400">음성 지원 분산 금융 어시스턴트</p>
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

            {/* 텍스트 입력 폼 */}
            <form onSubmit={handleTextSubmit} className="mt-4 pb-6">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="메시지나 주소를 여기에 입력하세요..."
              />
              <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                메시지 보내기
              </button>
            </form>
          </div>
        </div>

        {/* 오른쪽 - 음성 제어 */}
        <div className="w-1/3 flex flex-col items-center justify-center p-6 border-l border-gray-700">
          <VoiceControl
            isListening={isListening}
            setIsListening={setIsListening}
            handleUserInput={handleUserInput}
          />
        </div>
        {audioUrl && (
          <audio controls hidden>
            <source src={audioUrl} type="audio/wav" />
          </audio>
        )}
      </div>
    </main>
  );
}
