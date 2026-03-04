// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';        // your Home component
import News from './components/News';        // World
import KenyanNews from './components/KenyanNews'; // Kenya
import About from './components/About';      // ← Add or update this line

function App() {
  return (
    <Router>
      <nav style={{
        padding: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Home</Link>
        <Link to="/world" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>World News</Link>
        <Link to="/kenya" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Kenyan News</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>About</Link>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/world" element={<News />} />
          <Route path="/kenya" element={<KenyanNews />} />
          <Route path="/about" element={<About />} />      {/* ← This line makes /about show */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;