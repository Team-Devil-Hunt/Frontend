import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GlobalStateProvider } from './context/GlobalStateProvider';
import { BrowserRouter } from 'react-router-dom';
// Import axios config to apply it globally
import './utils/axiosConfig';

createRoot(document.getElementById('root')).render(

    <GlobalStateProvider>
      <App />
    </GlobalStateProvider>
)
