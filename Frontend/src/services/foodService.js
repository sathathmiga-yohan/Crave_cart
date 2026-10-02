import api from "./api";


// GET ALL FOODS

export const getFoods = async (params = {}) => {

  const response = await api.get(
    "/foods",
    {
      params,
    }
  );

  return response.data;
};


// GET FOOD BY ID

export const getFoodById = async (
  foodId
) => {

  const response = await api.get(
    `/foods/${foodId}`
  );

  return response.data;
};


// CREATE FOOD - ADMIN

export const createFood = async (
  foodData
) => {

  const response = await api.post(
    "/foods",
    foodData
  );

  return response.data;
};


// UPDATE FOOD - ADMIN

export const updateFood = async (
  foodId,
  foodData
) => {

  const response = await api.patch(
    `/foods/${foodId}`,
    foodData
  );

  return response.data;
};


// DELETE FOOD - ADMIN

export const deleteFood = async (
  foodId
) => {

  await api.delete(
    `/foods/${foodId}`
  );

};


// UPLOAD FOOD IMAGE - ADMIN

export const uploadFoodImage = async (
  foodId,
  imageFile
) => {

  const formData = new FormData();

  formData.append(
    "image",
    imageFile
  );


  const response = await api.post(
    `/foods/${foodId}/image`,
    formData
  );

  return response.data;
};