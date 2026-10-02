import { Link } from "react-router-dom";

import { getImageUrl } from "../../utils/imageUrl";


function FoodCard({ food }) {

  const imageUrl = getImageUrl(food.image);

  return (
    <div className="food-card">

      {/* FOOD IMAGE */}

      <div className="food-card-image">

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

      <div className="food-card-content">

        <h3>
          {food.name}
        </h3>

        {food.description && (
          <p className="food-description">
            {food.description}
          </p>
        )}


        <div className="food-card-bottom">

          <span className="food-price">
            Rs. {Number(food.price).toFixed(2)}
          </span>


          {food.is_available ? (
            <span className="food-available">
              Available
            </span>
          ) : (
            <span className="food-unavailable">
              Unavailable
            </span>
          )}

        </div>


        <Link
          to={`/foods/${food.id}`}
          className="food-view-button"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}


export default FoodCard;