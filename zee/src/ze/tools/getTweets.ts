import { createTool } from '@covalenthq/ai-agent-sdk';
import { z } from 'zod';
import { getTweets as fetchTweets } from '../../services/twitterService';

export const getTweetsTool = createTool({
  id: 'get-tweets',
  description: 'Fetches recent tweets from specified Twitter accounts to find memecoin mentions',
  schema: z.object({}),
  execute: async () => {
    const tweetsData = await fetchTweets();
    return tweetsData;
  },
});