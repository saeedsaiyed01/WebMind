// services/fetchTweet.js
import { TwitterApi } from 'twitter-api-v2';
import {
  TWITTER_ACCESS_SECRET,
  TWITTER_ACCESS_TOKEN,
  TWITTER_APP_KEY,
  TWITTER_APP_SECRET,
} from "../config.js";

// Simple in-memory cache for tweet texts
const tweetCache = {};

/**
 * Extract tweet ID from a tweet URL.
 */
function extractTweetId(tweetUrl) {
  const match = tweetUrl.match(/status\/(\d+)/);
  return match ? match[1] : null;
}

/**
 * Fetch tweet text using Twitter API v2.
 * @param {string} tweetUrl - The tweet URL.
 * @returns {Promise<string|null>} - The tweet text or null if not found.
 */
export async function fetchTweetText(tweetUrl) {
  const tweetId = extractTweetId(tweetUrl);
  if (!tweetId) {
    console.log("Could not extract tweet ID from URL:", tweetUrl);
    return null;
  }
  
  // Return cached text if available
  if (tweetCache[tweetId]) {
    console.log("Returning cached tweet text for tweet ID:", tweetId);
    return tweetCache[tweetId];
  }
  
  try {
    const client = new TwitterApi({
      appKey: TWITTER_APP_KEY,
      appSecret: TWITTER_APP_SECRET,
      accessToken: TWITTER_ACCESS_TOKEN,
      accessSecret: TWITTER_ACCESS_SECRET,
    });
    
    console.log("Calling Twitter API for tweet ID:", tweetId);
    const tweet = await client.v2.singleTweet(tweetId, { "tweet.fields": "text" });
    const tweetText = tweet.data?.text || null;
    
    if (tweetText) {
      tweetCache[tweetId] = tweetText; // Cache the result
      console.log("Tweet text fetched and cached for tweet ID:", tweetId, tweetText);
    } else {
      console.log("No tweet text returned for tweet ID:", tweetId);
    }
    
    return tweetText;
  } catch (error) {
    console.error("Error fetching tweet from Twitter API:", error);
    return null;
  }
}

/**
 * Retry wrapper with exponential backoff for fetching tweet text.
 * @param {string} tweetUrl
 * @param {number} retries - Number of retries (default: 3)
 * @param {number} delay - Initial delay in ms (default: 2000)
 * @returns {Promise<string|null>}
 */
export async function fetchTweetTextWithRetry(tweetUrl, retries = 3, delay = 2000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`Attempt ${attempt} to fetch tweet for URL: ${tweetUrl}`);
    const tweetText = await fetchTweetText(tweetUrl);
    if (tweetText) {
      return tweetText;
    } else {
      console.warn(`Attempt ${attempt} failed. Retrying in ${delay} ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  return null;
}
