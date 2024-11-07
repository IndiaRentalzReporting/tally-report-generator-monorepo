import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// maintain precedence of tailwindcss
import '@trg_package/vite/components/styles.css';
import './globals.css';
import { RootLayout } from './components/composite';
// maintain precedence of tailwindcss

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>
);
