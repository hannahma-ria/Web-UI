export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const requestCount = Math.floor(Math.random() * 25); // stateless demo
  let level = 'Low';
  let message = 'Normal resource allocation.';

  if (requestCount >= 10 && requestCount < 20) {
    level = 'Medium';
    message = 'Prepare to scale up resources.';
  } else if (requestCount >= 20) {
    level = 'High';
    message = 'Scale up servers immediately!';
  }

  res.status(200).json({ requestCount, prediction: { level, message } });
}
