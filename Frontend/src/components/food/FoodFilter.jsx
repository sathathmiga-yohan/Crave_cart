function FoodFilter({
  categories,
  categoryId,
  onCategoryChange,
}) {
  return (
    <div className="food-filter">

      <select
        value={categoryId}
        onChange={(event) =>
          onCategoryChange(event.target.value)
        }
      >
        <option value="">
          All Categories
        </option>

        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}

      </select>

    </div>
  );
}


export default FoodFilter;