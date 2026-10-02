import {
  Navigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function ProtectedRoute({ children }) {

  const {
    isAuthenticated,
    loading,
  } = useAuth();

  const location = useLocation();


  // /auth/me check முடியும் வரை wait பண்ணும்

  if (loading) {
    return (
      <div className="route-loading">
        Loading...
      </div>
    );
  }


  // Login இல்லை என்றால் Login page

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
        }}
      />
    );
  }


  // Login இருந்தால் requested page

  return children;
}


export default ProtectedRoute;