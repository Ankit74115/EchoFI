// import { createTool } from '@covalenthq/ai-agent-sdk';
// import { z } from 'zod';
// import { CovalentService } from '../../services/covalentService';

// const covalentService = new CovalentService();

// export const tokenAnalysisTool = createTool({
//   id: 'analyze-token',
//   description: 'Analyzes token metrics and trading patterns using Covalent AI',
//   schema: z.object({
//     tokenAddress: z.string().describe('The token address to analyze'),
//     tweetId: z.string().describe('The ID of the tweet mentioning the token'),
//   }),
//   execute: async ({ tokenAddress, tweetId }) => {
//     return await covalentService.analyzeToken(tokenAddress, tweetId);
//   },
// });