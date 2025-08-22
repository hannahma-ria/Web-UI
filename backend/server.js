import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

// Initialize Express app
const app = express();

// Basic middleware setup
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS by default

// Track API request count for demo purposes
let requestCount = 0;

// Configure CORS for specific frontend origins
const allowedOrigins = [
    'https://web-ui-nine-blond.vercel.app', // Production frontend
    'http://localhost:5173'                // Local development
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'], // Allowed HTTP methods
    credentials: true         // Support credentials if needed
}));

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Server is running ✅');
});

// Handle CORS pre-flight requests
app.options('*', cors());

/**
 * Predicts resource allocation based on request volume
 * (Demo functionality for interview assessment)
 */
function predictResourceAllocation(requestCount) {
    if (requestCount < 10) {
        return { level: 'Low', message: 'Normal resource allocation.' };
    } else if (requestCount < 20) {
        return { level: 'Medium', message: 'Prepare to scale up resources.' };
    } else {
        return { level: 'High', message: 'Scale up servers immediately!' };
    }
}

/**
 * Reddit API Proxy Endpoint
 * - Fetches posts from r/data subreddit
 * - Handles pagination with 'after' parameter
 * - Avoids CORS issues for frontend
 */
app.get('/api/reddit-posts', async (req, res) => {
    try {
        const after = req.query.after || ''; // Pagination token
        const url = `https://www.reddit.com/r/data/hot.json?limit=12&after=${after}`;

        const redditRes = await fetch(url);
        if (!redditRes.ok) throw new Error(`Reddit API error: ${redditRes.status}`);

        const data = await redditRes.json();
        res.json(data); // Forward Reddit's response

    } catch (error) {
        console.error('Reddit fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch Reddit posts' });
    }
});

/**
 * Demo endpoint for resource prediction feature
 * - Increments request counter
 * - Returns mock scaling prediction
 */
app.get('/api/predict', (req, res) => {
    requestCount++;
    const prediction = predictResourceAllocation(requestCount);
    res.json({ requestCount, prediction });
});

// Reset the request counter
app.post('/api/reset', (req, res) => {
    requestCount = 0;
    res.json({ message: 'Request count reset' });
});

/**
 * Mock Chatbot Endpoint
 * - Simulates AI response for demo purposes
 * - Returns echoed user message with mock prefix
 */
app.post('/api/chat', (req, res) => {
    const userMessage = req.body.message || '';
    const reply = `You said: "${userMessage}". This is a mock AI response for demo purposes.`;
    res.json({ reply });
});

/**
 * Layout Decision Endpoint
 * - Determines responsive layout variant based on screen width
 * - Mock implementation for demo
 */
app.post('/api/layout', (req, res) => {
    const screenWidth = req.body.screenWidth || 1024;

    // Determine layout based on breakpoints
    let layout = 'desktop'; // Default fallback

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


// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});