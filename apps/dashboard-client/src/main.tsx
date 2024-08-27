import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@trg_package/components/styles.css';
import { RootLayout } from './components/composite';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>
);
