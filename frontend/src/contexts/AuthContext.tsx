import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "@/lib/api";

interface User {
  _id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          apiClient.setToken(token);
          const response = await apiClient.get<{ user: User }>("/auth/me");
          if (response.success && response.data) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear it
            localStorage.removeItem("token");
            apiClient.setToken(null);
          }
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem("token");
          apiClient.setToken(null);
        }
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<{ user: User; token: string }>("/auth/login", {
      email,
      password,
    });

    if (response.success && response.data) {
      const { user: userData, token } = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      apiClient.setToken(token);
    } else {
      throw new Error(response.error?.message || "Login failed");
    }
  };

  const register = async (email: string, password: string) => {
    const response = await apiClient.post<{ user: User; token: string }>("/auth/register", {
      email,
      password,
    });

    if (response.success && response.data) {
      const { user: userData, token } = response.data;
      setUser(userData);
      setIsAuthenticated(true);
      apiClient.setToken(token);
    } else {
      throw new Error(response.error?.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    apiClient.setToken(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
