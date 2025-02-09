import { createTool } from "@covalenthq/ai-agent-sdk";
import { z } from "zod";
import { getTrends } from "../services/createMemecoin.js";

export const analyzeTrends = createTool({
  id: "analyze-twitter-trends",
  description:
    "Analyzes the recent trends, viral news, memes and other popular things. Create a name and symbol using that for the memecoin.",
  schema: z.object({}),
  execute: async () => {
    const trends = await getTrends();
    return trends;
  },
});
