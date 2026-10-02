function FoodSearch({
  search,
  onSearchChange,
}) {
  return (
    <div className="food-search">

      <input
        type="text"
        placeholder="Search foods..."
        value={search}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
      />

    </div>
  );
}


export default FoodSearch;