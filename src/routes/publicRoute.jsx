import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <p>Loading...</p>; // show spinner while checking session
  }

  // If user is logged in, block access to login/signup pages
  return user ? <Navigate to="/u" replace /> : children;
}
