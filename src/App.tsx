import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './components/app/theme-provider';
import { ThemeToggle } from './components/app/theme-toggle';
import { Toaster } from './components/livekit/toaster';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import ApplyPage from './pages/ApplyPage';
import InterviewPage from './pages/InterviewPage';
import { getAppConfig } from './lib/utils';
import { getStyles } from './lib/utils';
import type { AppConfig } from './app-config';
import { APP_CONFIG_DEFAULTS } from './app-config';
import './index.css';

function App() {
  const [appConfig, setAppConfig] = useState<AppConfig>(APP_CONFIG_DEFAULTS);
  const [styles, setStyles] = useState<string>('');

  useEffect(() => {
    // Load app config on mount
    async function loadConfig() {
      const config = await getAppConfig(null);
      setAppConfig(config);
      setStyles(getStyles(config));
      
      // Update document title
      document.title = config.pageTitle;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', config.pageDescription);
    }
    loadConfig();
  }, []);

  // Apply dynamic styles
  useEffect(() => {
    if (styles) {
      const styleId = 'app-dynamic-styles';
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = styles;
      return () => {
        // Cleanup on unmount
        if (styleElement && styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      };
    }
  }, [styles]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/interview/:token" element={<InterviewPage />} />
        <Route path="*" element={<Navigate to="/jobs" replace />} />
      </Routes>
      <div className="group fixed bottom-0 left-1/2 z-50 mb-2 -translate-x-1/2">
        <ThemeToggle className="translate-y-20 transition-transform delay-150 duration-300 group-hover:translate-y-0" />
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
