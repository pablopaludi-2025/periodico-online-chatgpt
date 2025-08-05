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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Cargando noticias...</p>;

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 800, margin: 'auto', padding: 20 }}>
      <h1>Noticias de Economía</h1>
      {news.map((item, idx) => (
        <div key={idx} style={{ marginBottom: 16 }}>
          <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#333', fontSize: '1.1em' }}>
            {item.title}
          </a>
          <div style={{ fontSize: '0.9em', color: '#666' }}>
            {new Date(item.pubDate).toLocaleString('es-AR')}
          </div>
        </div>
      ))}
    </div>
  );
}
