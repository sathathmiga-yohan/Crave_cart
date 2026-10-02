import { useEffect, useState } from "react";

import FoodGrid from "../../components/food/FoodGrid";
import FoodSearch from "../../components/food/FoodSearch";
import FoodFilter from "../../components/food/FoodFilter";
import FoodSort from "../../components/food/FoodSort";

import { getFoods } from "../../services/foodService";
import { getCategories } from "../../services/categoryService";


function Foods() {

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sortValue, setSortValue] = useState("name-asc");

  // PAGINATION
  const [page, setPage] = useState(1);

  const limit = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // LOAD CATEGORIES

  useEffect(() => {

    const loadCategories = async () => {

      try {

        const data = await getCategories();

        if (Array.isArray(data)) {
          setCategories(data);
        }

      } catch (error) {

        console.error(
          "Failed to load categories",
          error
        );

      }

    };


    loadCategories();

  }, []);


  // RESET PAGE WHEN SEARCH / FILTER / SORT CHANGES

  useEffect(() => {

    setPage(1);

  }, [
    search,
    categoryId,
    sortValue,
  ]);


  // LOAD FOODS

  useEffect(() => {

    const loadFoods = async () => {

      try {

        setLoading(true);
        setError("");


        const [sort, order] =
          sortValue.split("-");


        const params = {

          search:
            search || undefined,

          category_id:
            categoryId || undefined,

          sort,
          order,

          page,
          limit,

        };


        const data =
          await getFoods(params);


        if (Array.isArray(data)) {

          setFoods(data);

        } else {

          setFoods([]);

        }


      } catch (error) {

        setError(
          "Unable to load foods. Please try again."
        );

      } finally {

        setLoading(false);

      }

    };


    loadFoods();

  }, [
    search,
    categoryId,
    sortValue,
    page,
  ]);


  // PREVIOUS PAGE

  const handlePreviousPage = () => {

    setPage((currentPage) =>
      Math.max(
        currentPage - 1,
        1
      )
    );

  };


  // NEXT PAGE

  const handleNextPage = () => {

    setPage((currentPage) =>
      currentPage + 1
    );

  };


  return (

    <div className="foods-page">

      <div className="foods-container">


        {/* PAGE HEADING */}

        <div className="foods-heading">

          <p className="section-small-title">
            CRAVECART MENU
          </p>

          <h1>
            Explore Our Foods
          </h1>

          <p>
            Find your favourite food and order it easily.
          </p>

        </div>


        {/* SEARCH + FILTER + SORT */}

        <div className="food-controls">

          <FoodSearch
            search={search}
            onSearchChange={setSearch}
          />


          <FoodFilter
            categories={categories}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
          />


          <FoodSort
            sortValue={sortValue}
            onSortChange={setSortValue}
          />

        </div>


        {/* LOADING */}

        {loading && (

          <div className="home-message">
            Loading foods...
          </div>

        )}


        {/* ERROR */}

        {error && (

          <div className="home-error">
            {error}
          </div>

        )}


        {/* FOOD LIST */}

        {!loading && !error && (

          <>

            <FoodGrid
              foods={foods}
            />


            {/* PAGINATION */}

            <div className="food-pagination">

              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={page === 1}
              >
                Previous
              </button>


              <span>
                Page {page}
              </span>


              <button
                type="button"
                onClick={handleNextPage}
                disabled={foods.length < limit}
              >
                Next
              </button>

            </div>

          </>

        )}


      </div>

    </div>

  );

}


export default Foods;