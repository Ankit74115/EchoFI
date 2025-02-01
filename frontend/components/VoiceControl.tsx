import { motion } from 'framer-motion';
import { FaMicrophone } from 'react-icons/fa';

interface VoiceControlProps {
  isListening: boolean;
  setIsListening: (value: boolean) => void;
  onNewMessage: (text: string, type: 'user' | 'ai') => void;
}

export default function VoiceControl({ 
  isListening, 
  setIsListening,
  onNewMessage 
}: VoiceControlProps) {
  const handleMicClick = () => {
    setIsListening(!isListening);
    // Simulate voice interaction for demonstration
    if (!isListening) {
      setTimeout(() => {
        onNewMessage("How can I help you with DeFi today?", "ai");
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{
          scale: isListening ? [1, 1.2, 1] : 1,
          transition: {
            repeat: isListening ? Infinity : 0,
            duration: 1.5
          }
        }}
        className="relative"
      >
        {/* Ripple effect when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 bg-blue-500 rounded-full opacity-25"
            animate={{
              scale: [1, 2],
              opacity: [0.25, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity
            }}
          />
        )}
        
        <button
          onClick={handleMicClick}
          className={`relative z-10 p-8 rounded-full ${
            isListening 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          } transition-colors duration-200`}
        >
          <FaMicrophone className="text-3xl" />
        </button>
      </motion.div>

      <p className="mt-6 text-gray-400 text-center">
        {isListening ? 'Listening...' : 'Click to start speaking'}
      </p>
    </div>
  );
}