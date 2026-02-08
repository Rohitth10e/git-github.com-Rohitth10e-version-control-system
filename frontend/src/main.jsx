import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router } from "react-router-dom";
import {AuthContextProvider} from "./AuthContext.jsx";

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
      <Router>
          <App />
      </Router>
  </AuthContextProvider>
)
