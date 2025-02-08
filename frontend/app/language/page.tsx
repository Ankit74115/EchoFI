"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const languages = [
  { code: "en", name: "English", icon: "🇬🇧" },
  { code: "hi", name: "Hindi", icon: "🇮🇳" },
  { code: "ko", name: "Korean", icon: "🇰🇷" },
  { code: "ar", name: "Arabic", icon: "🇸🇦" },
  { code: "zh", name: "Chinese", icon: "🇨🇳" },
  { code: "nl", name: "Dutch", icon: "🇳🇱" },
];

export default function LanguageSelectionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const router = useRouter();

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    setTimeout(() => {
      router.push(`/${languageCode}`);
    }, 500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 shadow-2xl max-w-4xl w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-8">
          DeFi AI Assistant
        </h1>
        <p className="text-xl text-white text-center mb-12">
          Select your preferred language to interact with our AI agent
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {languages.map((language) => (
            <motion.button
              key={language.code}
              className={`p-4 rounded-lg text-white text-xl font-semibold transition-colors ${
                selectedLanguage === language.code
                  ? "bg-white bg-opacity-30"
                  : "bg-white bg-opacity-10 hover:bg-opacity-20"
              }`}
              onClick={() => handleLanguageSelect(language.code)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-4xl mr-2">{language.icon}</span>
              {language.name}
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  );
}
