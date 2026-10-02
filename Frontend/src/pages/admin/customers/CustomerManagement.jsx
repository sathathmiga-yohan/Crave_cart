import {
  useEffect,
  useState,
} from "react";

import {
  getAllCustomers,
  deleteCustomer,
} from "../../../services/customerService";


function CustomerManagement() {

  const [customers, setCustomers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // LOAD ALL CUSTOMERS

  const loadCustomers = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getAllCustomers();

      setCustomers(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to load customers."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadCustomers();
  }, []);


  // DELETE CUSTOMER

  const handleDelete = async (
    customerId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this customer?"
      );

    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");

      await deleteCustomer(
        customerId
      );

      setSuccess(
        "Customer deleted successfully."
      );

      await loadCustomers();

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to delete customer."
      );

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
          Customer Management
        </h1>

        <p>
          View and manage customer
          profiles.
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


      {/* CUSTOMER LIST */}

      <div className="admin-list-section">

        <div className="admin-section-heading">

          <h2>
            Customers
          </h2>

          <p>
            Total Customers:{" "}
            {customers.length}
          </p>

        </div>


        {loading ? (

          <div className="admin-empty">
            Loading customers...
          </div>

        ) : customers.length === 0 ? (

          <div className="admin-empty">
            No customers found.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Customer ID</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {customers.map(
                  (customer) => (

                    <tr key={customer.id}>

                      <td>
                        {customer.id}
                      </td>

                      <td>
                        {customer.user_id}
                      </td>

                      <td>
                        {customer.name}
                      </td>

                      <td>
                        {customer.email}
                      </td>

                      <td>
                        {customer.phone}
                      </td>

                      <td className="admin-customer-address">
                        {customer.address}
                      </td>

                      <td>

                        <div className="admin-table-actions">

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() =>
                              handleDelete(
                                customer.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}


export default CustomerManagement;