import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from "../components/Nav";
import AuthLayout from "./auth/_layout";
import UserLayout from "./user/_layout";
import Dashboard from "./user/dashboard";
import Error from "./pages/error";
import Customers from "./user/customers";
import AuthSignup from "./auth/signup";
import AuthLogin from "./auth/login";
import PrivateRoute from "./privateRoute";
import Orders from "./user/order";
import OrderDetails from "./user/orderDetails";
import Home from "./pages/home";
import PublicRoute from "./publicRoute";
import Profile from "./user/profile";
function Layout() {
  return (
    <Routes>
      <Route path="/" element={<Nav />}>
        <Route index element={<Home />} />
        {/* Auth routes */}
        <Route 
          path="auth" 
          element={
            <PublicRoute>
              <AuthLayout />  
            </PublicRoute>
          }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="signup" element={<AuthSignup />} />
        </Route>

        {/* Protected user routes */}
        <Route
          path="u"
          element={
            <PrivateRoute>
              <UserLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders-details/:id" element={<OrderDetails />} />
        </Route>

        {/* Catch-all for 404s */}
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
}

export default Layout;
