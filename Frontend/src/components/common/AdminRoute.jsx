import {
  Navigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function AdminRoute({ children }) {

  const {
    isAuthenticated,
    isAdmin,
    loading,
  } = useAuth();


  // Current user check முடியும் வரை wait

  if (loading) {
    return (
      <div className="route-loading">
        Loading...
      </div>
    );
  }


  // Login இல்லை

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // Login இருக்கு, ஆனால் ADMIN இல்லை

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  // ADMIN user

  return children;
}


export default AdminRoute;