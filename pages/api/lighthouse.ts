import { NextApiRequest, NextApiResponse } from 'next';

// Fonction qui gère la méthode GET pour récupérer les données depuis PageSpeed Insights API
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;  // Remplacez par votre clé API
  const url = 'https://seranya.fr/';
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${API_KEY}&category=performance&category=accessibility&category=seo`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const { lighthouseResult } = data;
    const metrics = {
      performance: lighthouseResult.categories.performance.score * 100,
      accessibility: lighthouseResult.categories.accessibility.score * 100,
      seo: lighthouseResult.categories.seo.score * 100,
    };

    return res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching Lighthouse metrics from PageSpeed API:', error);
    return res.status(500).json({ error: 'Failed to fetch Lighthouse metrics' });
  }
}

// Fonction par défaut pour gérer les requêtes HTTP
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
