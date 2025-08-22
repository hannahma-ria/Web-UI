let requestCount = 0;

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  requestCount = 0;
  res.status(200).json({ message: 'Request count reset' });
}
