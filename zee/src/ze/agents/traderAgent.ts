import { Agent } from '@covalenthq/ai-agent-sdk';
import { executeTradeTool } from '../tools/executeTrade';
import { rugCheckTool } from '../tools/rugCheck';

export const traderAgent = new Agent({
  name: 'Trader Agent',
  model: {
    provider: 'OPEN_AI',
    name: "gpt-4o-mini",
  },
  description: 'Executes trades for promising memecoin opportunities',
  instructions: [
    'Extract token address from the provided data before executing trade.',
    'Token address should be like this format: Dy7M5B3Z5GnyhyHKkcHRFpYxw6eyiF1gqsDTBiT4t4oQ or pump at the end if mentioned in tweet',
    'Review token analysis results',
    'Verify trading conditions are met',
    'Execute trades for qualified tokens',
    'Monitor trade execution and confirmation',
  ],
  tools: { 
    executeTrade: executeTradeTool
  },
});