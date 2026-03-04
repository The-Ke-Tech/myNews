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
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // size=10 (maximum on free plan)
      const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=ke&language=en&size=10`;

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

  // Translation: Open Google Translate in new tab with pre-filled text → Kiswahili
  const translateArticle = (article: Article) => {
    const text = `${article.title}\n\n${article.description || 'No description available.'}`;
    
    // Encode text for URL
    const encodedText = encodeURIComponent(text);
    
    // Google Translate URL for English → Kiswahili (sw)
    const translateUrl = `https://translate.google.com/?sl=auto&tl=sw&text=${encodedText}&op=translate`;
    
    // Open in new tab
    window.open(translateUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#007bff', fontSize: '1.2rem', padding: '4rem 1rem' }}>Loading Kenyan headlines...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center', fontWeight: 'bold', padding: '4rem 1rem' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '100%', padding: '1rem', minHeight: '80vh' }}>
      <h2 style={{ color: '#28a745', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        Latest Kenyan Headlines
      </h2>

      <button
        onClick={handleRefresh}
        style={{
          display: 'block',
          margin: '0 auto 2rem auto',
          padding: '0.8rem 1.8rem',
          backgroundColor: '#28a745',
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
        Refresh for New Stories
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {articles.map((article, index) => {
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
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#007bff', textDecoration: 'none' }}
                >
                  {article.title}
                </a>
              </h3>

              <p style={{ color: '#444', margin: '0 0 0.8rem 0', lineHeight: '1.5', fontSize: '0.95rem' }}>
                {article.description}
              </p>

              <small style={{ color: '#666', display: 'block', marginBottom: '0.8rem' }}>
                {article.source_name} • {new Date(article.pubDate).toLocaleString('en-KE')}
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

              {/* Translation button on EVERY card – opens Google Translate to Kiswahili */}
              <button
                onClick={() => translateArticle(article)}
                style={{
                  marginTop: '1rem',
                  padding: '0.7rem 1.4rem',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  width: '100%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Tafsiri kwa Kiswahili
              </button>
            </div>
          );
        })}
      </div>

      {articles.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '3rem', fontSize: '1.1rem' }}>
          No headlines right now – refresh or check back soon.
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
        Powered by NewsData.io • Up to 10 recent headlines (free tier limit)
      </p>

      {/* No need for hidden div anymore */}
    </div>
  );
};

export default KenyanNews;