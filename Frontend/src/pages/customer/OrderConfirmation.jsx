import { Link, useLocation } from "react-router-dom";


function OrderConfirmation() {

  const location = useLocation();

  const order = location.state?.order;


  // Direct URL open / refresh case
  if (!order) {

    return (
      <div className="order-confirmation-page">

        <div className="order-confirmation-card">

          <h2>
            Order information is not available.
          </h2>

          <p>
            You can view your order from My Orders.
          </p>

          <Link
            to="/my-orders"
            className="confirmation-button"
          >
            View My Orders
          </Link>

        </div>

      </div>
    );

  }


  return (
    <div className="order-confirmation-page">

      <div className="order-confirmation-card">

        {/* SUCCESS ICON */}

        <div className="confirmation-icon">
          ✓
        </div>


        <p className="section-small-title">
          ORDER SUCCESSFUL
        </p>


        <h1>
          Thank You!
        </h1>


        <p className="confirmation-message">
          Your order has been placed successfully.
        </p>


        {/* ORDER INFORMATION */}

        <div className="confirmation-details">

          <div className="confirmation-row">

            <span>
              Order ID
            </span>

            <strong>
              #{order.id}
            </strong>

          </div>


          <div className="confirmation-row">

            <span>
              Status
            </span>

            <strong>
              {order.status}
            </strong>

          </div>


          <div className="confirmation-row">

            <span>
              Total Amount
            </span>

            <strong>
              Rs. {Number(order.total_amount).toFixed(2)}
            </strong>

          </div>

        </div>


        {/* BUTTONS */}

        <div className="confirmation-actions">

          <Link
            to="/my-orders"
            className="confirmation-button"
          >
            View My Orders
          </Link>


          <Link
            to="/foods"
            className="confirmation-secondary-button"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}


export default OrderConfirmation;