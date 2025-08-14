import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 * Logs those errors and displays a fallback UI instead of crashing
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  /**
   * Static method to update state when an error occurs
   * @param {Error} error - The error that was thrown
   * @returns {Object} New state object
   */
  static getDerivedStateFromError(error) {
    console.error('🚨 Error Boundary caught an error:', error);
    
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true, 
      error 
    };
  }

  /**
   * Lifecycle method called after an error is thrown
   * Used for logging error information and debugging
   * @param {Error} error - The error that was thrown
   * @param {Object} errorInfo - Additional error information
   */
  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error Boundary componentDidCatch:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    this.setState({
      error,
      errorInfo
    });

    // In a real application, you might want to log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  /**
   * Reset the error state
   * Useful for allowing users to retry after an error
   */
  handleReset = () => {
    console.log('🔄 Resetting error boundary state');
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  /**
   * Render fallback UI when an error occurs
   * @returns {JSX.Element} Error display component
   */
  renderErrorUI() {
    const { error, errorInfo } = this.state;
    const isDevelopment = process.env.NODE_ENV === 'development';

    return (
      <div className="error-boundary">
        <div className="error-container">
          <div className="error-header">
            <h2>🐛 Something went wrong!</h2>
            <p>We're sorry, but something unexpected happened.</p>
          </div>

          <div className="error-actions">
            <button 
              onClick={this.handleReset}
              className="retry-button"
            >
              🔄 Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="reload-button"
            >
              🔁 Reload Page
            </button>
          </div>

          {isDevelopment && error && (
            <div className="error-details">
              <h3>Debug Information (Development Only)</h3>
              <details>
                <summary>Error Details</summary>
                <pre className="error-stack">
                  {error.toString()}
                </pre>
              </details>
              
              {errorInfo && (
                <details>
                  <summary>Component Stack</summary>
                  <pre className="component-stack">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>

        <style>{`
          .error-boundary {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
          }

          .error-container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            text-align: center;
          }

          .error-header h2 {
            color: #e53e3e;
            margin-bottom: 10px;
            font-size: 2rem;
          }

          .error-header p {
            color: #718096;
            margin-bottom: 30px;
            font-size: 1.1rem;
          }

          .error-actions {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-bottom: 30px;
          }

          .retry-button,
          .reload-button {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .retry-button {
            background: #4299e1;
            color: white;
          }

          .retry-button:hover {
            background: #3182ce;
            transform: translateY(-2px);
          }

          .reload-button {
            background: #edf2f7;
            color: #4a5568;
          }

          .reload-button:hover {
            background: #e2e8f0;
            transform: translateY(-2px);
          }

          .error-details {
            margin-top: 30px;
            text-align: left;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }

          .error-details h3 {
            color: #2d3748;
            margin-bottom: 15px;
          }

          .error-details details {
            margin-bottom: 15px;
          }

          .error-details summary {
            cursor: pointer;
            padding: 10px;
            background: #f7fafc;
            border-radius: 6px;
            font-weight: 600;
            color: #4a5568;
          }

          .error-details summary:hover {
            background: #edf2f7;
          }

          .error-stack,
          .component-stack {
            background: #2d3748;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 6px;
            font-size: 0.875rem;
            overflow-x: auto;
            white-space: pre-wrap;
            margin-top: 10px;
          }
        `}</style>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorUI();
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 