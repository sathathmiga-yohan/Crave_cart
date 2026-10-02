import {
  useEffect,
  useState,
} from "react";

import {
  getFoods,
  createFood,
  updateFood,
  deleteFood,
  uploadFoodImage,
} from "../../../services/foodService";

import {
  getCategories,
} from "../../../services/categoryService";

import {
  getImageUrl,
} from "../../../utils/imageUrl";


function FoodManagement() {

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    is_available: true,
  });

  const [imageFile, setImageFile] = useState(null);

  const [editingFood, setEditingFood] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // LOAD FOODS + CATEGORIES

  const loadData = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        foodsData,
        categoriesData,
      ] = await Promise.all([
        getFoods({
          page: 1,
          limit: 100,
        }),
        getCategories(),
      ]);

      setFoods(
        Array.isArray(foodsData)
          ? foodsData
          : []
      );

      setCategories(
        Array.isArray(categoriesData)
          ? categoriesData
          : []
      );

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to load food data."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadData();
  }, []);


  // INPUT CHANGE

  const handleChange = (event) => {

    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setFormData((currentData) => ({
      ...currentData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

  };


  // RESET FORM

  const resetForm = () => {

    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      is_available: true,
    });

    setImageFile(null);
    setEditingFood(null);

  };


  // CREATE / UPDATE FOOD

  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setSaving(true);
      setError("");
      setSuccess("");


      const foodData = {
        name: formData.name.trim(),

        description:
          formData.description.trim() || null,

        price: Number(formData.price),

        category_id:
          Number(formData.category_id),

        is_available:
          formData.is_available,
      };


      let savedFood;


      // UPDATE FOOD

      if (editingFood) {

        savedFood = await updateFood(
          editingFood.id,
          foodData
        );

      } else {

        // CREATE FOOD

        savedFood = await createFood(
          foodData
        );

      }


      // UPLOAD REAL IMAGE

      if (imageFile) {

        await uploadFoodImage(
          savedFood.id,
          imageFile
        );

      }


      setSuccess(
        editingFood
          ? "Food updated successfully."
          : "Food created successfully."
      );


      resetForm();

      await loadData();


    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to save food."
      );

    } finally {

      setSaving(false);

    }

  };


  // EDIT FOOD

  const handleEdit = (food) => {

    setEditingFood(food);

    setFormData({
      name: food.name || "",
      description: food.description || "",
      price: food.price || "",
      category_id: food.category_id || "",
      is_available:
        food.is_available ?? true,
    });

    setImageFile(null);

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  // CANCEL EDIT

  const handleCancelEdit = () => {

    resetForm();

    setError("");
    setSuccess("");

  };


  // DELETE FOOD

  const handleDelete = async (foodId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this food?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");

      await deleteFood(foodId);


      if (editingFood?.id === foodId) {
        resetForm();
      }


      setSuccess(
        "Food deleted successfully."
      );

      await loadData();


    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to delete food."
      );

    }

  };


  // CATEGORY NAME

  const getCategoryName = (categoryId) => {

    const category = categories.find(
      (item) => item.id === categoryId
    );

    return category?.name || "-";

  };


  return (
    <div className="admin-page">

      {/* HEADING */}

      <div className="admin-page-heading">

        <p className="section-small-title">
          ADMIN PANEL
        </p>

        <h1>
          Food Management
        </h1>

        <p>
          Add, update and manage foods.
        </p>

      </div>


      {/* MESSAGES */}

      {error && (
        <div className="home-error">
          {error}
        </div>
      )}

      {success && (
        <div className="profile-success">
          {success}
        </div>
      )}


      {/* FOOD FORM */}

      <div className="admin-form-card">

        <h2>
          {editingFood
            ? "Edit Food"
            : "Add Food"}
        </h2>


        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="profile-field">

            <label htmlFor="food-name">
              Food Name
            </label>

            <input
              id="food-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              minLength={2}
              maxLength={150}
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="profile-field">

            <label htmlFor="food-description">
              Description
            </label>

            <textarea
              id="food-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
            />

          </div>


          {/* PRICE */}

          <div className="profile-field">

            <label htmlFor="food-price">
              Price
            </label>

            <input
              id="food-price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0.01"
              step="0.01"
              required
            />

          </div>


          {/* CATEGORY */}

          <div className="profile-field">

            <label htmlFor="food-category">
              Category
            </label>

            <select
              id="food-category"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >

              <option value="">
                Select Category
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


          {/* AVAILABILITY */}

          <div className="admin-checkbox-field">

            <input
              id="food-available"
              type="checkbox"
              name="is_available"
              checked={formData.is_available}
              onChange={handleChange}
            />

            <label htmlFor="food-available">
              Food is available
            </label>

          </div>


          {/* IMAGE */}

          <div className="profile-field">

            <label htmlFor="food-image">
              Food Image
            </label>

            <input
              id="food-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setImageFile(
                  event.target.files?.[0] || null
                )
              }
            />

            {editingFood?.image && !imageFile && (

              <div className="admin-current-image">

                <span>
                  Current image:
                </span>

                <img
                  src={getImageUrl(
                    editingFood.image
                  )}
                  alt={editingFood.name}
                />

              </div>

            )}

          </div>


          {/* BUTTONS */}

          <div className="admin-form-actions">

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : editingFood
                  ? "Update Food"
                  : "Add Food"}

            </button>


            {editingFood && (

              <button
                type="button"
                className="admin-secondary-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>


      {/* FOOD LIST */}

      <div className="admin-list-section">

        <div className="admin-section-heading">

          <h2>
            Foods
          </h2>

          <p>
            Manage available food items.
          </p>

        </div>


        {loading ? (

          <div className="admin-empty">
            Loading foods...
          </div>

        ) : foods.length === 0 ? (

          <div className="admin-empty">
            No foods available.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {foods.map((food) => (

                  <tr key={food.id}>

                    {/* IMAGE */}

                    <td>

                      {food.image ? (

                        <img
                          className="admin-food-image"
                          src={getImageUrl(food.image)}
                          alt={food.name}
                        />

                      ) : (

                        <span className="admin-no-image">
                          No image
                        </span>

                      )}

                    </td>


                    {/* NAME */}

                    <td>
                      {food.name}
                    </td>


                    {/* CATEGORY */}

                    <td>
                      {getCategoryName(
                        food.category_id
                      )}
                    </td>


                    {/* PRICE */}

                    <td>
                      Rs.{" "}
                      {Number(
                        food.price
                      ).toFixed(2)}
                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={
                          food.is_available
                            ? "admin-status available"
                            : "admin-status unavailable"
                        }
                      >
                        {food.is_available
                          ? "Available"
                          : "Unavailable"}
                      </span>

                    </td>


                    {/* ACTIONS */}

                    <td>

                      <div className="admin-table-actions">

                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() =>
                            handleEdit(food)
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() =>
                            handleDelete(food.id)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}


export default FoodManagement;