
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Error: Root element not found");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Memberi sinyal ke index.html bahwa React sudah mulai render
    console.log("IDR Minier System: Operational");
  } catch (err) {
    console.error("IDR Minier System Failure:", err);
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; background: #0a0a0c; color: #ff4444; font-family: sans-serif; padding: 20px; text-align: center;">
        <h2 style="font-family: Orbitron;">CRITICAL SYSTEM ERROR</h2>
        <p style="font-size: 12px; color: #888;">Gagal memuat sistem mining. Silakan refresh atau gunakan browser lain.</p>
        <button onclick="location.reload()" style="margin-top: 20px; background: #eab308; color: black; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold;">REBOOT SYSTEM</button>
      </div>
    `;
  }
}
