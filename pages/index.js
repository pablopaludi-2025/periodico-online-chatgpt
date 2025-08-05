import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function Home() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedIdx, setExpandedIdx] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchNews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/news')
      const items = await res.json()
      setNews(items)
    } catch (e) {
      console.error('Fetch error:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNews()
    const timer = setInterval(fetchNews, 60_000)
    return () => clearInterval(timer)
  }, [])

  const formatDate = str =>
    new Date(str).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

  const filtered = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <Head>
        <title>InfoMercado - Periódico Online</title>
      </Head>

      <style jsx global>{`
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
          font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background:#f8f9fa; color:#333; line-height:1.6;
        }
        .header {
          background: linear-gradient(135deg,#1e3c72,#2a5298);
          color:#fff; padding:1rem 0; box-shadow:0 2px 10px rgba(0,0,0,.1);
        }
        .container { max-width:1200px; margin:0 auto; padding:0 20px; }
        .header-content {
          display:flex; justify-content:space-between;
          align-items:center; flex-wrap:wrap;
        }
        .logo { font-size:2.5rem; font-weight:bold; text-shadow:2px 2px 4px rgba(0,0,0,.3); }
        .tagline { font-size:.9rem; opacity:.9; margin-top:5px; }
        .search-container { display:flex; gap:10px; margin-top:10px; }
        .search-input {
          padding:10px; border:none; border-radius:25px;
          min-width:300px; font-size:14px;
        }
        .search-btn {
          padding:10px 20px; background:#ff6b35; color:#fff;
          border:none; border-radius:25px; cursor:pointer;
          transition:background .3s;
        }
        .search-btn:hover { background:#e55a2b; }
        .nav {
          background:#fff; padding:15px 0;
          box-shadow:0 2px 5px rgba(0,0,0,.1);
          position:sticky; top:0; z-index:100;
        }
        .nav-menu {
          display:flex; justify-content:center;
          gap:30px; flex-wrap:wrap;
        }
        .nav-item {
          padding:10px 20px; background:#f8f9fa;
          border-radius:25px; cursor:pointer;
          transition:all .3s; border:2px solid transparent;
          font-weight:500;
        }
        .nav-item.active, .nav-item:hover {
          background:#2a5298; color:#fff; transform:translateY(-2px);
        }
        .main-content {
          display:grid;
          grid-template-columns:1fr 300px;
          gap:30px; margin:30px auto;
          max-width:1200px; padding:0 20px;
        }
        .news-section {
          background:#fff; border-radius:10px;
          padding:25px; box-shadow:0 5px 15px rgba(0,0,0,.1);
        }
        .section-title {
          font-size:1.8rem; color:#2a5298;
          margin-bottom:20px; padding-bottom:10px;
          border-bottom:3px solid #ff6b35;
        }
        .news-item {
          border:1px solid #e9ecef; border-radius:8px;
          padding:20px; background:#fff;
          transition:all .3s; overflow:hidden; margin-bottom:20px;
        }
        .news-item:hover {
          box-shadow:0 5px 15px rgba(0,0,0,.1);
          transform:translateY(-2px);
        }
        .news-meta {
          display:flex; justify-content:space-between;
          font-size:.85rem; color:#888; margin-bottom:10px;
        }
        .news-source {
          background:#e3f2fd; color:#1976d2;
          padding:3px 8px; border-radius:12px;
          font-size:.8rem; cursor:pointer; display:inline-block;
          transition:all .3s;
        }
        .news-source:hover {
          background:#1976d2; color:#fff;
          transform:translateY(-1px);
          box-shadow:0 2px 5px rgba(25,118,210,.3);
        }
        .news-title {
          font-size:1.2rem; font-weight:bold;
          color:#2a5298; margin-bottom:8px; cursor:pointer;
        }
        .news-title:hover { color:#ff6b35; }
        .news-summary {
          margin-bottom:12px; color:#444;
        }
        .news-content {
          margin-bottom:12px;
        }
        .source-link {
          font-size:.9rem; color:#1976d2; text-decoration:none;
        }
        .loading, .error-message {
          text-align:center; padding:20px; color:#666;
        }
        .sidebar {
          display:flex; flex-direction:column; gap:20px;
        }
        .widget {
          background:#fff; border-radius:10px;
          padding:20px; box-shadow:0 5px 15px rgba(0,0,0,.1);
        }
        .widget-title {
          font-size:1.3rem; color:#2a5298;
          margin-bottom:15px; padding-bottom:8px;
          border-bottom:2px solid #ff6b35;
        }
        @media(max-width:768px){
          .main-content { grid-template-columns:1fr; }
          .search-input { min-width:250px; }
        }
      `}</style>

      <header className="header">
        <div className="container header-content">
          <div>
            <div className="logo">InfoMercado</div>
            <div className="tagline">Noticias de Economía</div>
          </div>
          <div className="search-container">
            <input
              className="search-input"
              placeholder="Buscar en títulos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button className="search-btn" onClick={() => {}}>
              Buscar
            </button>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="container nav-menu">
          <div className="nav-item active">Economía</div>
          <div className="nav-item">Política</div>
          <div className="nav-item">Energía</div>
          <div className="nav-item">Minería</div>
          <div className="nav-item">Internacional</div>
        </div>
      </nav>

      <div className="main-content container">
        <main className="news-section">
          <h2 className="section-title">Economía</h2>

          {loading ? (
            <div className="loading">Cargando noticias...</div>
          ) : filtered.length === 0 ? (
            <div className="error-message">No se encontraron noticias.</div>
          ) : (
            filtered.map((item, i) => (
              <article className="news-item" key={i}>
                <div className="news-meta">
                  <span
                    className="news-source"
                    onClick={() => window.open(item.link, '_blank')}
                  >
                    {item.source}
                  </span>
                  <span>{formatDate(item.pubDate)}</span>
                </div>

                <h3
                  className="news-title"
                  onClick={() =>
                    setExpandedIdx(expandedIdx === i ? null : i)
                  }
                >
                  {item.title}
                </h3>

                <div className="news-summary" 
                     dangerouslySetInnerHTML={{ __html: item.summary }} />

                {expandedIdx === i && (
                  <div className="news-content">
                    <div
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-link"
                    >
                      Fuente: {item.source}
                    </a>
                  </div>
                )}
              </article>
            ))
          )}
        </main>

        <aside className="sidebar">
          <div className="widget">
            <h3 className="widget-title">Última Actualización</h3>
            <div>
              {new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
