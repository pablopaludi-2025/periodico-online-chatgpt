// pages/api/news.js
import xml2js from 'xml2js';

const RSS_SOURCES = [
  {
    url: 'https://www.pagina12.com.ar/rss/secciones/economia/notas',
    source: 'Página12'
  },
  {
    url: 'https://www.ambito.com/rss/pages/finanzas.xml',
    source: 'Ámbito - Finanzas'
  },
  {
    url: 'https://www.ambito.com/rss/pages/economia.xml',
    source: 'Ámbito - Economía'
  }
];

export default async function handler(req, res) {
  const UA = 'Mozilla/5.0 (compatible; AcmeBot/1.0)';
  const parser = new xml2js.Parser();

  try {
    // 1) Bajar y parsear cada feed
    const feeds = await Promise.all(RSS_SOURCES.map(async ({ url, source }) => {
      const resp = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!resp.ok) throw new Error(`HTTP ${resp.status} en ${url}`);
      const xmlText = await resp.text();
      const parsed  = await parser.parseStringPromise(xmlText);
      const items   = parsed.rss.channel[0].item || [];

      return items.map(item => ({
        title:   item.title?.[0] || '',
        link:    item.link?.[0]  || '',
        pubDate: item.pubDate?.[0]|| '',
        summary: item.description?.[0] || '',
        source
      }));
    }));

    // 2) Aplanar y ordenar por fecha descendente
    const allItems = feeds.flat().sort((a, b) =>
      new Date(b.pubDate) - new Date(a.pubDate)
    );

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json(allItems);

  } catch (err) {
    console.error('API /api/news error:', err);
    res.status(500).json({ error: err.message });
  }
}
