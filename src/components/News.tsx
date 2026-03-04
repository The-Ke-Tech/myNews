// src/components/News.tsx
import React, { useState, useEffect } from 'react';

interface Article {
  title: string;
  description: string;
  url: string;
  source: string;
  published_at: string;
  image_url?: string;
}

const News: React.FC = () => {
  const [internationalArticles, setInternationalArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const apiKey = process.env.REACT_APP_NEWS_API_KEY;

  // Simple check for Chinese characters (Han script)
  const isLikelyChinese = (text: string) => /[\u4e00-\u9fff]/.test(text);

  const fetchNews = async (forceRefresh = false) => {
    if (!apiKey) {
      setError('API key missing');
      setLoading(false);
      return;
    }
    const now = new Date();
    if (!forceRefresh && lastFetchTime && now.getTime() - lastFetchTime.getTime() < 5 * 60 * 1000) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const globalRes = await fetch(
        `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&limit=20`
      );
      if (!globalRes.ok) throw new Error('Global fetch failed');
      const globalData = await globalRes.json();
      const globalArts = (globalData.data || []).slice(0, 10);

      const sourcesRes = await fetch(
        `https://api.thenewsapi.com/v1/news/top?api_token=${apiKey}&domains=bbc.com,aljazeera.com,cnn.com,foxnews.com,abcnews.go.com,nytimes.com,theguardian.com&limit=20`
      );
      if (!sourcesRes.ok) throw new Error('Sources fetch failed');
      const sourcesData = await sourcesRes.json();
      const sourcesArts = (sourcesData.data || []).slice(0, 10);

      const combined = [...sourcesArts, ...globalArts];
      const unique = combined.filter(
        (art, idx, self) => self.findIndex(a => a.url === art.url) === idx
      );

      // Filter out likely Chinese articles
      const filtered = unique.filter(
        art => !isLikelyChinese(art.title || '') && !isLikelyChinese(art.description || '')
      ).slice(0, 15);

      setInternationalArticles(
        filtered.map(art => ({
          title: art.title || 'No title',
          description: art.description || '',
          url: art.url || '#',
          source: art.source || 'Unknown',
          published_at: art.published_at || new Date().toISOString(),
          image_url: art.image_url,
        }))
      );

      setLastFetchTime(now);
    } catch (err: any) {
      setError(err.message || 'Failed to load news');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => fetchNews(true);

  // Translation: Open Google Translate in new tab → to English
  const translateArticle = (article: Article) => {
    const text = `${article.title}\n\n${article.description || 'No description available.'}`;
    
    const encodedText = encodeURIComponent(text);
    const translateUrl = `https://translate.google.com/?sl=auto&tl=en&text=${encodedText}&op=translate`;
    
    window.open(translateUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#007bff', fontSize: '1.3rem', padding: '3rem 1rem' }}>Loading international headlines...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', padding: '3rem 1rem' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '100%', padding: '1rem', minHeight: '80vh' }}>
      <h2 style={{ color: '#007bff', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        Latest International Headlines (BBC, Al Jazeera, CNN, etc.)
      </h2>

      <button
        onClick={handleRefresh}
        style={{
          display: 'block',
          margin: '0 auto 2rem auto',
          padding: '0.8rem 1.8rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          boxShadow: '0 3px 6px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '320px',
        }}
      >
        Refresh for New World News
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {internationalArticles.map((article, index) => {
          const cardId = `card-${index}`;

          return (
            <div
              key={index}
              id={cardId}
              style={{
                padding: '1.2rem',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
              }}
            >
              <h3 style={{ margin: '0 0 0.6rem 0', fontSize: '1.25rem', lineHeight: '1.4' }}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#007bff', textDecoration: 'none' }}
                >
                  {article.title}
                </a>
              </h3>

              <p style={{ color: '#444', margin: '0 0 0.8rem 0', lineHeight: '1.5', fontSize: '0.95rem' }}>
                {article.description || 'No description available.'}
              </p>

              <small style={{ color: '#666', display: 'block', marginBottom: '0.8rem' }}>
                {article.source} • {new Date(article.published_at).toLocaleString()}
              </small>

              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  style={{
                    maxWidth: '100%',
                    marginTop: '0.8rem',
                    borderRadius: '8px',
                    display: 'block',
                  }}
                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                />
              )}

              <button
                onClick={() => translateArticle(article)}
                style={{
                  marginTop: '1rem',
                  padding: '0.7rem 1.4rem',
                  backgroundColor: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Translate to English
              </button>
            </div>
          );
        })}
      </div>

      {internationalArticles.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '3rem', fontSize: '1.1rem' }}>
          No headlines available right now.
        </p>
      )}

      <p
        style={{
          fontSize: '0.9rem',
          color: '#777',
          textAlign: 'center',
          marginTop: '3rem',
          paddingBottom: '2rem',
        }}
      >
        Auto-hides Chinese articles • Click "Translate" for any language to English
      </p>
    </div>
  );
};

export default News;