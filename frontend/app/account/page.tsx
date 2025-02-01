"use client";

import axios from "axios";
import { ethers } from "ethers";
import { useState } from "react";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";
import { FaWallet, FaEthereum, FaSearch, FaImage } from "react-icons/fa";

import TokenHoldings from "../../components/TokenHoldings";
import NetworkSelector from "../../components/NetworkSelector";
import TransactionList from "../../components/TransactionList";

const API_BASE_URL = "http://localhost:3001";

const NETWORK_MAP = {
  base: "base-mainnet",
  sepolia: "base-sepolia",
};

type TransactionType = {
  hash: string;
  value: string;
  timestamp: number;
  type: "send" | "receive";
};

type NftType = {
  contractAddress: string;
  tokenId: string;
  image: string;
  name: string;
  description: string;
  symbol: string;
};

export default function WalletPage() {
  const [address, setAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<"base" | "sepolia">("sepolia");
  const [isLoading, setIsLoading] = useState(false);
  const [walletData, setWalletData] = useState<{
    balance: string;
    transactions: TransactionType[];
    tokens: {
      symbol: string;
      balance: string;
      value: string;
    }[];
    nfts: NftType[];
  } | null>(null);

  const fetchAccountData = async () => {
    if (!ethers.isAddress(address)) {
      toast.error("Please enter a valid Ethereum address");
      return;
    }

    setIsLoading(true);

    try {
      const chainParam = NETWORK_MAP[selectedNetwork];

      // Fetch balance
      const balanceResponse = await axios.get(`${API_BASE_URL}/getbalance`, {
        params: { userAddress: address, chain: chainParam },
      });
      const ethBalance = balanceResponse.data;

      // Fetch transactions
      const txResponse = await axios.get(`${API_BASE_URL}/gettransactions`, {
        params: { userAddress: address, chain: chainParam },
      });
      const transactions: TransactionType[] = txResponse.data.transfers?.map((tx: any) => ({
        hash: tx.hash,
        value: tx.value,
        timestamp: tx.blockTimestamp ? new Date(tx.blockTimestamp).getTime() : 0,
        type: tx.from.toLowerCase() === address.toLowerCase() ? "send" : "receive",
      }));

      // Fetch tokens
      const tokensResponse = await axios.get(`${API_BASE_URL}/gettokens`, {
        params: { userAddress: address, chain: chainParam },
      });

      const tokens = tokensResponse.data?.tokenBalances?.map((token: any) => ({
        symbol: token.contractAddress.slice(0, 6).toUpperCase(),
        balance: token.tokenBalance,
        value: token.tokenBalance,
      }));

      // Fetch NFTs
      const nftsResponse = await axios.get(`${API_BASE_URL}/getnfts`, {
        params: { userAddress: address, chain: chainParam },
      });

      const nfts: NftType[] = nftsResponse.data?.map((nft: any) => ({
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
        image: nft.gateway || nft.image,
        name: nft.name || `#${nft.tokenId}`,
        description: nft.description || "No description available",
        symbol: nft.symbol || "NFT",
      }));

      // Add ETH to tokens list
      tokens?.unshift({
        symbol: "ETH",
        balance: ethBalance,
        value: ethBalance,
      });

      setWalletData({
        balance: `${ethBalance} ETH`,
        transactions: transactions.slice(0, 20),
        tokens,
        nfts: nfts || [],
      });
      toast.success("Wallet data fetched successfully");
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      toast.error("Error fetching wallet data");
    } finally {
      setIsLoading(false);
    }
  };

  const NftGallery = ({ nfts }: { nfts: NftType[] }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {nfts.map((nft, index) => (
        <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
          <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
            {nft.image ? (
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder-nft.png";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaImage className="text-3xl text-gray-400" />
              </div>
            )}
          </div>
          <div className="mt-3">
            <h3 className="text-white font-medium truncate">{nft.name}</h3>
            <p className="text-gray-400 text-sm truncate">{nft.symbol}</p>
            <p className="text-gray-400 text-xs mt-1 truncate">
              {nft.contractAddress.slice(0, 6)}...{nft.contractAddress.slice(-4)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <FaWallet className="text-blue-500" />
          Wallet Explorer
        </h1>
        <p className="text-gray-400 mt-2">Explore wallet details on Base and Sepolia networks</p>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 p-6 rounded-xl shadow-lg mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <NetworkSelector selected={selectedNetwork} onSelect={setSelectedNetwork} />
          <button
            onClick={fetchAccountData}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <FaSearch />
            {isLoading ? "Loading..." : "Search"}
          </button>
        </div>
      </motion.div>

      {/* Wallet Data Display */}
      {walletData && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <FaEthereum className="text-blue-500" />
                Balance
              </h2>
              <p className="text-3xl font-bold text-white">{walletData.balance}</p>
              <TokenHoldings tokens={walletData.tokens} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
              <TransactionList transactions={walletData.transactions} />
            </motion.div>
          </div>

          {walletData.nfts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold text-white mb-4">NFT Collection</h2>
              <NftGallery nfts={walletData.nfts} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
