import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext";

import {
  useCart,
} from "../../context/CartContext";


function Navbar() {

  const navigate = useNavigate();

  const {
    isAuthenticated,
    isAdmin,
    logout,
  } = useAuth();

  const {
    cartCount,
  } = useCart();


  // LOGOUT

  const handleLogout = () => {

    logout();

    navigate("/");

  };


  return (
    <nav className="navbar">

      <div className="navbar-container">

        {/* LOGO */}

        <Link
          to="/"
          className="navbar-logo"
        >
          CraveCart
        </Link>


        {/* MAIN LINKS */}

        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/foods">
            Foods
          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="navbar-cart"
          >
            Cart

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}

          </Link>


          {/* LOGGED IN USER */}

          {isAuthenticated ? (
            <>

              {/* ADMIN */}

              {isAdmin ? (

                <Link
                  to="/admin"
                  className="navbar-admin-link"
                >
                  Admin Dashboard
                </Link>

              ) : (

                /* CUSTOMER */

                <>

                  <Link to="/my-orders">
                    My Orders
                  </Link>

                  <Link to="/profile">
                    Profile
                  </Link>

                </>

              )}


              {/* LOGOUT */}

              <button
                type="button"
                className="navbar-logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>
          ) : (
            <>

              {/* LOGGED OUT USER */}

              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-register-button"
              >
                Create Account
              </Link>

            </>
          )}

        </div>

      </div>

    </nav>
  );
}


export default Navbar;