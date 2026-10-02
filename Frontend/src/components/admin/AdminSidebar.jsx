import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function AdminSidebar() {

  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();


  const handleLogout = () => {

    logout();

    navigate("/");

  };


  return (
    <aside className="admin-sidebar">

      {/* LOGO */}

      <div className="admin-sidebar-logo">
        CraveCart
      </div>


      {/* ADMIN INFO */}

      <div className="admin-sidebar-user">

        <span>
          Welcome
        </span>

        <strong>
          {user?.name || "Admin"}
        </strong>

      </div>


      {/* NAVIGATION */}

      <nav className="admin-sidebar-nav">

        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Dashboard
        </NavLink>


        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Categories
        </NavLink>


        <NavLink
          to="/admin/foods"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Foods
        </NavLink>


        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Orders
        </NavLink>


        <NavLink
          to="/admin/customers"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Customers
        </NavLink>


        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "admin-nav-link active"
              : "admin-nav-link"
          }
        >
          Users
        </NavLink>

      </nav>


      {/* LOGOUT */}

      <button
        type="button"
        className="admin-logout-button"
        onClick={handleLogout}
      >
        Logout
      </button>

    </aside>
  );
}


export default AdminSidebar;