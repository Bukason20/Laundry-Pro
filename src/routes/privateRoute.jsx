import { useAuth } from "../context/authContext";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <p>Loading...</p>; // show spinner only while checking session
  }

  return user ? children : <Navigate to="/auth/login" replace />;
}
