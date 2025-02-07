import axios from 'axios';
import { Tweet } from '../types';
import { TWITTER_ACCOUNTS as userIds } from '../config';

const TWEET_MAX_TIME_MS = 24 * 60 * 60 * 1000;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSingleTweet(userId: string): Promise<Tweet[]> {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `https://twitter241.p.rapidapi.com/user-tweets?user=${userId}&count=20`,
    headers: { 
      'x-rapidapi-host': 'twitter241.p.rapidapi.com', 
      'x-rapidapi-key': process.env.RAPID_API_KEY
    }
  };

  const response = await axios.request(config);
  const tweets: Tweet[] = [];

  const entries = response.data.result.timeline.instructions
    .find((instruction: any) => instruction.entries)?.entries || [];

  entries.forEach((entry: any) => {
    try {
      if (entry.content?.itemContent?.__typename === "TimelineTweet") {
        const tweetResult = entry.content.itemContent.tweet_results.result;
        
        tweets.push({
          contents: tweetResult.legacy.full_text,
          id: tweetResult.rest_id,
          createdAt: tweetResult.legacy.created_at
        });
      }
    } catch(e) {
      console.error("Tweet parsing error:", e);
    }
  });

  return tweets.filter(x => new Date(x.createdAt).getTime() > Date.now() - TWEET_MAX_TIME_MS);
}

export async function getTweets() {
  //const userIds = ["1545317129066405893"]; // Add more Twitter accounts to monitor
  const results: Record<string, any> = {};

  for (const userId of userIds) {
    await delay(1000); // Rate limiting
    try {
      const tweets = await getSingleTweet(userId);
      results[userId] = tweets;
    } catch (error: any) {
      console.error(`Error fetching tweets for user ${userId}:`, error.message);
      results[userId] = { error: "Failed to fetch tweets" };
    }
  }

  return JSON.stringify(results);
}