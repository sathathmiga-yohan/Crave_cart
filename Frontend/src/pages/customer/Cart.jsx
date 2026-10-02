import { Link } from "react-router-dom";

import CartItem from "../../components/cart/CartItem";
import CartSummary from "../../components/cart/CartSummary";

import { useCart } from "../../context/CartContext";


function Cart() {

  const {
    cartItems,
    clearCart,
  } = useCart();


  // EMPTY CART

  if (cartItems.length === 0) {

    return (
      <div className="cart-page">

        <div className="cart-container">

          <div className="cart-empty">

            <h1>
              Your Cart is Empty
            </h1>

            <p>
              Add some delicious food to your cart.
            </p>

            <Link
              to="/foods"
              className="cart-explore-button"
            >
              Explore Foods
            </Link>

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="cart-page">

      <div className="cart-container">

        {/* HEADING */}

        <div className="cart-heading">

          <div>

            <p className="section-small-title">
              YOUR ORDER
            </p>

            <h1>
              Shopping Cart
            </h1>

          </div>


          <button
            type="button"
            className="clear-cart-button"
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </div>


        {/* CART CONTENT */}

        <div className="cart-layout">


          {/* CART ITEMS */}

          <div className="cart-items">

            {cartItems.map((item) => (

              <CartItem
                key={item.id}
                item={item}
              />

            ))}

          </div>


          {/* CART SUMMARY */}

          <CartSummary />


        </div>

      </div>

    </div>
  );
}


export default Cart;