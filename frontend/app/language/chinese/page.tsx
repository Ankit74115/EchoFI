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
    // 添加用户消息
    setMessages((prev) => [...prev, { type: "user", text: userText }]);

    try {
      const aiResponse = await mistralReasoning(userText);

      if (aiResponse.type === "base-transaction") {
        await speakText("使用基础代理执行交易");
        setMessages((prev) => [...prev, { type: "ai", text: "使用基础代理执行交易..." }]);
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
        await speakText("使用共价代理执行交易");
        setMessages((prev) => [...prev, { type: "ai", text: "使用共价代理执行交易..." }]);
      } else {
        await speakText(aiResponse.messageInNative as string);
        setMessages((prev) => [
          ...prev,
          { type: "ai", text: aiResponse.messageInNative as string },
        ]);
      }
    } catch (error) {
      console.error("处理用户输入时出错:", error);
      await speakText("抱歉，处理您的请求时出错。");
      setMessages((prev) => [...prev, { type: "ai", text: "抱歉，处理您的请求时出错。" }]);
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
      {/* 账户按钮 */}
      <div className="flex justify-end p-4">
        <a
          href="/account"
          target="_blank"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          账户
        </a>
      </div>

      <div className="flex flex-1">
        {/* 左侧 - 聊天界面 */}
        <div className="flex-1 px-6">
          <div className="h-full flex flex-col">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">DeFi AI 助手</h1>
              <p className="text-gray-400">您的语音支持的去中心化金融助手</p>
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

            {/* 文本输入表单 */}
            <form onSubmit={handleTextSubmit} className="mt-4 pb-6">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="在此输入您的消息或地址..."
              />
              <button
                type="submit"
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                发送消息
              </button>
            </form>
          </div>
        </div>

        {/* 右侧 - 语音控制 */}
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
