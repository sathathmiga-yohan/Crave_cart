function FoodSort({
  sortValue,
  onSortChange,
}) {

  return (
    <div className="food-sort">

      <select
        value={sortValue}
        onChange={(event) =>
          onSortChange(event.target.value)
        }
      >

        <option value="name-asc">
          Name A - Z
        </option>

        <option value="name-desc">
          Name Z - A
        </option>

        <option value="price-asc">
          Price Low to High
        </option>

        <option value="price-desc">
          Price High to Low
        </option>

      </select>

    </div>
  );
}


export default FoodSort;