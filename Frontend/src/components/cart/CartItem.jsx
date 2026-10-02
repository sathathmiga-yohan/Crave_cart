import { getImageUrl } from "../../utils/imageUrl";
import { useCart } from "../../context/CartContext";


function CartItem({ item }) {

  const {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();


  const imageUrl = getImageUrl(item.image);

  const subtotal =
    Number(item.price) * item.quantity;


  return (
    <div className="cart-item">

      {/* FOOD IMAGE */}

      <div className="cart-item-image">

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
          />
        ) : (
          <div className="cart-no-image">
            No Image
          </div>
        )}

      </div>


      {/* FOOD DETAILS */}

      <div className="cart-item-details">

        <h3>
          {item.name}
        </h3>

        <p className="cart-item-price">
          Rs. {Number(item.price).toFixed(2)}
        </p>


        {/* QUANTITY */}

        <div className="cart-quantity">

          <button
            type="button"
            onClick={() =>
              decreaseQuantity(item.id)
            }
          >
            −
          </button>

          <span>
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              increaseQuantity(item.id)
            }
          >
            +
          </button>

        </div>

      </div>


      {/* SUBTOTAL */}

      <div className="cart-item-subtotal">

        <p>
          Subtotal
        </p>

        <strong>
          Rs. {subtotal.toFixed(2)}
        </strong>

        <button
          type="button"
          className="cart-remove-button"
          onClick={() =>
            removeFromCart(item.id)
          }
        >
          Remove
        </button>

      </div>

    </div>
  );
}


export default CartItem;