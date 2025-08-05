import xml2js from 'xml2js';

export default async function handler(req, res) {
  const RSS_URL = 'https://www.pagina12.com.ar/rss/secciones/economia/notas';
  const UA = 'Mozilla/5.0 (compatible; AcmeBot/1.0)';

  try {
    const response = await fetch(RSS_URL, { headers: { 'User-Agent': UA } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const xml = await response.text();
    const parsed = await new xml2js.Parser().parseStringPromise(xml);
    const items = parsed.rss.channel[0].item || [];

    const news = items.map(item => ({
      title:   item.title[0],
      link:    item.link[0],
      pubDate: item.pubDate[0],
      summary: item.description?.[0] || '',
      source:  'Página12'
    }));

    // Cache en Vercel: revalida cada 60 s
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(news);

  } catch (err) {
    console.error('API /api/news error:', err);
    res.status(500).json({ error: err.message });
  }
}
