import api from "./api";


// CREATE MY CUSTOMER PROFILE

export const createCustomer = async (
  customerData
) => {

  const response = await api.post(
    "/customers",
    customerData
  );

  return response.data;
};


// GET MY CUSTOMER PROFILE

export const getMyCustomerProfile = async () => {

  const response = await api.get(
    "/customers/me"
  );

  return response.data;
};


// UPDATE MY CUSTOMER PROFILE

export const updateMyCustomerProfile = async (
  customerData
) => {

  const response = await api.patch(
    "/customers/me",
    customerData
  );

  return response.data;
};


// GET ALL CUSTOMERS - ADMIN

export const getAllCustomers = async () => {

  const response = await api.get(
    "/customers"
  );

  return response.data;
};


// GET CUSTOMER BY ID - ADMIN

export const getCustomerById = async (
  customerId
) => {

  const response = await api.get(
    `/customers/${customerId}`
  );

  return response.data;
};


// DELETE CUSTOMER - ADMIN

export const deleteCustomer = async (
  customerId
) => {

  await api.delete(
    `/customers/${customerId}`
  );

};