let requestCount = 0;

function predictResourceAllocation(count) {
  if (count < 10) {
    return { level: 'Low', message: 'Normal resource allocation.' };
  } else if (count < 20) {
    return { level: 'Medium', message: 'Prepare to scale up resources.' };
  } else {
    return { level: 'High', message: 'Scale up servers immediately!' };
  }
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  requestCount++;
  const prediction = predictResourceAllocation(requestCount);
  res.status(200).json({ requestCount, prediction });
}
