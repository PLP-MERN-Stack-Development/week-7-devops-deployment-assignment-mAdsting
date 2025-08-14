import React, { useState } from 'react';
import Layout from './components/Layout';
import BugList from './components/BugList';
import BugForm from './components/BugForm';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * Main App Component
 * Handles routing and overall application structure
 * Includes error boundary and layout wrapper
 */
const App = () => {
  const [currentView, setCurrentView] = useState('list');
  const [newBugCreated, setNewBugCreated] = useState(null);

  /**
   * Handle navigation between views
   * @param {string} view - View to navigate to
   */
  const navigateTo = (view) => {
    console.log('🧭 Navigating to:', view);
    setCurrentView(view);
  };

  /**
   * Handle new bug creation
   * @param {Object} bug - Created bug object
   */
  const handleBugCreated = (bug) => {
    console.log('🎉 New bug created:', bug);
    setNewBugCreated(bug);
    setCurrentView('list');
  };

  /**
   * Render current view based on state
   * @returns {JSX.Element} Current view component
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'form':
        return (
          <BugForm
            onBugCreated={handleBugCreated}
            onCancel={() => navigateTo('list')}
          />
        );
      case 'list':
      default:
        return <BugList />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout>
        <div className="app-container">
          {/* Navigation */}
          <div className="view-navigation">
            <button
              onClick={() => navigateTo('list')}
              className={`nav-button ${currentView === 'list' ? 'active' : ''}`}
            >
              📋 Bug List
            </button>
            <button
              onClick={() => navigateTo('form')}
              className={`nav-button ${currentView === 'form' ? 'active' : ''}`}
            >
              ➕ New Bug
            </button>
          </div>

          {/* Success message for new bug */}
          {newBugCreated && currentView === 'list' && (
            <div className="success-banner">
              <span>✅ Bug "{newBugCreated.title}" created successfully!</span>
              <button
                onClick={() => setNewBugCreated(null)}
                className="close-button"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main content */}
          <div className="main-content">
            {renderCurrentView()}
          </div>
        </div>

        <style jsx>{`
          .app-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          .view-navigation {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            justify-content: center;
          }

          .nav-button {
            padding: 0.75rem 1.5rem;
            border: 2px solid #e2e8f0;
            background: white;
            color: #4a5568;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            font-size: 1rem;
          }

          .nav-button:hover {
            border-color: #4299e1;
            color: #4299e1;
            transform: translateY(-2px);
          }

          .nav-button.active {
            background: #4299e1;
            color: white;
            border-color: #4299e1;
          }

          .success-banner {
            background: #c6f6d5;
            color: #22543d;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
          }

          .close-button {
            background: none;
            border: none;
            color: #22543d;
            cursor: pointer;
            font-size: 1.2rem;
            padding: 0.25rem;
            border-radius: 4px;
            transition: background-color 0.3s ease;
          }

          .close-button:hover {
            background: rgba(34, 84, 61, 0.1);
          }

          .main-content {
            min-height: 400px;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .view-navigation {
              flex-direction: column;
            }

            .nav-button {
              width: 100%;
            }

            .success-banner {
              flex-direction: column;
              gap: 0.5rem;
              text-align: center;
            }
          }
        `}</style>
      </Layout>
    </ErrorBoundary>
  );
};

export default App; 