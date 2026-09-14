import React from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { logo2 } from './assets';
import { Home, CreatePost } from './pages';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`im-nav-link ${active ? 'im-nav-link-active' : ''}`}
    >
      {children}
    </Link>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="im-app">
        <header className="im-header">
          <div className="im-header-inner">
            <Link to="/" className="im-brand" aria-label="ENVISIONAI home">
              <img src={logo2} alt="ENVISIONAI" className="im-logo" />
              <span>ENVISION<span>AI</span></span>
            </Link>

            <nav className="im-nav" aria-label="Main navigation">
              <NavLink to="/">Community</NavLink>
              <NavLink to="/create-post">Create</NavLink>
            </nav>
          </div>
        </header>

        <main className="im-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-post" element={<CreatePost />} />
          </Routes>
        </main>

        <footer className="im-footer">
          <span>ENVISIONAI</span>
          <span>Turn ideas into images.</span>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
