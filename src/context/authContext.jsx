import { ID } from "appwrite";
import { createContext, useContext, useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    try {
      await account.createEmailPasswordSession(email, password);
      const accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/u");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, name) => {
    setLoading(true);
    try {
      await account.create(ID.unique(), email, password, name);
      navigate("/auth/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------logout functionality-----------------------------------
  const logout = async () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");
  if (!confirmLogout) return;

  setLoading(true);
  try {
    await account.deleteSession("current"); 
    setUser(null);
    navigate("/auth/login");
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

 useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer); // cleanup on unmount/change
    }
  }, [error]);

  // Automatically check current user when app loads
  useEffect(() => {
  const getCurrentUser = async () => {
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
      console.log(accountDetails);
    } catch {
      setUser(null);
    } finally {
      setInitializing(false); // ✅ done bootstrapping
    }
  };

  getCurrentUser();
}, []);


  const value = {
    login,
    signup,
    logout,
    initializing,
    loading,
    error,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
