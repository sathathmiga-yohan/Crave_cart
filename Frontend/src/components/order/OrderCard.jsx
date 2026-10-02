import { Link } from "react-router-dom";

import OrderStatusBadge from "./OrderStatusBadge";


function OrderCard({ order }) {

  return (
    <div className="my-order-card">

      <div className="my-order-main">

        {/* ORDER ID */}

        <div>
          <p className="my-order-label">
            Order
          </p>

          <h3>
            #{order.id}
          </h3>
        </div>


        {/* STATUS */}

        <div>
          <p className="my-order-label">
            Status
          </p>

          <OrderStatusBadge
            status={order.status}
          />
        </div>


        {/* TOTAL */}

        <div>
          <p className="my-order-label">
            Total
          </p>

          <strong>
            Rs. {Number(
              order.total_amount
            ).toFixed(2)}
          </strong>
        </div>

      </div>


      {/* VIEW DETAILS */}

      <Link
        to={`/orders/${order.id}`}
        className="my-order-view-button"
      >
        View Details
      </Link>

    </div>
  );
}


export default OrderCard;