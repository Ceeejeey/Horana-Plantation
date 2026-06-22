import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';
import './index.css';

// Safely suppress unhandled rejections from Vite's disabled companion HMR websockets
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || '';
    if (
      reason.includes('WebSocket') || 
      reason.includes('failed to connect') || 
      reason.includes('websocket')
    ) {
      event.preventDefault();
      console.warn('HMR connection error safely silenced:', reason);
    }
  });

  window.addEventListener('error', (event) => {
    const msg = event.message || '';
    if (msg.includes('WebSocket') || msg.includes('websocket')) {
      event.preventDefault();
      console.warn('Vite HMR websocket error safely handled.');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

