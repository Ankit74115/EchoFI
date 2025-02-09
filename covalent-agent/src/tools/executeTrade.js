import { createTool } from "@covalenthq/ai-agent-sdk";
import { z } from "zod";
import { executeTrade } from "../services/tradingService.js";
import { solanaConnection } from "../config.js";

export const executeTradeTool = createTool({
  id: "execute-trade",
  description: "Executes a trade to buy a memecoin token",
  schema: z.object({
    tokenAddress: z.string().describe("The token address to trade"),
  }),
  execute: async (params) => {
    // Validate and extract the parameters using zod
    console.log("executeTradeTool received params:", params);

    const { tokenAddress } = z
      .object({
        tokenAddress: z.string(),
      })
      .parse(params);

    return await executeTrade(tokenAddress);
  },
});
