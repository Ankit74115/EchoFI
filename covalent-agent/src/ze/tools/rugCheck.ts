import { createTool } from '@covalenthq/ai-agent-sdk';
import { z } from 'zod';
import { checkRug } from '../../services/rugCheckService';

export const rugCheckTool = createTool({
  id: 'rug-check',
  description: 'Analyzes a token for potential rug pull risks',
  schema: z.object({
    tokenAddress: z.string().describe('The Solana token address to check'),
  }),
  execute: async (params: unknown): Promise<string> => {  // Ensure return type is string
    const { tokenAddress } = z
      .object({
        tokenAddress: z.string(),
      })
      .parse(params); // Ensures type safety
    
    const result = await checkRug(tokenAddress);
    if (!result) {
      return 'Unable to perform rug check analysis';
    }
    
    return JSON.stringify({
      score: result.score,
      risk: result.risk,
      warnings: result.warnings,
      lastUpdated: result.lastUpdated
    }); // Convert object to string
  }
});
