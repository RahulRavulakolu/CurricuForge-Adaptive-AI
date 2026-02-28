import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { AuthProvider } from '@/lib/AuthContext';
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthenticatedApp from '@/components/AuthenticatedApp';
const Toaster = React.lazy(() => import('@/components/ui/toaster'));

function App() {
  useEffect(() => {
    console.log('App component mounted');
    // Enable GPU acceleration for better performance
    document.body.style.transform = 'translateZ(0)';
    document.body.style.willChange = 'transform';
  }, []);

  console.log('Rendering App component...');

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <Suspense fallback={
            <div style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#050816'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '4px solid #e2e8f0',
                borderTop: '4px solid #1e293b',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          }>
            <AuthenticatedApp />
          </Suspense>
        </Router>
        <Suspense fallback={null}>
          <Toaster />
        </Suspense>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
