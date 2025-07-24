
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  permissionLevel: number;
  login: (token: string) => void;
  logout: () => void;
}

interface DecodedToken {
  permissionLevel: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [permissionLevel, setPermissionLevel] = useState<number>(0);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setPermissionLevel(decoded.permissionLevel || 0);
        } else {
          // Token expired
          localStorage.removeItem('token');
          setToken(null);
          setPermissionLevel(0);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('token');
        setToken(null);
        setPermissionLevel(0);
      }
    }
  }, []);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    try {
        const decoded = jwtDecode<DecodedToken>(newToken);
        setPermissionLevel(decoded.permissionLevel || 0);
    } catch (error) {
        console.error("Invalid token on login:", error);
        setPermissionLevel(0);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setPermissionLevel(0);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, permissionLevel, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
