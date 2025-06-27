import { BrowserRouter as Router } from 'react-router-dom';

import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import ToastManager from './components/Toast';
import AppRoutes from './routes';

import './App.css';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <NotificationProvider>
          <AuthProvider>
            <div className="App">
              <Navbar />
              <div className="main-content">
                <AppRoutes />
              </div>
              <ToastManager />
            </div>
          </AuthProvider>
        </NotificationProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
