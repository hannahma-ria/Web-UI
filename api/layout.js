export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const screenWidth = req.body.screenWidth || 1024;
  let layout = 'desktop';

  if (screenWidth <= 575) layout = 'xs';
  else if (screenWidth <= 767) layout = 'sm';
  else if (screenWidth <= 991) layout = 'md';
  else if (screenWidth <= 1199) layout = 'lg';
  else if (screenWidth <= 1399) layout = 'xl';
  else layout = 'xxl';

  res.status(200).json({ layout });
}
