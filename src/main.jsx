import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './styling/index.css';
import App from './App.jsx';

function Root() {
  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  return <App />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
