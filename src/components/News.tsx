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

  // Function to translate a single article's text using Google Translate widget
  const translateArticle = (article: Article, cardId: string) => {
    const card = document.getElementById(cardId);
    if (!card) return;

    // Prevent multiple loads
    if (card.querySelector('.google-translate-widget')) return;

    // Load Google Translate script if not loaded
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        // eslint-disable-next-line no-new
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: 'auto', includedLanguages: 'en,zh-CN,zh-TW', layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE },
          'google_translate_element_global' // Hidden global element
        );
      };
    }

    // Create a div for this card's translation
    const transDiv = document.createElement('div');
    transDiv.className = 'google-translate-widget';
    transDiv.innerHTML = `<div id="trans-${cardId}"></div>`;
    card.appendChild(transDiv);

    // Trigger translation on the text (simulate by setting text and translating)
    const textToTranslate = `${article.title}\n\n${article.description}`;
    const transContainer = document.getElementById(`trans-${cardId}`);
    if (transContainer) {
      transContainer.innerText = textToTranslate;
      // Google Translate auto-detects and translates visible text in the page
      alert('Translation loaded! Scroll or click the language dropdown if needed. (Google widget)');
    }
  };

  if (loading) return <p style={{ textAlign: 'center', color: '#007bff' }}>Loading international headlines...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '100%', padding: '1rem' }}>
      <h2 style={{ color: '#007bff', textAlign: 'center', marginBottom: '1rem' }}>
        Latest International Headlines (BBC, Al Jazeera, CNN, etc.)
      </h2>
      <button
        onClick={handleRefresh}
        style={{
          display: 'block',
          margin: '0 auto 1.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Refresh for New World News
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {internationalArticles.map((article, index) => {
          const cardId = `card-${index}`;
          const likelyChinese = isLikelyChinese(article.title) || isLikelyChinese(article.description);

          return (
            <div
              key={index}
              id={cardId}
              style={{
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              <h3 style={{ marginBottom: '0.5rem' }}>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#007bff', textDecoration: 'none' }}
                >
                  {article.title}
                </a>
              </h3>
              <p style={{ color: '#555', marginBottom: '0.5rem' }}>
                {article.description || 'No description available.'}
              </p>
              <small style={{ color: '#888' }}>
                {article.source} • {new Date(article.published_at).toLocaleString()}
              </small>
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  style={{ maxWidth: '100%', marginTop: '0.5rem', borderRadius: '4px' }}
                  onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                />
              )}

              {likelyChinese && (
                <button
                  onClick={() => translateArticle(article, cardId)}
                  style={{
                    marginTop: '1rem',
                    padding: '0.4rem 0.8rem',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Translate to English
                </button>
              )}
            </div>
          );
        })}
      </div>

      {internationalArticles.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666' }}>No headlines available right now.</p>
      )}
      <p
        style={{
          fontSize: '0.9rem',
          color: '#666',
          textAlign: 'center',
          marginTop: '1rem',
        }}
      >
        Auto-hides Chinese articles • Click "Translate" for any remaining non-English.
      </p>

      {/* Hidden div for global Google Translate init */}
      <div id="google_translate_element_global" style={{ display: 'none' }}></div>
    </div>
  );
};

export default News;