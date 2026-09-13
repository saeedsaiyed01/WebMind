// services/fetchTweet.js
import { TwitterApi } from 'twitter-api-v2';
import { TWITTER_BEARER_TOKEN } from "../config.js";

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
 * Clean HTML string from oEmbed HTML payload to plain text.
 */
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<br\s*[\/]?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&mdash;/g, "—")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/**
 * Fetch tweet text via Twitter's free public oEmbed API (no API key required).
 */
async function fetchTweetViaOembed(tweetUrl) {
  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}&omit_script=true`;
    console.log("Fetching tweet via public oEmbed API:", oembedUrl);

    const response = await fetch(oembedUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    if (!response.ok) {
      console.warn("oEmbed fetch failed status:", response.status);
      return null;
    }

    const data = await response.json();
    if (data && data.html) {
      const cleanText = stripHtml(data.html);
      const author = data.author_name ? `@${data.author_name}` : "";
      const resultText = author ? `${author}: "${cleanText}"` : cleanText;
      console.log("✅ Tweet fetched via oEmbed successfully");
      return resultText;
    }
  } catch (err) {
    console.warn("oEmbed fetch error:", err.message);
  }
  return null;
}

/**
 * Fetch tweet text using Twitter API v2 (if token configured) or oEmbed fallback.
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

  // Method 1: Try free public oEmbed first (fast & reliable without paid API keys)
  const oembedText = await fetchTweetViaOembed(tweetUrl);
  if (oembedText) {
    tweetCache[tweetId] = oembedText;
    return oembedText;
  }

  // Method 2: Try Twitter API v2 if Bearer Token is provided
  if (TWITTER_BEARER_TOKEN && TWITTER_BEARER_TOKEN !== 'your_actual_bearer_token_here') {
    try {
      const client = new TwitterApi(TWITTER_BEARER_TOKEN);
      console.log("Calling Twitter API v2 for tweet ID:", tweetId);
      const tweet = await client.v2.singleTweet(tweetId, {
        "tweet.fields": "text,created_at,author_id"
      });

      const tweetText = tweet.data?.text || null;
      if (tweetText) {
        tweetCache[tweetId] = tweetText;
        console.log("✅ Tweet fetched via Twitter API v2 for ID:", tweetId);
        return tweetText;
      }
    } catch (error) {
      console.error("❌ Twitter API v2 error:", error.message);
    }
  }

  return null;
}

/**
 * Fast retry wrapper for fetching tweet text without Vercel timeouts.
 */
export async function fetchTweetTextWithRetry(tweetUrl, retries = 2, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`Attempt ${attempt} to fetch tweet for URL: ${tweetUrl}`);
    const tweetText = await fetchTweetText(tweetUrl);
    if (tweetText) {
      return tweetText;
    }

    if (attempt < retries) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.error(`Failed to fetch tweet text for: ${tweetUrl}`);
  return null;
}