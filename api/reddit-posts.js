import fetch from 'node-fetch';

let cachedData = null;
let cacheTime = 0;
const CACHE_DURATION_MS = 60 * 1000; // 1 minute cache

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = Date.now();
  const after = req.query.after || '';

  // Use cached data if available and fresh
  if (cachedData && now - cacheTime < CACHE_DURATION_MS && !after) {
    return res.status(200).json(cachedData);
  }

  try {
    const url = `https://www.reddit.com/r/data/hot.json?limit=12&after=${after}`;
    
    const redditRes = await fetch(url, {
      headers: {
        'User-Agent': 'ProtegrityFeed/1.0 (https://yourdomain.com)',
      },
    });

    if (!redditRes.ok) {
      const text = await redditRes.text();
      console.error('Reddit fetch error:', redditRes.status, text);
      return res.status(500).json({ error: 'Reddit API error', status: redditRes.status });
    }

    const data = await redditRes.json();

    // Cache only when not using "after" param (first page)
    if (!after) {
      cachedData = data;
      cacheTime = now;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Server error fetching Reddit:', err);
    res.status(500).json({ error: 'Failed to fetch Reddit posts' });
  }
}
