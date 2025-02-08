"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  ArrowRightLeft,
  BarChart3,
  Shield,
  Coins,
  Mic,
  ChevronRight,
  Globe,
  Layers,
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Wallet className="w-6 h-6 text-blue-600" />,
      title: "Wallet Management",
      description:
        "Securely manage your crypto wallets and check balances with simple voice commands",
    },
    {
      icon: <ArrowRightLeft className="w-6 h-6 text-blue-600" />,
      title: "Token Swaps",
      description: "Execute token swaps across multiple DEXs with natural language instructions",
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-600" />,
      title: "Market Analysis",
      description: "Get real-time market insights and price analysis through voice interaction",
    },
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: "Secure Transactions",
      description: "Enhanced security with voice confirmation for all transactions",
    },
    {
      icon: <Coins className="w-6 h-6 text-blue-600" />,
      title: "DeFi Operations",
      description: "Manage yield farming, lending, and borrowing through voice commands",
    },
    {
      icon: <Mic className="w-6 h-6 text-blue-600" />,
      title: "Natural Interaction",
      description: "Interact with DeFi protocols using natural language voice commands",
    },
  ];

  const benefits = [
    {
      title: "Voice-First Experience",
      description:
        "No more complex interfaces. Just speak naturally to execute any DeFi operation.",
      image:
        "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Smart Portfolio Management",
      description: "Get instant insights about your DeFi portfolio and make informed decisions.",
      image:
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800",
    },
    {
      title: "Seamless Integration",
      description: "Works with major DeFi protocols and blockchain networks out of the box.",
      image:
        "https://images.unsplash.com/photo-1644088379091-d574269d422f?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000"
            alt="AI and DeFi Background"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 to-blue-100/90"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <Image
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200"
                alt="AI Assistant"
                width={140}
                height={140}
                className="rounded-full border-4 border-blue-500/50 shadow-lg"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 leading-tight">
              Your Voice-Powered DeFi Assistant
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Experience the future of DeFi with our AI-powered voice assistant. Execute trades,
              manage assets, and navigate the blockchain ecosystem – all through natural
              conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/language"
                  className="inline-flex items-center px-8 py-4 border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 text-lg font-medium rounded-full text-white transition-all duration-300 shadow-lg"
                >
                  Try Voice Assistant
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <a
                  href="#features"
                  className="inline-flex items-center px-8 py-4 border-2 border-purple-500 hover:bg-purple-500 hover:text-white text-lg font-medium rounded-full text-purple-700 transition-all duration-300 shadow-lg"
                >
                  Learn More
                  <ChevronRight className="ml-2 w-5 h-5" />
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          {benefits.map((benefit, index) => (
            <motion.div key={index} whileHover={{ scale: 1.05 }} className="relative group">
              <div className="relative h-64 mb-6 rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={benefit.image || "/placeholder.svg"}
                  alt={benefit.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">
                  {benefit.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_70%)]"></div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
        >
          Powerful Features at Your Command
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl bg-white shadow-lg border border-gray-200 hover:border-blue-400 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-700">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Multilingual & Multi-Network Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Multilingual Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 bg-gradient-to-r from-purple-200 to-blue-200 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-4">
              <Globe className="w-12 h-12 text-blue-700" />
              <h3 className="text-3xl font-bold text-blue-700">Multilingual AI</h3>
            </div>
            <p className="mt-4 text-gray-700 text-lg">Our assistant speaks your language:</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Hindi", "Korean", "English", "Arabic", "Chinese", "Dutch"].map((lang) => (
                <span
                  key={lang}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold"
                >
                  {lang}
                </span>
              ))}
            </div>
          </motion.div>
          {/* Multi-Network Card */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex-1 bg-gradient-to-r from-green-200 to-teal-200 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-center gap-4">
              <Layers className="w-12 h-12 text-green-700" />
              <h3 className="text-3xl font-bold text-green-700">Multi-Network Trading</h3>
            </div>
            <p className="mt-4 text-gray-700 text-lg">Execute trades on top blockchain networks:</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Solana", "Base", "Ethereum"].map((network) => (
                <span
                  key={network}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold"
                >
                  {network}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000"
            alt="DeFi Background"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-100/90 to-white/90"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 leading-tight">
            Ready to Transform Your DeFi Experience?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the future of decentralized finance with voice-powered interactions. Start managing
            your DeFi portfolio with just your voice.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/language"
              className="inline-flex items-center px-8 py-4 border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 text-lg font-medium rounded-full text-white transition-all duration-300 shadow-lg"
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
