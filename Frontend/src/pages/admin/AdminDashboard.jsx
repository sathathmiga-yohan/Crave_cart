import {
  useEffect,
  useState,
} from "react";

import {
  getDashboardStatistics,
  getPopularFoods,
} from "../../services/dashboardService";


function AdminDashboard() {

  const [statistics, setStatistics] = useState(null);
  const [popularFoods, setPopularFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // LOAD DASHBOARD DATA

  useEffect(() => {

    const loadDashboard = async () => {

      try {

        setLoading(true);
        setError("");

        const [
          statisticsData,
          popularFoodsData,
        ] = await Promise.all([
          getDashboardStatistics(),
          getPopularFoods(),
        ]);

        setStatistics(statisticsData);

        setPopularFoods(
          Array.isArray(popularFoodsData)
            ? popularFoodsData
            : []
        );

      } catch (error) {

        setError(
          error.response?.data?.detail ||
          "Unable to load dashboard."
        );

      } finally {

        setLoading(false);

      }

    };

    loadDashboard();

  }, []);


  // LOADING

  if (loading) {
    return (
      <div className="admin-page-message">
        Loading dashboard...
      </div>
    );
  }


  // ERROR

  if (error) {
    return (
      <div className="admin-page">

        <div className="home-error">
          {error}
        </div>

      </div>
    );
  }


  return (
    <div className="admin-page">

      {/* HEADING */}

      <div className="admin-page-heading">

        <p className="section-small-title">
          ADMIN PANEL
        </p>

        <h1>
          Dashboard
        </h1>

        <p>
          Overview of your CraveCart system.
        </p>

      </div>


      {/* STATISTICS */}

      <div className="admin-stats-grid">

        <div className="admin-stat-card">
          <span>Total Foods</span>
          <strong>
            {statistics?.total_foods ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Categories</span>
          <strong>
            {statistics?.total_categories ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Customers</span>
          <strong>
            {statistics?.total_customers ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Orders</span>
          <strong>
            {statistics?.total_orders ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Pending Orders</span>
          <strong>
            {statistics?.pending_orders ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Delivered Orders</span>
          <strong>
            {statistics?.delivered_orders ?? 0}
          </strong>
        </div>

        <div className="admin-stat-card">
          <span>Total Revenue</span>

          <strong>
            Rs.{" "}
            {Number(
              statistics?.total_revenue ?? 0
            ).toFixed(2)}
          </strong>
        </div>

      </div>


      {/* POPULAR FOODS */}

      <section className="admin-popular-section">

        <div className="admin-section-heading">

          <h2>
            Popular Foods
          </h2>

          <p>
            Top foods based on ordered quantity.
          </p>

        </div>


        {popularFoods.length === 0 ? (

          <div className="admin-empty">
            No order data available yet.
          </div>

        ) : (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>Food</th>
                  <th>Quantity Ordered</th>
                </tr>
              </thead>

              <tbody>

                {popularFoods.map((food) => (

                  <tr key={food.food_id}>

                    <td>
                      {food.food_name}
                    </td>

                    <td>
                      {food.total_quantity}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}


export default AdminDashboard;