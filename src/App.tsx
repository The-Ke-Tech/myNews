import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import News from './components/News'; // World/International
import KenyanNews from './components/KenyanNews'; // New Kenyan page
import About from './pages/About';

function Home() {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <h1 style={{ color: '#007bff' }}>Welcome to Your News App</h1>
      <p>Choose a section from the menu above.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{
        padding: '1rem',
        backgroundColor: '#007bff', // Blue for vibrancy
        color: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap', // Responsive for mobile
        gap: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
        <Link to="/world" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>World News</Link>
        <Link to="/kenya" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Kenyan News</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>About</Link>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}> {/* Centered content */}
        <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/world" element={<News />} />
  <Route path="/kenya" element={<KenyanNews />} />
  <Route path="/about" element={<About />} />
</Routes>
      </div>
    </Router>
  );
}

export default App;