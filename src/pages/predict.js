let requestLog = [];
const MAX_LOG_LENGTH = 10;

function predictResourceAllocation(requestLog) {
  if (requestLog.length === 0) {
    return { level: 'Low', message: 'No data, normal resource allocation.' };
  }

  const avg = requestLog.reduce((a, b) => a + b, 0) / requestLog.length;
  const trend = requestLog[requestLog.length - 1] - requestLog[0];

  if (avg < 10 && trend <= 0) {
    return { level: 'Low', message: 'Stable low load, normal resources.' };
  } else if (avg < 20 && trend >= 0) {
    return { level: 'Medium', message: 'Load increasing, prepare to scale.' };
  } else {
    return { level: 'High', message: 'High load or rising quickly, scale up now!' };
  }
}

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currentRequestCount } = req.body;
  if (typeof currentRequestCount !== 'number') {
    return res.status(400).json({ error: 'Invalid request count' });
  }

  requestLog.push(currentRequestCount);
  if (requestLog.length > MAX_LOG_LENGTH) requestLog.shift();

  const prediction = predictResourceAllocation(requestLog);

  res.status(200).json({ prediction });
}
