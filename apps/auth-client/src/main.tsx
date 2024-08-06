import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { RootLayout } from './components/composite';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>
);
