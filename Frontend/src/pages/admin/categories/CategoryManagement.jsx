import {
  useEffect,
  useState,
} from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../../services/categoryService";


function CategoryManagement() {

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // LOAD CATEGORIES

  const loadCategories = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getCategories();

      setCategories(
        Array.isArray(data) ? data : []
      );

    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to load categories."
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {
    loadCategories();
  }, []);


  // RESET FORM

  const resetForm = () => {

    setName("");
    setDescription("");
    setEditingCategory(null);

  };


  // ADD / UPDATE CATEGORY

  const handleSubmit = async (event) => {

    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Category name is required.");
      return;
    }

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      const categoryData = {
        name: trimmedName,
        description: description.trim() || null,
      };


      // UPDATE CATEGORY

      if (editingCategory) {

        await updateCategory(
          editingCategory.id,
          categoryData
        );

        setSuccess(
          "Category updated successfully."
        );

      } else {

        // CREATE CATEGORY

        await createCategory(
          categoryData
        );

        setSuccess(
          "Category created successfully."
        );

      }


      resetForm();

      await loadCategories();


    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to save category."
      );

    } finally {

      setSaving(false);

    }

  };


  // START EDITING

  const handleEdit = (category) => {

    setEditingCategory(category);

    setName(
      category.name || ""
    );

    setDescription(
      category.description || ""
    );

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


  // DELETE CATEGORY

  const handleDelete = async (categoryId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");

      await deleteCategory(
        categoryId
      );


      if (
        editingCategory?.id === categoryId
      ) {
        resetForm();
      }


      setSuccess(
        "Category deleted successfully."
      );

      await loadCategories();


    } catch (error) {

      setError(
        error.response?.data?.detail ||
        "Unable to delete category."
      );

    }

  };


  return (

    <div className="admin-page">


      {/* HEADING */}

      <div className="admin-page-heading">

        <p className="section-small-title">
          ADMIN PANEL
        </p>

        <h1>
          Category Management
        </h1>

        <p>
          Create, edit and manage food categories.
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


      {/* CATEGORY FORM */}

      <div className="admin-form-card">

        <h2>

          {editingCategory
            ? "Edit Category"
            : "Add Category"}

        </h2>


        <form onSubmit={handleSubmit}>


          {/* CATEGORY NAME */}

          <div className="profile-field">

            <label htmlFor="category-name">
              Category Name
            </label>

            <input
              id="category-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              minLength={2}
              maxLength={100}
              placeholder="Example: Burgers"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="profile-field">

            <label htmlFor="category-description">
              Description
            </label>

            <textarea
              id="category-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows="3"
              placeholder="Example: Fresh and delicious burgers"
            />

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
                : editingCategory
                  ? "Update Category"
                  : "Add Category"}

            </button>


            {editingCategory && (

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


      {/* CATEGORY LIST */}

      <div className="admin-list-section">

        <div className="admin-section-heading">

          <h2>
            Categories
          </h2>

          <p>
            {categories.length} categories available.
          </p>

        </div>


        {loading ? (

          <div className="admin-empty">
            Loading categories...
          </div>

        ) : categories.length === 0 ? (

          <div className="admin-empty">
            No categories available.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>

              </thead>


              <tbody>

                {categories.map((category) => (

                  <tr key={category.id}>

                    <td>
                      {category.id}
                    </td>

                    <td>
                      {category.name}
                    </td>

                    <td>
                      {category.description || "-"}
                    </td>

                    <td>

                      <div className="admin-table-actions">

                        <button
                          type="button"
                          className="admin-edit-button"
                          onClick={() =>
                            handleEdit(category)
                          }
                        >
                          Edit
                        </button>


                        <button
                          type="button"
                          className="admin-delete-button"
                          onClick={() =>
                            handleDelete(category.id)
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


export default CategoryManagement;