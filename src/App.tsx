import { Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Contacts from "@/pages/Contacts";
import VideoCall from "@/pages/VideoCall";
import { useState, useEffect } from "react";
import { AuthContext } from '@/contexts/authContext';

// 受保护的路由组件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // 检查本地存储中是否有用户信息
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default function App() {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // 检查本地存储中是否有用户信息
    const userData = localStorage.getItem('user');
    if (userData) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, setIsAuthenticated, logout }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/contacts" 
          element={
            <ProtectedRoute>
              <Contacts />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/call/:contactId" 
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthContext.Provider>
  );
}
