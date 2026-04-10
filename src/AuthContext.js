// AuthContext.js
import { createContext, useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode";
import { Navigate } from "react-router-dom";
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

    useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try{
      const decoded = jwtDecode (token);
      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired) {
        console.log("Token expired");
        localStorage.removeItem("token");
        setIsAuth(false);
        window.location.reload();
        alert("Your session has expired. Please log in again.");
        window.location.href="/login";
      } else {
        setIsAuth(true);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      setIsAuth(false);
      window.location.href = "/login";
    }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};