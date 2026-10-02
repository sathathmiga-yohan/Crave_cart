import {
  useEffect,
  useState,
} from "react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../../services/orderService";


// Backend OrderStatus enum-க்கு exact match

const ORDER_STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];


function OrderManagement() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingOrderId, setUpdatingOrderId] =
    useState(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // LOAD ALL ORDERS

  const loadOrders = async () => {

    try {

      setLoading(true);
      setError("");

      const data =
        await getAllOrders();

      setOrders(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to load orders."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadOrders();
  }, []);


  // UPDATE ORDER STATUS

  const handleStatusChange = async (
    orderId,
    newStatus
  ) => {

    try {

      setUpdatingOrderId(orderId);

      setError("");
      setSuccess("");

      await updateOrderStatus(
        orderId,
        newStatus
      );

      setSuccess(
        `Order #${orderId} status updated successfully.`
      );

      await loadOrders();

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to update order status."
      );

    } finally {

      setUpdatingOrderId(null);

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
          Order Management
        </h1>

        <p>
          View customer orders and update
          their status.
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


      {/* ORDER LIST */}

      <div className="admin-list-section">

        <div className="admin-section-heading">

          <h2>
            Customer Orders
          </h2>

          <p>
            Total Orders: {orders.length}
          </p>

        </div>


        {loading ? (

          <div className="admin-empty">
            Loading orders...
          </div>

        ) : orders.length === 0 ? (

          <div className="admin-empty">
            No orders found.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Order ID</th>
                  <th>Customer ID</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Change Status</th>
                </tr>

              </thead>


              <tbody>

                {orders.map((order) => (

                  <tr key={order.id}>

                    {/* ORDER ID */}

                    <td>
                      #{order.id}
                    </td>


                    {/* CUSTOMER */}

                    <td>
                      {order.customer_id}
                    </td>


                    {/* DATE */}

                    <td>

                      {new Date(
                        order.created_at
                      ).toLocaleString()}

                    </td>


                    {/* TOTAL */}

                    <td>

                      Rs.{" "}
                      {Number(
                        order.total_amount
                      ).toFixed(2)}

                    </td>


                    {/* CURRENT STATUS */}

                    <td>

                      <span
                        className="admin-order-status"
                      >
                        {order.status}
                      </span>

                    </td>


                    {/* UPDATE STATUS */}

                    <td>

                      <select
                        className="admin-status-select"
                        value={order.status}
                        disabled={
                          updatingOrderId ===
                          order.id
                        }
                        onChange={(event) =>
                          handleStatusChange(
                            order.id,
                            event.target.value
                          )
                        }
                      >

                        {ORDER_STATUSES.map(
                          (status) => (

                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>

                          )
                        )}

                      </select>

                      {updatingOrderId ===
                        order.id && (

                        <span className="admin-updating-text">
                          Updating...
                        </span>

                      )}

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


export default OrderManagement;