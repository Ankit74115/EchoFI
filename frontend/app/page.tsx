'use client';

import { ArrowRight, Wallet, ArrowRightLeft, BarChart3, Shield, Coins, Mic, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const features = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Wallet Management",
      description: "Securely manage your crypto wallets and check balances with simple voice commands"
    },
    {
      icon: <ArrowRightLeft className="w-6 h-6" />,
      title: "Token Swaps",
      description: "Execute token swaps across multiple DEXs with natural language instructions"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Market Analysis",
      description: "Get real-time market insights and price analysis through voice interaction"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Transactions",
      description: "Enhanced security with voice confirmation for all transactions"
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "DeFi Operations",
      description: "Manage yield farming, lending, and borrowing through voice commands"
    },
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Natural Interaction",
      description: "Interact with DeFi protocols using natural language voice commands"
    }
  ];

  const benefits = [
    {
      title: "Voice-First Experience",
      description: "No more complex interfaces. Just speak naturally to execute any DeFi operation.",
      image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Smart Portfolio Management",
      description: "Get instant insights about your DeFi portfolio and make informed decisions.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Seamless Integration",
      description: "Works with major DeFi protocols and blockchain networks out of the box.",
      image: "https://images.unsplash.com/photo-1644088379091-d574269d422f?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
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
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 to-black/90"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Image
                src="https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200"
                alt="AI Assistant"
                width={120}
                height={120}
                className="rounded-full border-4 border-blue-500/50"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              Your Voice-Powered DeFi Assistant
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Experience the future of DeFi with our AI-powered voice assistant. Execute trades, manage assets, and navigate the blockchain ecosystem - all through natural conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/voice"
                className="inline-flex items-center px-8 py-4 border-2 border-blue-500 bg-blue-600 hover:bg-blue-700 text-base font-medium rounded-xl text-white transition-all duration-300 md:text-lg group"
              >
                Try Voice Assistant 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#features"
                className="inline-flex items-center px-8 py-4 border-2 border-purple-500 hover:bg-purple-500/10 text-base font-medium rounded-xl text-white transition-all duration-300 md:text-lg"
              >
                Learn More
                <ChevronRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-50 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.1),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.1),transparent_70%)]"></div>
        </div>
      </div>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit, index) => (
            <div key={index} className="relative group">
              <div className="relative h-64 mb-6 rounded-2xl overflow-hidden">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-blue-400">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]"></div>
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Powerful Features at Your Command
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 border border-gray-700 hover:border-blue-500 transition-all duration-300 backdrop-blur-sm group hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center mb-6 group-hover:bg-blue-600/30 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-blue-300">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000"
            alt="DeFi Background"
            fill
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-gray-900/90"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Ready to Transform Your DeFi Experience?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the future of decentralized finance with voice-powered interactions. Start managing your DeFi portfolio with just your voice.
          </p>
          <Link 
            href="/voice"
            className="inline-flex items-center px-8 py-4 border-2 border-blue-500 bg-blue-600 hover:bg-blue-700 text-base font-medium rounded-xl text-white transition-all duration-300 md:text-lg group"
          >
            Get Started Now 
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}