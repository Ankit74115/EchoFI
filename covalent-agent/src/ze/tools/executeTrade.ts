import { createTool } from '@covalenthq/ai-agent-sdk';
import { z } from 'zod';
import { TradingService } from '../../services/tradingService';
import { solanaConnection } from '../../config';

const tradingService = new TradingService(solanaConnection);

export const executeTradeTool = createTool({
  id: 'execute-trade',
  description: 'Executes a trade to buy a memecoin token',
  schema: z.object({
    tokenAddress: z.string().describe('The token address to trade'),
  }),
  execute: async (params: unknown) => {
    // Validate and extract the parameters using zod
    // console.log("executeTradeTool received params:", params);

    const { tokenAddress } = z
      .object({
        tokenAddress: z.string(),
      })
      .parse(params);

    return await tradingService.executeTrade(tokenAddress);
  },
});
