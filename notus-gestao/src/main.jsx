import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ESTA LINHA ABAIXO É QUE FAZ O SITE FICAR ESCURO E VINHO
import './global.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);