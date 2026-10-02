import {
  Routes,
  Route,
} from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";

// PUBLIC PAGES
import Home from "../pages/public/Home";
import Foods from "../pages/public/Foods";
import FoodDetails from "../pages/public/FoodDetails";

// AUTH PAGES
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// CUSTOMER PAGES
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderConfirmation from "../pages/customer/OrderConfirmation";
import MyOrders from "../pages/customer/MyOrders";
import OrderDetails from "../pages/customer/OrderDetails";
import CustomerProfile from "../pages/customer/CustomerProfile";
import AdminRoute from "../components/common/AdminRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CategoryManagement from "../pages/admin/categories/CategoryManagement";
import FoodManagement from "../pages/admin/foods/FoodManagement";
import OrderManagement from "../pages/admin/orders/OrderManagement";
import CustomerManagement from "../pages/admin/customers/CustomerManagement";
import UserManagement from "../pages/admin/users/UserManagement";



function AppRoutes() {

  return (
    <Routes>

      {/* MAIN WEBSITE */}

      <Route element={<MainLayout />}>

        {/* PUBLIC ROUTES */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/foods"
          element={<Foods />}
        />

        <Route
          path="/foods/:foodId"
          element={<FoodDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />


        {/* PROTECTED CUSTOMER ROUTES */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-confirmation/:orderId"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* ADMIN ROUTES */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >

        {/* ADMIN DASHBOARD */}

        <Route
          index
          element={<AdminDashboard />}
        />


        {/* CATEGORY MANAGEMENT */}

        <Route
          path="categories"
          element={<CategoryManagement />}
        />

        {/* FOOD MANAGEMENT */}

        <Route
          path="foods"
          element={<FoodManagement />}
        />

        {/* ORDER MANAGEMENT */}

        <Route
          path="orders"
          element={<OrderManagement />}
        />

        {/* CUSTOMER MANAGEMENT */}

        <Route
          path="customers"
          element={<CustomerManagement />}
        />

        <Route
          path="users"
          element={<UserManagement />}
        />


      </Route>

      {/* AUTH ROUTES */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

    </Routes>
  );
}


export default AppRoutes;