import { Link } from "react-router-dom";

import { useCart } from "../../context/CartContext";


function CartSummary() {

  const {
    cartCount,
    cartTotal,
  } = useCart();


  return (
    <div className="cart-summary">

      <h2>
        Order Summary
      </h2>


      <div className="cart-summary-row">

        <span>
          Total Items
        </span>

        <span>
          {cartCount}
        </span>

      </div>


      <div className="cart-summary-row cart-summary-total">

        <span>
          Total Amount
        </span>

        <strong>
          Rs. {cartTotal.toFixed(2)}
        </strong>

      </div>


      <Link
        to="/checkout"
        className="checkout-button"
      >
        Proceed to Checkout
      </Link>

    </div>
  );
}


export default CartSummary;