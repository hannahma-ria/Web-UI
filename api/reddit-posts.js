import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const after = req.query.after || '';
    const url = `https://www.reddit.com/r/data/hot.json?limit=12&after=${after}`;
    const redditRes = await fetch(url);
    if (!redditRes.ok) throw new Error(`Reddit API error: ${redditRes.status}`);

    const data = await redditRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Reddit fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch Reddit posts' });
  }
}
