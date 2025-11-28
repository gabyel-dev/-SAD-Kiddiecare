import { useState, useEffect } from "react";
import { db } from "../db/db";

export function useAdmin() {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAdminInfo = async () => {
    try {
      return await db.adminData.toArray();
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const admin = await db.adminData
        .where("username")
        .equals(username)
        .first();

      if (admin && admin.password === password) {
        setCurrentAdmin(admin);
        setIsAuthenticated(true);
        // Save to localStorage for persistence
        localStorage.setItem("kiddiecare_admin", JSON.stringify(admin));
        return admin;
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    localStorage.removeItem("kiddiecare_admin");
  };

  const checkExistingSession = () => {
    const savedAdmin = localStorage.getItem("kiddiecare_admin");
    if (savedAdmin) {
      const admin = JSON.parse(savedAdmin);
      setCurrentAdmin(admin);
      setIsAuthenticated(true);
      return admin;
    }
    return null;
  };

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  return {
    currentAdmin,
    isAuthenticated,
    getAdminInfo,
    login,
    logout,
    isLoading,
    error,
  };
}
