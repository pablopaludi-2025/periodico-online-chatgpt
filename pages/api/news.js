import xml2js from 'xml2js';

export default async function handler(req, res) {
  const RSS_URL = 'https://www.pagina12.com.ar/rss/secciones/economia/notas';

  try {
    const response = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AcmeBot/1.0)' }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xmlText);

    const items = (result.rss?.channel?.[0]?.item || []).map(item => ({
      title:   item.title[0],
      link:    item.link[0],
      pubDate: item.pubDate[0]
    }));

    // Vercel cache: revalida cada 60 segundos
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(items);

  } catch (err) {
    console.error('API /api/news error:', err);
    res.status(500).json({ error: err.message });
  }
}
