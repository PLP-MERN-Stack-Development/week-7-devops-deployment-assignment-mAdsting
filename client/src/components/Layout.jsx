import React from 'react';

/**
 * Layout Component
 * Provides consistent layout structure with header navigation
 * Includes responsive design and modern styling
 */
const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>🐛 MERN Bug Tracker</h1>
            <span className="subtitle">Track, Debug, Deploy</span>
          </div>
          
          <nav className="navigation">
            <a href="/" className="nav-link">
              📋 Bug List
            </a>
            <a href="/new" className="nav-link">
              ➕ New Bug
            </a>
            <a href="/about" className="nav-link">
              ℹ️ About
            </a>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 MERN Bug Tracker. Built with ❤️ for debugging practice.</p>
          <div className="footer-links">
            <a href="/docs" className="footer-link">Documentation</a>
            <a href="/api" className="footer-link">API</a>
            <a href="/tests" className="footer-link">Tests</a>
          </div>
        </div>
      </footer>

      <style>{`
        .layout {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }

        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo h1 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
          background: linear-gradient(45deg, #fff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 0.9rem;
          opacity: 0.8;
          font-weight: 300;
        }

        .navigation {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .nav-link:active {
          transform: translateY(0);
        }

        .main-content {
          flex: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          width: 100%;
        }

        .footer {
          background: #2d3748;
          color: white;
          padding: 2rem 0;
          margin-top: auto;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .footer-links {
          display: flex;
          gap: 2rem;
        }

        .footer-link {
          color: #a0aec0;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: white;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .navigation {
            gap: 1rem;
          }

          .nav-link {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }

          .main-content {
            padding: 1rem;
          }

          .footer-content {
            flex-direction: column;
            text-align: center;
          }

          .footer-links {
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          .logo h1 {
            font-size: 1.5rem;
          }

          .navigation {
            flex-wrap: wrap;
            justify-content: center;
          }

          .nav-link {
            font-size: 0.8rem;
            padding: 0.3rem 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout; 