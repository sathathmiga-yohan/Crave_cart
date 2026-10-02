import api from "./api";


// GET ALL USERS - ADMIN

export const getAllUsers = async () => {

  const response = await api.get(
    "/users"
  );

  return response.data;
};


// UPDATE USER STATUS - ADMIN

export const updateUserStatus = async (
  userId,
  isActive
) => {

  const response = await api.patch(
    `/users/${userId}/status`,
    {
      is_active: isActive,
    }
  );

  return response.data;
};