import api from "./api";


// GET DASHBOARD STATISTICS

export const getDashboardStatistics = async () => {

  const response = await api.get(
    "/dashboard/statistics"
  );

  return response.data;
};


// GET POPULAR FOODS

export const getPopularFoods = async () => {

  const response = await api.get(
    "/dashboard/popular-foods"
  );

  return response.data;
};