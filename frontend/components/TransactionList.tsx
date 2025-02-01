import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Transaction {
  hash: string;
  value: string;
  timestamp: number;
  type: 'send' | 'receive';
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => (
        <motion.div
          key={tx.hash}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-700 rounded-lg p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${
              tx.type === 'send' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
            }`}>
              {tx.type === 'send' ? <FaArrowUp /> : <FaArrowDown />}
            </div>
            <div>
              <p className="text-sm text-gray-300">{tx.hash}</p>
              <p className="text-xs text-gray-400">
                {new Date(tx.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-semibold ${
              tx.type === 'send' ? 'text-red-400' : 'text-green-400'
            }`}>
              {tx.type === 'send' ? '-' : '+'}{tx.value}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}