import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './assets/styles/index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from "./contexts/ThemeContext";
import { WebSocketProvider } from "./contexts/WebSocketContext";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <WebSocketProvider>
        <ToastContainer position="top-center" autoClose={5000} />
        <App />
      </WebSocketProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
