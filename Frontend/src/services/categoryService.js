import api from "./api";


// GET ALL CATEGORIES

export const getCategories = async () => {

  const response = await api.get(
    "/categories"
  );

  return response.data;
};


// GET CATEGORY BY ID

export const getCategoryById = async (
  categoryId
) => {

  const response = await api.get(
    `/categories/${categoryId}`
  );

  return response.data;
};


// CREATE CATEGORY - ADMIN

export const createCategory = async (
  categoryData
) => {

  const response = await api.post(
    "/categories",
    categoryData
  );

  return response.data;
};


// UPDATE CATEGORY - ADMIN

export const updateCategory = async (
  categoryId,
  categoryData
) => {

  const response = await api.patch(
    `/categories/${categoryId}`,
    categoryData
  );

  return response.data;
};


// DELETE CATEGORY - ADMIN

export const deleteCategory = async (
  categoryId
) => {

  await api.delete(
    `/categories/${categoryId}`
  );

};