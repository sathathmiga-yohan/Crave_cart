import api from "./api";


// CREATE ORDER - CUSTOMER

export const createOrder = async (
  orderData
) => {

  const response = await api.post(
    "/orders",
    orderData
  );

  return response.data;
};


// GET MY ORDERS - CUSTOMER

export const getMyOrders = async () => {

  const response = await api.get(
    "/orders/my-orders"
  );

  return response.data;
};


// GET ORDER BY ID
// CUSTOMER OWN ORDER / ADMIN ANY ORDER

export const getOrderById = async (
  orderId
) => {

  const response = await api.get(
    `/orders/${orderId}`
  );

  return response.data;
};


// GET ALL ORDERS - ADMIN

export const getAllOrders = async () => {

  const response = await api.get(
    "/orders"
  );

  return response.data;
};


// UPDATE ORDER STATUS - ADMIN

export const updateOrderStatus = async (
  orderId,
  newStatus
) => {

  const response = await api.patch(
    `/orders/${orderId}/status`,
    {
      status: newStatus,
    }
  );

  return response.data;
};