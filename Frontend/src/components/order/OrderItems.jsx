function OrderItems({ items = [] }) {

  if (!Array.isArray(items) || items.length === 0) {

    return (
      <div className="order-items-empty">
        No order items available.
      </div>
    );

  }


  return (
    <div className="order-items-section">

      <h2>
        Ordered Items
      </h2>


      <div className="order-items-list">

        {items.map((item) => (

          <div
            key={item.id}
            className="order-item-row"
          >

            {/* FOOD */}

            <div className="order-item-info">

              <strong>
                {item.food?.name ||
                  `Food #${item.food_id}`}
              </strong>

              <span>
                Qty: {item.quantity}
              </span>

            </div>


            {/* PRICE */}

            <div className="order-item-price">

              <span>
                Rs. {Number(
                  item.unit_price
                ).toFixed(2)} each
              </span>

              <strong>
                Rs. {Number(
                  item.subtotal
                ).toFixed(2)}
              </strong>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


export default OrderItems;