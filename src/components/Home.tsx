// src/components/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <header className="hero">
        <div className="hero-content">
          <h1>Latest News at Your Fingertips</h1>
          <p>Stay informed with real-time headlines from Kenya and around the world.</p>
          <div className="hero-buttons">
            <Link to="/kenya" className="btn primary">
              Kenyan News
            </Link>
            <Link to="/world" className="btn secondary">
              World News
            </Link>
          </div>
        </div>
      </header>

      <section className="features">
        {/* Your features cards here if you have them */}
        <div className="feature-card">
          <div className="icon">🇰🇪</div>
          <h3>Kenyan Headlines</h3>
          <p>Local news from trusted Kenyan sources – updated regularly.</p>
          <Link to="/kenya" className="feature-link">Read Kenyan News →</Link>
        </div>

        <div className="feature-card">
          <div className="icon">🌍</div>
          <h3>International Coverage</h3>
          <p>BBC, Al Jazeera, CNN, Fox News, The Guardian and more.</p>
          <Link to="/world" className="feature-link">Explore World News →</Link>
        </div>

        <div className="feature-card">
          <div className="icon">🔄</div>
          <h3>Always Fresh</h3>
          <p>Click refresh anytime to get the latest stories.</p>
        </div>
      </section>

      <section className="preview-section">
        <h2>Recent Headlines Preview</h2>
        <p>Quick look at what's happening right now — full list on the dedicated pages.</p>

        <div className="preview-grid">
          {/* Example placeholder cards */}
          <div className="preview-card">
            <h4>Kenya: New Policy on Digital Economy</h4>
            <small>Updated 10 minutes ago</small>
            <Link to="/kenya" className="preview-link">See more Kenyan news →</Link>
          </div>

          <div className="preview-card">
            <h4>Global Markets: Tech Stocks Surge</h4>
            <small>Updated 15 minutes ago</small>
            <Link to="/world" className="preview-link">See more world news →</Link>
          </div>
        </div>

        <div className="preview-buttons">
          <Link to="/kenya" className="btn primary">Full Kenyan Updates</Link>
          <Link to="/world" className="btn secondary">Full World Updates</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;