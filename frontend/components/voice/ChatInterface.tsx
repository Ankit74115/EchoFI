import { motion } from "framer-motion";

interface Message {
  type: "user" | "ai";
  text: string;
}

interface ChatInterfaceProps {
  messages: Message[];
}

export default function ChatInterface({ messages }: ChatInterfaceProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">DeFi AI Assistant</h1>
        <p className="text-gray-400">Your voice-enabled Decentralised Finance assistant</p>
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
                message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
