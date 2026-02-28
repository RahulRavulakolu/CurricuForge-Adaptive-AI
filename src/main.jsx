import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Add dark class to HTML element for dark theme
document.documentElement.classList.add('dark');

console.log('Starting CurricuForge application...');
console.log('Root element found:', document.getElementById('root'));

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)

console.log('React app rendered successfully!');
