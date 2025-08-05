// pages/index.js
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [news, setNews]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res  = await fetch('/api/news');
        const data = await res.json();
        setNews(data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);

  const fmt = str =>
    new Date(str).toLocaleDateString('es-ES', {
      day:'2-digit', month:'2-digit', year:'numeric',
      hour:'2-digit', minute:'2-digit'
    });

  const filtered = news.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>InfoMercado – Noticias</title>
      </Head>
      <style jsx global>{`
        /* tu CSS aquí */
      `}</style>

      <header className="header">…</header>
      <div className="search-bar">
        <input
          placeholder="Buscar…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Cargando…</p>
      ) : (
        <div className="news-list">
          {filtered.map((item,i) => (
            <article key={i} className="news-item">
              <div className="news-meta">
                <span>{fmt(item.pubDate)}</span>
                <span>{item.source}</span>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="news-title"
              >
                {item.title}
              </a>
              <div
                className="news-summary"
                dangerouslySetInnerHTML={{ __html: item.summary }}
              />
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="news-source-link"
              >
                Fuente: {item.source}
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
