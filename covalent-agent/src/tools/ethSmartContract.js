import { createTool } from "@covalenthq/ai-agent-sdk";
import { symbol, z } from "zod";
import { createContract } from "../services/createMemecoin.js";

export const createSmartContact = createTool({
  id: "create-smart-contract",
  description: "Creates a solidity smart contract for the memecoin.",
  schema: z.object({
    name: z
      .string()
      .describe("The name for memecoin from the trend. example - Dogecoin"),
    symbol: z.string().describe("The symbol for memecoin. example - DOGE"),
  }),
  execute: async (params) => {
    console.log("Inside create smart contract tool", params);
    const { name, symbol } = z
      .object({
        name: z.string(),
        symbol: z.string(),
      })
      .parse(params);

    console.log(`Token name: ${name}, Symbol: ${symbol}`);
    const result = await createContract(name, symbol);
    if (!result) {
      return "Unable to create contract for the memecoin.";
    }

    return JSON.stringify(result);
  },
});
