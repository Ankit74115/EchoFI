import { Agent } from "@covalenthq/ai-agent-sdk";
import { createSmartContact } from "../tools/ethSmartContract.js";
import { analyzeTrends } from "../tools/analyzeTrend.js";
import { deployMemecoin } from "../tools/deployMemecoin.js";

export const ethMemecoin = new Agent({
  name: "Twitter scanner and Memecoin Generator",
  model: {
    provider: "OPEN_AI",
    name: "gpt-4o-mini",
  },
  description:
    "This scans the viral memes and news from twitter to create memecoins. Creates and deploys an ERC20 memecoin based on Twitter trends. Once token is deployed stop the execution",
  instructions: [
    "Monitor Twitter for trending memes, news not just related to crypto.",
    "Dont create a memecoin if it already exists. Create a complete unique and different memecoin",
    "Give a name and symbol based on trends.",
    "Once token is deployed, Stop the agent.No need to deploy it twice.",
    "Once coin is deployed stop the zee workflow",
  ],
  tools: {
    analyzeTrends,
    createSmartContact,
    deployMemecoin,
    // checkExistingMemecoin,
  },
});
