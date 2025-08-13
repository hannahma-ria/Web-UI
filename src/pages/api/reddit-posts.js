export default async function handler(req, res) {
  try {
    const after = req.query.after || '';
    const url = `https://www.reddit.com/r/data/hot.json?limit=12&after=${after}`;
    const redditRes = await fetch(url);

    if (!redditRes.ok) {
      return res.status(redditRes.status).json({ error: 'Reddit API error' });
    }

    const data = await redditRes.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Reddit fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch Reddit posts' });
  }
}
