// // import { LLM, Agent, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
// // import { TokenBalancesTool, NFTHoldingsTool, TransactionHistoryTool } from "";
// // import dotenv from "dotenv";
// // dotenv.config();

// // const apiKey = process.env.GOLDRUSH_API_KEY;
// // // const llm = new LLM({
// // //     provider: "OPEN_AI",
// // //     name: "gpt-4o-mini",
// // //     apiKey: process.env.OPENAI_API_KEY,
// // // });

// // const blockchainResearchAgent = new Agent({
// //     name: "Blockchain Research Agent",
// //     model: {
// //         provider: "OPEN_AI",
// //         name: "gpt-4o-mini",
// //     },
// //     description: "Analyzes wallet activities using GoldRush tools.",
// //     tools: {
// //         tokenBalances: new TokenBalancesTool(apiKey),
// //         nftBalances: new NFTHoldingsTool(apiKey),
// //         transactions: new TransactionHistoryTool(apiKey),
// //     },
// // });

// // const workflow = new ZeeWorkflow({
// //     description: "A workflow for analyzing blockchain wallet activity.",
// //     output: "The goal of this workflow is to retrieve and analyze wallet activity using GoldRush tools.",
// //     agents: { blockchainResearchAgent },
// // });

// // (async () => {
// //     const result = await ZeeWorkflow.run(workflow);
// //     console.log("Workflow Result:", result);
// // })();


// // new
// import { Agent, ZeeWorkflow, createTool } from "@covalenthq/ai-agent-sdk";
// import { getTweetTool } from "./get-tweets";
// // import { getLatestTokenCheck } from "./rug-check";
// import "dotenv/config";

// // Step 2: Create the Agent
// const TwitterAgent = new Agent({
//     name: "TwitterAgent",
//     model: {
//         provider: "OPEN_AI",
//         name: "gpt-4o-mini",
//     },
//     description: "You are an AI agent that needs to tell me if this tweet is about buying a token. Return me either the address of the solana token, or return me null if you cant find a solana token address in this tweet. Only return if it says it is a bull post. The token address will be very visible in the tweet.",
//     tools: {
//         getTweet: getTweetTool, // Use an object with named keys
//     },
// });

// // const SnipeTokenAgent = new Agent({
// //     name: "SnipeTokenAgent",
// //     model: {
// //         provider: "OPEN_AI",
// //         name: "gpt-4o-mini",
// //     },
// //     description: "You are an agent that track new tokens added to the raydium pool and identify potential rug pulls using the tool. Once you find new tokens get the token data from TwitterAgent give me summary of the token which I need to buy considerring the market sentiment of the token. Give me a single token and its address which I need to buy.",
// //     tools: {
// //         snipeToken: getLatestTokenCheck
// //     },

// // });


// // Create the Snipe Token Agent with improved error handling
// // const SnipeTokenAgent = new Agent({
// //     name: "SnipeTokenAgent",
// //     model: {
// //         provider: "OPEN_AI",
// //         name: "gpt-4o-mini",
// //     },
// //     description: "Monitor Raydium pool for new tokens and evaluate their potential. Analyze token data and market sentiment to identify promising investment opportunities. Provide detailed analysis of token metrics and rug pull risk assessment.",
// //     tools: {
// //         snipeToken: getLatestTokenCheck
// //     },
// // });

// // Create the Workflow with better error handling and structured output
// const zee = new ZeeWorkflow({
//     description: "Analyze the tweet about token.",
//     output: "The token and token address from the tweet.",
//     agents: { TwitterAgent },
// });

// // // Step 3: Create the Workflow
// // const zee = new ZeeWorkflow({
// //     description: "A simple workflow to give best token to buy at the current time so that we can make profit from it considerering the twitter mentions and fetching from raydium pools and doing a rug check. Give me the token and token address to buy to make maximum profit from the above agents data.",
// //     output: "Solana token name and address to buy tokens.",
// //     agents: { TwitterAgent, SnipeTokenAgent },
// // });

// // Then run it without passing any output object
// (async function main() {
//     // Run without any additional state (it will use the default state)
//     const result = await ZeeWorkflow.run(zee);
    
//     // console.log(result);
// })();

// import { Agent } from "@covalenthq/ai-agent-sdk";
// import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
// import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
// import { TokenBalancesTool } from "@covalenthq/ai-agent-sdk";

// const apiKey = process.env.GOLDRUSH_API_KEY;

// const tools = {
//   tokenBalances: new TokenBalancesTool(apiKey),
// };

// const agent = new Agent({
//   name: "token balance fetcher",
//   model: {
//     provider: "OPEN_AI",
//     name: "gpt-4o-mini",
//   },
//   description: "A tool to fetch ERC20 token balances.",
//   instructions: [
//     "Use the tokenBalances tool to fetch all ERC20 token balances",
//     "Return only the token symbols and their corresponding balances",
//     "Format the response as: TOKEN_SYMBOL: BALANCE",
//     "Do not add any additional commentary"
//   ],
//   tools,
// });

// async function main() {
//   const state = StateFn.root(agent.description);
//   state.messages.push(
//     user(
//       `Use tokenBalances tool to fetch balances for address 0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97 on ethereum-mainnet. Return only token symbols and balances.`
//     )
//   );

//   try {
//     const result = await agent.run(state);
//     if (result.status === "failed") {
//       throw new Error("Failed to fetch token balances");
//     }
//     console.log("Token Balances:");
//     console.log(result.messages[result.messages.length - 1]?.content);
//   } catch (error) {
//     console.error("Error fetching balances:", error);
//   }
// }

// main();

import { ZeeWorkflow } from '@covalenthq/ai-agent-sdk';
import { scannerAgent } from './zee/agents/scannerAgent';
import { traderAgent } from './zee/agents/traderAgent';

const zee = new ZeeWorkflow({
  description: 'Memecoin Trading Workflow',
  output: 'The goal is to identify and trade promising memecoin opportunities while avoiding scams. If rug check is successful then execute trade with that token address.',
  agents: { scannerAgent, traderAgent },
});

async function main() {
  console.log('Starting Memecoin Trading ZEE Workflow...');
  
  try {
    const result = await ZeeWorkflow.run(zee);
    console.log('Workflow completed successfully:');
    console.log(result);
  } catch (error) {
    console.error('Workflow error:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});