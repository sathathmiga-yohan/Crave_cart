import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getFoodById } from "../../services/foodService";
import { getImageUrl } from "../../utils/imageUrl";
import { useCart } from "../../context/CartContext";


function FoodDetails() {

  const { foodId } = useParams();

  const { addToCart } = useCart();


  const [food, setFood] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // LOAD FOOD DETAILS

  useEffect(() => {

    const loadFood = async () => {

      try {

        setLoading(true);

        setError("");


        const data = await getFoodById(foodId);

        setFood(data);


      } catch (error) {

        setError(
          error.response?.data?.detail ||
          "Unable to load food details."
        );


      } finally {

        setLoading(false);

      }

    };


    loadFood();

  }, [foodId]);


  // LOADING

  if (loading) {

    return (
      <div className="food-details-message">
        Loading food details...
      </div>
    );

  }


  // ERROR

  if (error) {

    return (
      <div className="food-details-message error">
        {error}
      </div>
    );

  }


  // FOOD NOT FOUND

  if (!food) {

    return (
      <div className="food-details-message">
        Food not found.
      </div>
    );

  }


  const imageUrl = getImageUrl(
    food.image
  );


  return (

    <div className="food-details-page">

      <div className="food-details-container">


        {/* BACK TO FOODS */}

        <Link
          to="/foods"
          className="food-back-link"
        >
          ← Back to Foods
        </Link>


        <div className="food-details-card">


          {/* FOOD IMAGE */}

          <div className="food-details-image">

            {imageUrl ? (

              <img
                src={imageUrl}
                alt={food.name}
              />

            ) : (

              <div className="food-no-image">
                No Image
              </div>

            )}

          </div>


          {/* FOOD INFORMATION */}

          <div className="food-details-content">

            <p className="section-small-title">
              CRAVECART MENU
            </p>


            <h1>
              {food.name}
            </h1>


            <p className="food-details-description">

              {food.description ||
                "No description available."}

            </p>


            <p className="food-details-price">

              Rs. {Number(
                food.price
              ).toFixed(2)}

            </p>


            {/* AVAILABILITY */}

            {food.is_available ? (

              <span className="food-available">
                Available
              </span>

            ) : (

              <span className="food-unavailable">
                Unavailable
              </span>

            )}


            {/* ADD TO CART */}

            <button
              type="button"
              className="add-cart-button"
              onClick={() => addToCart(food)}
              disabled={!food.is_available}
            >

              {food.is_available
                ? "Add to Cart"
                : "Currently Unavailable"}

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}


export default FoodDetails;