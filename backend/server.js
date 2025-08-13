import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

let requestCount = 0;

function predictResourceAllocation(requestCount) {
  if (requestCount < 10) {
    return { level: 'Low', message: 'Normal resource allocation.' };
  } else if (requestCount < 20) {
    return { level: 'Medium', message: 'Prepare to scale up resources.' };
  } else {
    return { level: 'High', message: 'Scale up servers immediately!' };
  }
}

// Proxy Reddit posts API (to avoid CORS + rate limits)
app.get('/api/reddit-posts', async (req, res) => {
  try {
    const after = req.query.after || '';
    const url = `https://www.reddit.com/r/data/hot.json?limit=12&after=${after}`;
    const redditRes = await fetch(url);
    if (!redditRes.ok) throw new Error(`Reddit API error: ${redditRes.status}`);
    const data = await redditRes.json();
    res.json(data);
  } catch (error) {
    console.error('Reddit fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch Reddit posts' });
  }
});

app.get('/api/predict', (req, res) => {
  requestCount++;
  const prediction = predictResourceAllocation(requestCount);
  res.json({ requestCount, prediction });
});

app.post('/api/reset', (req, res) => {
  requestCount = 0;
  res.json({ message: 'Request count reset' });
});

// MOCKED chat endpoint for interview/demo
app.post('/chat', (req, res) => {
  const userMessage = req.body.message || '';
  // Simple mock reply echoing user message
  const reply = `You said: "${userMessage}". This is a mock AI response for demo purposes.`;
  res.json({ reply });
});

// MOCKED AI layout variant decision route for demo
app.post('/api/layout', (req, res) => {
  const screenWidth = req.body.screenWidth || 1024;

  let layout = 'desktop'; // default fallback

  if (screenWidth <= 575) {
    layout = 'xs';
  } else if (screenWidth <= 767) {
    layout = 'sm';
  } else if (screenWidth <= 991) {
    layout = 'md';
  } else if (screenWidth <= 1199) {
    layout = 'lg';
  } else if (screenWidth <= 1399) {
    layout = 'xl';
  } else {
    layout = 'xxl';
  }

  res.json({ layout });
});


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;