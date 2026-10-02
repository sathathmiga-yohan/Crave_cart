import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getMyOrders } from "../../services/orderService";
import OrderCard from "../../components/order/OrderCard";


function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const loadOrders = async () => {

      try {

        setLoading(true);
        setError("");

        const data = await getMyOrders();

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }

      } catch (error) {

        setError(
          error.response?.data?.detail ||
          "Unable to load your orders."
        );

      } finally {

        setLoading(false);

      }

    };


    loadOrders();

  }, []);


  // LOADING

  if (loading) {

    return (
      <div className="my-orders-message">
        Loading your orders...
      </div>
    );

  }


  return (
    <div className="my-orders-page">

      <div className="my-orders-container">


        {/* HEADING */}

        <div className="my-orders-heading">

          <p className="section-small-title">
            ORDER HISTORY
          </p>

          <h1>
            My Orders
          </h1>

          <p>
            View and track your previous orders.
          </p>

        </div>


        {/* ERROR */}

        {error && (
          <div className="home-error">
            {error}
          </div>
        )}


        {/* NO ORDERS */}

        {!error && orders.length === 0 && (

          <div className="my-orders-empty">

            <h2>
              No Orders Yet
            </h2>

            <p>
              You have not placed any orders yet.
            </p>

            <Link
              to="/foods"
              className="confirmation-button"
            >
              Explore Foods
            </Link>

          </div>

        )}


        {/* ORDERS */}

        {!error && orders.length > 0 && (

          <div className="my-orders-list">

            {orders.map((order) => (

              <OrderCard
                key={order.id}
                order={order}
              />

            ))}

          </div>

        )}

      </div>

    </div>
  );
}


export default MyOrders;