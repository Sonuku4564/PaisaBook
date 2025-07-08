import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import SignIn from "./screens/Auth/SignIn";
import Signup from "./screens/Auth/Signup";
import DashboardLayout from "../layouts/DashboardLayout";
import { Toaster } from "react-hot-toast";

// Dashboard Screens
import OverViewScreen from "./screens/Dashboard/OverViewScreen";
import UserScreen from "./screens/Dashboard/UserScreen";
import ProductScreen from "./screens/Dashboard/ProductScreen";
import OrderScreen from "./screens/Dashboard/OrderScreen";

const App = () => {
  const { user, getCurrentUser } = useAuth();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await getCurrentUser(); // Updates context state
      setCheckingAuth(false);
    };
    checkAuth();
  }, [user]);

  if (checkingAuth) return null; // or a spinner if you prefer

  return (
    <div>
      <Toaster position="top-center" />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!user ? <SignIn /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" replace />}
        />

        {/* Protected Routes */}
        {user ? (
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<OverViewScreen />} />
            <Route path="users" element={<UserScreen />} />
            <Route path="products" element={<ProductScreen />} />
            <Route path="orders" element={<OrderScreen />} />
          </Route>
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
