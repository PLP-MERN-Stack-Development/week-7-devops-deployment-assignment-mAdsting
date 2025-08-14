import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/**
 * Main entry point for the React application
 * Renders the App component into the DOM
 */

// Get the root element
const rootElement = document.getElementById('root');

// Check if root element exists
if (!rootElement) {
  console.error('❌ Root element not found! Make sure there is a <div id="root"></div> in your HTML.');
  throw new Error('Root element not found');
}

// Create React root and render app
const root = ReactDOM.createRoot(rootElement);

console.log('🚀 Starting MERN Bug Tracker application...');
console.log('🌍 Environment:', import.meta.env.MODE);
console.log('📊 React version:', React.version);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Log successful render
console.log('✅ Application rendered successfully'); 