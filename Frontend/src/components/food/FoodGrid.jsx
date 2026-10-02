import FoodCard from "./FoodCard";


function FoodGrid({ foods = [] }) {

  if (!Array.isArray(foods) || foods.length === 0) {
    return (
      <div className="food-empty">
        <p>No foods available.</p>
      </div>
    );
  }


  return (
    <div className="food-grid">

      {foods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
        />
      ))}

    </div>
  );
}


export default FoodGrid;