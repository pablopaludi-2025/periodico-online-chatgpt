import { useEffect, useState } from 'react';

export default function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: 50 }}>Cargando noticias…</p>;
  }

  return (
    <div style={{
      maxWidth: 800,
      margin: '40px auto',
      padding: '0 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>Noticias de Economía</h1>
      {news.map((item, i) => (
        <div key={i} style={{ marginBottom: 24 }}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '1.1em',
              color: '#333',
              textDecoration: 'none'
            }}
          >
            {item.title}
          </a>
          <div style={{ fontSize: '0.9em', color: '#666', marginTop: 4 }}>
            {new Date(item.pubDate).toLocaleString('es-AR')}
          </div>
        </div>
      ))}
    </div>
  );
}
