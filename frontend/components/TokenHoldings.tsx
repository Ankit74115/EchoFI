import { motion } from "framer-motion";

interface Token {
  symbol: string;
  balance: string;
  value: string;
}

interface TokenHoldingsProps {
  tokens: Token[];
}

export default function TokenHoldings({ tokens }: TokenHoldingsProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-white mb-4">Token Holdings</h3>
      <div className="space-y-3">
        {tokens?.map((token, index) => (
          <motion.div
            key={token.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="text-white font-medium">{token.symbol}</p>
              <p className="text-sm text-gray-400">{token.balance}</p>
            </div>
            <p className="text-blue-400 font-semibold">{token.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
