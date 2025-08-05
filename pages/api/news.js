import xml2js from 'xml2js'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'

export default async function handler(req, res) {
  const RSS_URL = 'https://www.pagina12.com.ar/rss/secciones/economia/notas'
  const UA = 'Mozilla/5.0 (compatible; AcmeBot/1.0)'

  try {
    // 1) Obtener y parsear el RSS
    const rssResp = await fetch(RSS_URL, { headers: { 'User-Agent': UA } })
    if (!rssResp.ok) throw new Error(`RSS HTTP ${rssResp.status}`)
    const rssXml = await rssResp.text()
    const rss = await new xml2js.Parser().parseStringPromise(rssXml)
    const items = rss.rss.channel[0].item || []

    // 2) Para cada ítem, buscar la página y extraer el artículo limpio
    const results = await Promise.all(items.map(async item => {
      const link    = item.link[0]
      const summary = item.description?.[0] || ''
      let content   = summary

      try {
        const pageResp = await fetch(link, { headers: { 'User-Agent': UA } })
        if (pageResp.ok) {
          const html = await pageResp.text()
          const dom  = new JSDOM(html, { url: link })
          const doc  = new Readability(dom.window.document).parse()
          if (doc?.content) {
            content = doc.content
          }
        }
      } catch (e) {
        console.error('Falló extracción de artículo:', e)
      }

      return {
        title:   item.title[0],
        link,
        pubDate: item.pubDate[0],
        summary,
        content,
        source: 'Página12'
      }
    }))

    // Cache en Vercel: revalida cada 60s
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
    res.status(200).json(results)

  } catch (err) {
    console.error('API /api/news error:', err)
    res.status(500).json({ error: err.message })
  }
}
