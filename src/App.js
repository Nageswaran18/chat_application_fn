import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './components/pages/Home';
import Chat from './components/pages/Chat';
import AppSidebar from './components/sidebar/Sidebar';
import LoginPage from './components/login/LoginPage';
import { useContext, useState } from 'react';
import { UserContext, UserProvider } from './UserContext';
import { useEffect } from 'react';
import useNotification from './components/services/Notification';

import { GoogleOAuthProvider } from '@react-oauth/google';

// ProtectedRoute Component
function ProtectedRoute({ children }) {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/login" />;
}






// App Component
function AppContent() {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const isLoginPage = location.pathname === '/login';
  const { sendNotification, socket } = useNotification(user?.id);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.notification) {
          sendNotification("New Notification", data.notification);
        }
      };
    }
  }, [socket, sendNotification]);

  return (
    <div className={`app-container ${sidebarCollapsed ? 'collapsed' : ''} ${isLoginPage ? 'login-page' : ''}`}>
      {/* Sidebar should only appear on non-login pages */}
      {!isLoginPage && <AppSidebar collapsed={sidebarCollapsed} toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />}
      
      <div className="content-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="501914681032-tkfjo4a2ossqcq4n7hcccjqrnp96dr0s.apps.googleusercontent.com">
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
