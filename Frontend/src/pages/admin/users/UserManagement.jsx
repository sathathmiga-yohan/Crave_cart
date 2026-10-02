import {
  useEffect,
  useState,
} from "react";

import {
  getAllUsers,
  updateUserStatus,
} from "../../../services/userService";


function UserManagement() {

  const [users, setUsers] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingUserId, setUpdatingUserId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // LOAD ALL USERS

  const loadUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getAllUsers();

      setUsers(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to load users."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadUsers();
  }, []);


  // CHANGE USER STATUS

  const handleStatusChange = async (
    userId,
    currentStatus
  ) => {

    const newStatus = !currentStatus;

    const confirmed = window.confirm(
      newStatus
        ? "Do you want to activate this user?"
        : "Do you want to deactivate this user?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setUpdatingUserId(userId);

      setError("");
      setSuccess("");

      await updateUserStatus(
        userId,
        newStatus
      );

      setSuccess(
        newStatus
          ? "User activated successfully."
          : "User deactivated successfully."
      );

      await loadUsers();

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to update user status."
      );

    } finally {

      setUpdatingUserId(null);

    }

  };


  return (
    <div className="admin-page">

      {/* PAGE HEADING */}

      <div className="admin-page-heading">

        <p className="section-small-title">
          ADMIN PANEL
        </p>

        <h1>
          User Management
        </h1>

        <p>
          View registered users and manage
          their account status.
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="home-error">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div className="profile-success">
          {success}
        </div>
      )}


      {/* USER LIST */}

      <div className="admin-list-section">

        <div className="admin-section-heading">

          <h2>
            Registered Users
          </h2>

          <p>
            Total Users: {users.length}
          </p>

        </div>


        {loading ? (

          <div className="admin-empty">
            Loading users...
          </div>

        ) : users.length === 0 ? (

          <div className="admin-empty">
            No users found.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>

              </thead>


              <tbody>

                {users.map((user) => (

                  <tr key={user.id}>

                    {/* ID */}

                    <td>
                      {user.id}
                    </td>


                    {/* NAME */}

                    <td>
                      {user.name}
                    </td>


                    {/* EMAIL */}

                    <td>
                      {user.email}
                    </td>


                    {/* ROLE */}

                    <td>

                      <span className="admin-user-role">
                        {user.role}
                      </span>

                    </td>


                    {/* CREATED DATE */}

                    <td>

                      {new Date(
                        user.created_at
                      ).toLocaleDateString()}

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          user.is_active
                            ? "admin-status available"
                            : "admin-status unavailable"
                        }
                      >
                        {user.is_active
                          ? "Active"
                          : "Inactive"}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <button
                        type="button"
                        className={
                          user.is_active
                            ? "admin-deactivate-button"
                            : "admin-activate-button"
                        }
                        disabled={
                          updatingUserId ===
                          user.id
                        }
                        onClick={() =>
                          handleStatusChange(
                            user.id,
                            user.is_active
                          )
                        }
                      >

                        {updatingUserId ===
                        user.id
                          ? "Updating..."
                          : user.is_active
                            ? "Deactivate"
                            : "Activate"}

                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}


export default UserManagement;