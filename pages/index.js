// pages/index.js
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function Home() {
  const [news, setNews]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [searchQuery, setSearch] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res  = await fetch('/api/news');
        const data = await res.json();
        setNews(data);
      } catch (e) {
        console.error('Fetch error:', e);
      }
      setLoading(false);
    };
    fetchNews();
    const timer = setInterval(fetchNews, 60_000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = str =>
    new Date(str).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

  const filtered = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>InfoMercado – Noticias de Economía</title>
      </Head>

      <style jsx global>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
          font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background:#f8f9fa; color:#333; line-height:1.6;
        }
        .container { max-width:1200px; margin:0 auto; padding:0 20px; }
        .header {
          background: linear-gradient(135deg,#1e3c72,#2a5298);
          color:#fff; padding:1rem 0; text-align:center;
          box-shadow:0 2px 10px rgba(0,0,0,.1);
        }
        .header h1 { margin:0; font-size:2rem; }
        .header p { margin-top:4px; opacity:.9; }
        .search-bar {
          display:flex; justify-content:center; margin:20px 0;
        }
        .search-bar input {
          width:300px; padding:10px 15px; border-radius:25px;
          border:1px solid #ccc; font-size:14px;
        }
        .news-list { margin-bottom:40px; }
        .news-item {
          background:#fff; padding:20px; margin-bottom:20px;
          border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,.05);
          transition:transform .2s,box-shadow .2s;
        }
        .news-item:hover {
          transform:translateY(-2px);
          box-shadow:0 4px 12px rgba(0,0,0,.1);
        }
        .news-meta {
          font-size:.85rem; color:#666; margin-bottom:8px;
        }
        .news-meta span + span { margin-left:15px; }
        .news-title {
          font-size:1.3rem; color:#2a5298; text-decoration:none;
          display:inline-block; margin-bottom:12px;
        }
        .news-title:hover { color:#ff6b35; }
        .news-summary {
          margin-bottom:12px; color:#444;
        }
        .news-source-link {
          font-size:.9rem; color:#1976d2; text-decoration:none;
        }
        .news-source-link:hover { text-decoration:underline; }
        @media(max-width:768px) {
          .search-bar input { width:80%; }
        }
      `}</style>

      <header className="header">
        <h1>InfoMercado</h1>
        <p>Noticias de Economía</p>
      </header>

      <div className="container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar en títulos…"
            value={searchQuery}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p style={{ textAlign:'center' }}>Cargando noticias…</p>
        ) : (
          <div className="news-list">
            {filtered.map((item, i) => (
              <article className="news-item" key={i}>
                <div className="news-meta">
                  <span>{formatDate(item.pubDate)}</span>
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
      </div>
    </>
  );
}
