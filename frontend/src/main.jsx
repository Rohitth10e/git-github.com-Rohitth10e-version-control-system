import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { AuthProvider } from "./AuthContext.jsx";
import ProjectRoutes from './Routes.jsx';

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <Router>
            <ProjectRoutes />
        </Router>
    </AuthProvider>
)
