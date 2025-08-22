export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const after = req.query.after || '';
    const url = `https://www.reddit.com/r/data/hot.json?limit=12&after=${after}`;

    const redditRes = await fetch(url, {
      headers: {
        'User-Agent': 'ProtegrityFeed/1.0 (+https://yourdomain.com)',
      },
    });

    console.log('Reddit status code:', redditRes.status);
    const text = await redditRes.text();
    console.log('Reddit response text:', text.substring(0, 500)); // log first 500 chars

    if (!redditRes.ok) {
      throw new Error(`Reddit API error: ${redditRes.status}`);
    }

    const data = JSON.parse(text);
    res.status(200).json(data);
  } catch (error) {
    console.error('Reddit fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch Reddit posts' });
  }
}
