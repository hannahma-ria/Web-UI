export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const after = req.query.after || '';

    // Step 1: Get Reddit app-only token
    const auth = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');
    const tokenRes = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!tokenRes.ok) {
      console.error('Reddit token fetch failed', tokenRes.status);
      return res.status(500).json({ error: 'Failed to get Reddit token' });
    }

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

    // Step 2: Fetch posts using Bearer token
    const redditRes = await fetch(`https://oauth.reddit.com/r/data/hot?limit=12&after=${after}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'ProtegrityFeed/1.0 (https://yourdomain.com)',
      },
    });

    if (!redditRes.ok) {
      console.error('Reddit API returned error', redditRes.status);
      return res.status(redditRes.status).json({ error: 'Reddit API error' });
    }

    const data = await redditRes.json();
    res.status(200).json(data);

  } catch (err) {
    console.error('Server error fetching Reddit:', err);
    res.status(500).json({ error: 'Failed to fetch Reddit posts' });
  }
}
