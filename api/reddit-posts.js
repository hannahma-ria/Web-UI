export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const after = req.query.after || '';
    const url = `https://www.reddit.com/r/data/hot.json?limit=12&after=${after}`;

    // Use native fetch in Node 18+ (Vercel runtime)
    const redditRes = await fetch(url, {
      headers: {
        'User-Agent': 'ProtegrityFeed/1.0 (https://yourdomain.com)', // required
        'Accept': 'application/json',
      },
    });

    if (!redditRes.ok) {
      console.error('Reddit API returned error', redditRes.status);
      return res.status(500).json({ error: 'Reddit API error', status: redditRes.status });
    }

    const data = await redditRes.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('Server error fetching Reddit:', err);
    res.status(500).json({ error: 'Failed to fetch Reddit posts' });
  }
}
