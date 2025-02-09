import { Agent } from "@covalenthq/ai-agent-sdk";
import { getTweetsTool } from "../tools/getTweets.js";
import { rugCheckTool } from "../tools/rugCheck.js";
// import { tokenAnalysisTool } from '../tools/tokenAnalysis';

export const scannerAgent = new Agent({
  name: "Scanner Agent",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4o-mini",
  },
  description:
    "Scans Twitter for memecoin mentions and analyzes them for potential opportunities",
  // instructions: [
  //   "Monitor Twitter accounts for memecoin token mentions",
  //   "Extract token addresses from tweets. It is very visibly mentioned in the tweets.",
  //   "Analyze tokens for rug pull risks",
  //   "Do not proceed with the token, if its token address is not mentioned in the tweet.",
  //   "Go with the token in the tweet",
  // ],
  instructions: [
    "Monitor Twitter accounts for memecoin token mentions",
    "Extract token addresses from tweets.",
    "If no token address is found, log the tweet but do not proceed.",
    "Analyze tokens for rug pull risks only when an address is found.",
  ],

  // tools: [getTweetsTool, rugCheckTool], // , tokenAnalysisTool
  tools: {
    getTweetsTool,
    rugCheckTool,
  },
});
