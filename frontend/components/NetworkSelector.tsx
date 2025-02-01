import { FaEthereum } from 'react-icons/fa';

interface NetworkSelectorProps {
  selected: 'base' | 'sepolia';
  onSelect: (network: 'base' | 'sepolia') => void;
}

export default function NetworkSelector({ selected, onSelect }: NetworkSelectorProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onSelect('sepolia')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          selected === 'sepolia'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        <FaEthereum />
        Sepolia
      </button>
      <button
        onClick={() => onSelect('base')}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          selected === 'base'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
      >
        Base
      </button>
    </div>
  );
}