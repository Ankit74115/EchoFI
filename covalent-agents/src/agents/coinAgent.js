import { Agent } from "@covalenthq/ai-agent-sdk";
import { createSmartContact } from "../tools/ethSmartContract.js";
import { analyzeTrends } from "../tools/analyzeTrend.js";

export const ethMemecoin = new Agent({
  name: "Ethereum Memecoin Generator",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4o-mini",
  },
  description: "Creates and deploys an ERC20 memecoin based on Twitter trends.",
  instructions: [
    "Monitor Twitter for trending memes, news.",
    "Dont create a memecoin if it already exists.",
    "Give a name and symbol based on trends.",
    "Analyze tokens for rug pull risks before launching.",
  ],
  tools: {
    analyzeTrends,
    createSmartContact,
    // deployMemecoin,
    // checkExistingMemecoin,
  },
});
