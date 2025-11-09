import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    define: {
      // Create polyfills for Node.js globals that some libraries expect
      global: 'globalThis',
      // Only expose specific environment variables that are safe for client-side
      'process.env': {
        NODE_ENV: env.NODE_ENV || 'development',
        VITE_SUPABASE_URL: env.VITE_SUPABASE_URL || '',
        VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || '',
        VITE_GEMINI_API_KEY: env.VITE_GEMINI_API_KEY || '',
        VITE_GOOGLE_MAPS_API_KEY: env.VITE_GOOGLE_MAPS_API_KEY || '',
        VITE_ENV: env.VITE_ENV || 'development',
      },
    },
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
      // Ensure proper handling of external dependencies
      rollupOptions: {
        external: [],
        output: {
          // Ensure proper handling of dynamic imports
          manualChunks: {
            // React ecosystem - core dependencies
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            
            // Supabase - database client
            'supabase-vendor': ['@supabase/supabase-js'],
            
            // AI and Maps - heavy external APIs
            'ai-maps': ['@google/genai'],
            
            // Leaflet for maps
            'leaflet-vendor': ['leaflet', 'react-leaflet'],
            
            // Heroicons for UI
            'icons-vendor': ['@heroicons/react'],
            
            // FleetFlow core modules (high priority)
            'fleetflow-core': [
              './contexts/AuthContext',
              './components/ProtectedRoute'
            ],
            
            // FleetFlow layout modules (separate for better splitting)
            'fleetflow-sidebar': ['./components/Sidebar'],
            'fleetflow-header': ['./components/Header'],
            'fleetflow-bottomnav': ['./components/BottomNav'],
            
            // FleetFlow main features (loaded on demand)
            'fleetflow-dashboard-admin': ['./components/AdminDashboard'],
            'fleetflow-dashboard-driver': ['./components/DriverDashboard'],
            'fleetflow-dashboard-core': ['./components/Dashboard'],
            
            // FleetFlow management features
            'fleetflow-management': [
              './components/Drivers',
              './components/Loads',
              './components/LoadBoard',
              './components/Invoicing'
            ],
            
            // FleetFlow communication features
            'fleetflow-communication': [
              './components/Chat',
              './components/ChatInterface',
              './components/ChatButton',
              './components/NotificationCenter',
              './components/NotificationBadge'
            ],
            
            // FleetFlow tracking features
            'fleetflow-tracking': [
              './components/Map',
              './components/GpsTracker',
              './components/loadHistory/LoadHistoryEnhanced'
            ],
            
            // FleetFlow expense features
            'fleetflow-expenses': [
              './components/ExpenseDashboard',
              './components/ExpenseForm',
              './components/ExpenseList',
              './components/ExpenseStats'
            ],
            
            // FleetFlow document features
            'fleetflow-documents': [
              './components/Documents',
              './components/documents/DocumentDashboard',
              './components/documents/DocumentUpload',
              './components/documents/DocumentViewer'
            ],
            
            // FleetFlow optimization features
            'fleetflow-optimization': [
              './components/FuelOptimization'
            ]
          },
          // Optimize chunk names
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId;
            if (facadeModuleId) {
              const fileName = facadeModuleId.split('/').pop();
              return `assets/[name]-[hash].js`;
            }
            return `assets/[name]-[hash].js`;
          }
        }
      },
      // Optimize chunk size warnings
      chunkSizeWarningLimit: 1000
    }
  };
});
