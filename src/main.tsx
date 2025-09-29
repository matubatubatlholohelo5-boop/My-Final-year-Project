// src/main.tsx (CORRECTED)

import React from 'react';
import ReactDOM from 'react-dom/client';
// REMOVE: The BrowserRouter import is no longer needed here
// import { BrowserRouter } from 'react-router-dom'; 
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* The BrowserRouter wrapper has been REMOVED */}
      <App /> 
   </React.StrictMode>,
  );
} else {
  throw new Error("Root element with id 'root' not found.");
}