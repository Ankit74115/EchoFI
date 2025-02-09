import { Agent } from "@covalenthq/ai-agent-sdk";
import { executeTradeTool } from "../tools/executeTrade.js";
import { getTweetsTool } from "../tools/getTweets.js";
import { rugCheckTool } from "../tools/rugCheck.js";

export const traderAgent = new Agent({
  name: "Trader Agent",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4o-mini",
  },
  description: "Executes trades for promising memecoin opportunities",
  // instructions: [
  //   "Strictly get token address from the tweet. Extract token address from the provided data before executing trade.",
  //   "Token address should be like this format: Dy7M5B3Z5GnyhyHKkcHRFpYxw6eyiF1gqsDTBiT4t4oQ at the end if mentioned in tweet",
  //   "Review token analysis results",
  //   "Don't execute trade until you get the token address from the tweet",
  //   "Verify trading conditions are met",
  //   "Execute trades for qualified tokens",
  //   "Monitor trade execution and confirmation",
  // ],
  instructions: [
    "Strictly get token address from the tweet.",
    "If no token address is provided, do not execute trade.",
    "Verify trading conditions before executing trades.",
  ],
  tools: {
    getTweetsTool,
    //executeTradeTool,
  },
});
