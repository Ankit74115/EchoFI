import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Default RPC endpoint and WebSocket endpoint (using the environment variables)
const RPC_ENDPOINT = process.env.RPC_ENDPOINT ?? 'https://mainnet.helius-rpc.com/?api-key=cd716db1-6133-46b4-9f2f-59f5b72c329b';
const RPC_WEBSOCKET_ENDPOINT = process.env.RPC_WEBSOCKET_ENDPOINT ?? 'wss://mainnet.helius-rpc.com/?api-key=cd716db1-6133-46b4-9f2f-59f5b72c329b';

// Establish the Solana connection
export const solanaConnection = new Connection(RPC_ENDPOINT, {
  wsEndpoint: RPC_WEBSOCKET_ENDPOINT,
});

// The PublicKey for rayFee (trusted constant)
export const rayFee = new PublicKey('7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5');


// Validate required environment variables
// const requiredEnvVars = ['RAPID_API_KEY', 'COVALENT_API_KEY', 'SOLANA_RPC_URL'];
// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     throw new Error(`Missing required environment variable: ${envVar}`);
//   }
// }

// Twitter configuration
// export const TWITTER_ACCOUNTS = [
//   "1545317129066405893", // Add more Twitter accounts to monitor
// ];

export const TWITTER_ACCOUNTS = [
  "1591438878350589954", // Add more Twitter accounts to monitor
];



// Trading configuration
export const MINIMUM_LIQUIDITY = 5; // Minimum liquidity in SOL
export const MINIMUM_RUGCHECK_SCORE = 70; // Minimum acceptable rug check score
export const TRADE_AMOUNT = 0.1; // Amount of SOL to trade
export const MAX_SLIPPAGE = 0.02; // Maximum acceptable slippage (2%)