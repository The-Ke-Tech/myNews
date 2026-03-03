// src/components/KenyanNews.tsx
import React, { useState, useEffect } from 'react';

interface Article {
  title: string;
  description: string;
  link: string;
  source_name: string;
  pubDate: string;
  image_url?: string;
}

const KenyanNews: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const apiKey = process.env.REACT_APP_NEWS_DATA_KEY;

  const fetchNews = async (forceRefresh = false) => {
    if (!apiKey) {
      setError('NewsData API key missing in .env');
      setLoading(false);
      return;
    }
    const now = new Date();
    if (!forceRefresh && lastFetchTime && now.getTime() - lastFetchTime.getTime() < 5 * 60 * 1000) {
      return; // Use cached
    }

    setLoading(true);
    setError(null);

    try {
      // FIXED: No category=general → use valid or none
      const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=ke&language=en&size=10`; // Or add &category=top

      const response = await fetch(url);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network error: ${response.status} - ${errorText || response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== 'success') {
        throw new Error(data.message || 'API error');
      }

      const articlesData = data.results || [];

      if (articlesData.length === 0) {
        setError('No Kenyan headlines available right now – try again later.');
        setArticles([]);
        setLoading(false);
        return;
      }

      const formattedArticles: Article[] = articlesData.map((art: any) => ({
        title: art.title || 'No title',
        description: art.description || 'No description available.',
        link: art.link || '#',
        source_name: art.source?.source_name || art.source_id || 'Unknown',
        pubDate: art.pubDate || new Date().toISOString(),
        image_url: art.image_url,
      }));

      setArticles(formattedArticles);
      setLastFetchTime(now);
    } catch (err: any) {
      setError(err.message || 'Failed to load Kenyan news');
      console.error('Fetch error details:', err);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchNews();
  }, []);

  const handleRefresh = () => fetchNews(true);

  if (loading) return <p style={{ textAlign: 'center', color: '#007bff', fontSize: '1.2rem' }}>Loading Kenyan headlines...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '100%', padding: '1rem' }}>
      <h2 style={{ color: '#28a745', textAlign: 'center', marginBottom: '1.5rem' }}>Latest Kenyan Headlines</h2>
      <button
        onClick={handleRefresh}
        style={{
          display: 'block',
          margin: '0 auto 1.5rem auto',
          padding: '0.6rem 1.2rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        Refresh for New Stories
      </button>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {articles.map((article, index) => (
          <div
            key={index}
            style={{
              padding: '1.2rem',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              backgroundColor: '#ffffff',
              boxShadow: '0 3px 6px rgba(0,0,0,0.08)',
            }}
          >
            <h3 style={{ margin: '0 0 0.6rem 0', fontSize: '1.2rem' }}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007bff', textDecoration: 'none' }}
              >
                {article.title}
              </a>
            </h3>
            <p style={{ color: '#444', margin: '0 0 0.8rem 0', lineHeight: '1.5' }}>
              {article.description}
            </p>
            <small style={{ color: '#777', display: 'block' }}>
              {article.source_name} • {new Date(article.pubDate).toLocaleString('en-KE')}
            </small>
            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                style={{ maxWidth: '100%', marginTop: '0.8rem', borderRadius: '6px', display: 'block' }}
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              />
            )}
          </div>
        ))}
      </div>

      {articles.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '2rem' }}>
          No headlines right now – refresh or check back soon.
        </p>
      )}
      <p style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center', marginTop: '2rem' }}>
        Powered by NewsData.io • Free tier (up to 10 articles per refresh)
      </p>
    </div>
  );
};

export default KenyanNews;