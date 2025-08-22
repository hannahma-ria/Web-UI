export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userMessage = req.body.message || '';
  const reply = `You said: "${userMessage}". This is a mock AI response for demo purposes.`;

  res.status(200).json({ reply });
}
