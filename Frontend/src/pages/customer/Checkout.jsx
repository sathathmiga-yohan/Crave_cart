import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useCart } from "../../context/CartContext";

import {
  createCustomer,
  getMyCustomerProfile,
  updateMyCustomerProfile,
} from "../../services/customerService";

import {
  createOrder,
} from "../../services/orderService";


function Checkout() {

  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [customerExists, setCustomerExists] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");


  // LOAD CUSTOMER PROFILE

  useEffect(() => {

    const loadCustomer = async () => {

      try {

        const customer =
          await getMyCustomerProfile();

        setFormData({
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
          address: customer.address || "",
        });

        setCustomerExists(true);

      } catch (error) {

        // Customer profile does not exist yet
        if (error.response?.status === 404) {

          setCustomerExists(false);

        } else {

          setError(
            error.response?.data?.detail ||
            "Unable to load customer information."
          );

        }

      } finally {

        setLoading(false);

      }

    };


    loadCustomer();

  }, []);


  // INPUT CHANGE

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;


    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

  };


  // PLACE ORDER

  const handleSubmit = async (event) => {

    event.preventDefault();


    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }


    try {

      setSubmitting(true);
      setError("");


      // STEP 1:
      // CREATE OR UPDATE CUSTOMER PROFILE

      if (customerExists) {

        await updateMyCustomerProfile(
          formData
        );

      } else {

        await createCustomer(
          formData
        );

        setCustomerExists(true);

      }


      // STEP 2:
      // PREPARE ORDER ITEMS

      const orderData = {

        items: cartItems.map((item) => ({
          food_id: item.id,
          quantity: item.quantity,
        })),

      };


      // STEP 3:
      // CREATE ORDER

      const order =
        await createOrder(orderData);


      // STEP 4:
      // CLEAR CART AFTER SUCCESS

      clearCart();


      // STEP 5:
      // ORDER CONFIRMATION PAGE

      navigate(
        `/order-confirmation/${order.id}`,
        {
          state: {
            order,
          },
        }
      );


    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to place your order."
      );

    } finally {

      setSubmitting(false);

    }

  };


  // LOADING

  if (loading) {

    return (
      <div className="checkout-message">
        Loading checkout...
      </div>
    );

  }


  // EMPTY CART

  if (cartItems.length === 0) {

    return (
      <div className="checkout-message">

        <h2>
          Your cart is empty
        </h2>

        <Link to="/foods">
          Explore Foods
        </Link>

      </div>
    );

  }


  return (
    <div className="checkout-page">

      <div className="checkout-container">

        <div className="checkout-heading">

          <p className="section-small-title">
            COMPLETE YOUR ORDER
          </p>

          <h1>
            Checkout
          </h1>

        </div>


        {error && (
          <div className="home-error">
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
          className="checkout-layout"
        >

          {/* CUSTOMER INFORMATION */}

          <div className="checkout-customer">

            <h2>
              Customer Information
            </h2>


            <div className="checkout-field">

              <label htmlFor="name">
                Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                minLength={2}
                required
              />

            </div>


            <div className="checkout-field">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            <div className="checkout-field">

              <label htmlFor="phone">
                Phone
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

            </div>


            <div className="checkout-field">

              <label htmlFor="address">
                Address
              </label>

              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="4"
                required
              />

            </div>

          </div>


          {/* ORDER SUMMARY */}

          <div className="checkout-summary">

            <h2>
              Order Summary
            </h2>


            <div className="checkout-items">

              {cartItems.map((item) => (

                <div
                  key={item.id}
                  className="checkout-item"
                >

                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <p>
                      Qty: {item.quantity}
                    </p>

                  </div>


                  <span>
                    Rs.{" "}
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </span>

                </div>

              ))}

            </div>


            <div className="checkout-total">

              <span>
                Total
              </span>

              <strong>
                Rs. {cartTotal.toFixed(2)}
              </strong>

            </div>


            <button
              type="submit"
              className="place-order-button"
              disabled={submitting}
            >

              {submitting
                ? "Placing Order..."
                : "Place Order"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}


export default Checkout;