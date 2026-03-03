// src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-container">
      <h1>About This News App</h1>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          This is a simple, fast, and clean news aggregator built for people who want quick access to 
          the latest headlines from Kenya and around the world — without clutter or ads.
        </p>
      </section>

      <section className="about-section">
        <h2>Features</h2>
        <ul>
          <li>Real-time Kenyan news powered by NewsData.io</li>
          <li>International coverage from major global sources (BBC, Al Jazeera, CNN, etc.)</li>
          <li>Responsive design — looks great on phones, tablets, and desktops</li>
          <li>Refresh button to get the newest stories</li>
          <li>Automatic filtering of non-English content where possible</li>
          <li>Translation option for occasional foreign-language articles</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>Technologies Used</h2>
        <ul className="tech-list">
          <li>React 19 + TypeScript</li>
          <li>React Router DOM v7</li>
          <li>Create React App (CRA)</li>
          <li>News APIs: NewsData.io + TheNewsAPI.com</li>
          <li>Pure CSS (no frameworks like Tailwind or Bootstrap)</li>
          <li>Deployed on Vercel</li>
        </ul>
      </section>

      <section className="about-section contact">
        <h2>Contact / Feedback</h2>
        <p>
          Built with Ben in Kaimosi universiity, Kenya<br />
          Got suggestions or found a bug? Feel free to reach out!
        </p>
        <p>
          <strong>Email:</strong> benokoth707@gmail.com<br />
          <strong>X/Twitter:</strong>news
        </p>
      </section>

      <footer className="about-footer">
        <p>© {new Date().getFullYear()} News App • Made for quick updates</p>
      </footer>
    </div>
  );
};

export default About;