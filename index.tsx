import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import { useServiceWorker, usePerformanceOptimization } from './src/hooks/usePerformance';
import './src/i18n/config'; // Import i18n configuration

// Service Worker Registration Component
const ServiceWorkerRegistration: React.FC = () => {
  const { isSupported, isRegistered, isOnline, updateAvailable, updateServiceWorker } = useServiceWorker();
//   const { metrics } = usePerformanceOptimization();

  React.useEffect(() => {
    if (updateAvailable) {
      console.log('[PWA] Update available, user can refresh');
      // You could show a toast notification here
    }
  }, [updateAvailable]);

  React.useEffect(() => {
    // Performance monitoring
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        console.log(`[Performance] Page load time: ${loadTime}ms`);
      }
    }
  }, []);

  // You could render a status indicator or update available notification here
  return null;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Register service worker before rendering
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registered:', registration);
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New service worker available');
              // You could show a notification to the user
            }
          });
        }
      });
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

root.render(
  <React.StrictMode>
    <ServiceWorkerRegistration />
    <App />
  </React.StrictMode>
);
