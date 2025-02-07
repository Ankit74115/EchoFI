import { Agent } from '@covalenthq/ai-agent-sdk';
import { getTweetsTool } from '../tools/getTweets';
import { rugCheckTool } from '../tools/rugCheck';
// import { tokenAnalysisTool } from '../tools/tokenAnalysis';

export const scannerAgent = new Agent({
  name: 'Scanner Agent',
  model: {
    provider: 'OPEN_AI',
    name: 'gpt-4o-mini',
  },
  description: 'Scans Twitter for memecoin mentions and analyzes them for potential opportunities',
  instructions: [
    'Monitor Twitter accounts for memecoin token mentions',
    'Extract token addresses from tweets. It is very visibly mentioned in the tweets.',
    'Analyze tokens for rug pull risks',
  ],
  // tools: [getTweetsTool, rugCheckTool], // , tokenAnalysisTool
  tools: {
    getTweets: getTweetsTool,  
    rugCheck: rugCheckTool,    
  },
});