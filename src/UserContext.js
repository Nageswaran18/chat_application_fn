import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import config from '../src/components/config/config.json';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Try to load user from sessionStorage on initial render
    const accessToken = sessionStorage.getItem('access_token');
    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        return { id: decoded.user_id, role: decoded.role };
      } catch (error) {
        console.error('Invalid access token:', error);
        return null;
      }
    }
    return null;
  });

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    const refreshToken = sessionStorage.getItem('refresh_token');

    if (!refreshToken) {
      setUser(null);
      return;
    }

    try {
      const response = await axios.post(`${config.API_BASE_URL}/token/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      sessionStorage.setItem('access_token', access);

      const decoded = jwtDecode(access);
      setUser({ id: decoded.user_id, role: decoded.role });
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      logoutUser();
    }
  };

  useEffect(() => {
    if (!user) {
      refreshAccessToken();
    }
  }, []);

  const loginUser = (access, refresh) => {
    sessionStorage.setItem('access_token', access);
    sessionStorage.setItem('refresh_token', refresh);

    const decoded = jwtDecode(access);
    setUser({ id: decoded.user_id, role: decoded.role });
  };

  const logoutUser = () => {
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshAccessToken, loginUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
