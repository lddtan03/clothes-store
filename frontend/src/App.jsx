import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Shop from "./components/Shop";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import { Login as AdminLogin } from "./components/admin/Login";
import { ToastContainer } from "react-toastify";
import Dashboard from "./components/admin/Dashboard";
import { AdminRequireAuth } from "./components/admin/AdminRequireAuth";

import { Show as ShowCategories } from "./components/admin/category/Show";
import { Create as CreateCategories } from "./components/admin/category/Create";
import { Edit as EditCategories } from "./components/admin/category/Edit";

import { Show as ShowBrands } from "./components/admin/brand/Show";
import { Create as CreateBrands } from "./components/admin/brand/Create";
import { Edit as EditBrands } from "./components/admin/brand/Edit";

import { Show as ShowProducts } from "./components/admin/product/Show";
import { Create as CreateProducts } from "./components/admin/product/Create";
import { Edit as EditProducts } from "./components/admin/product/Edit";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { RequireAuth } from "./components/RequireAuth";
import Confirmation from "./components/Confirmation";
import ShowOrders from "./components/admin/order/ShowOrders";
import OrderDetail from "./components/admin/order/OrderDetail";
import MyOrders from "./components/front/MyOrders";
import { OrderDetail as UserOrderDetatil } from "./components/front/OrderDetail";
import Shipping from "./components/admin/shipping/Shipping";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* User routes */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
          <Route path="/account/register" element={<Register />} />
          <Route path="/account/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/account"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />

          <Route
            path="/account/orders"
            element={
              <RequireAuth>
                <MyOrders />
              </RequireAuth>
            }
          />

          <Route
            path="/account/orders/details/:id"
            element={
              <RequireAuth>
                <UserOrderDetatil />
              </RequireAuth>
            }
          />

          <Route
            path="/checkout"
            element={
              <RequireAuth>
                <Checkout />
              </RequireAuth>
            }
          />

          <Route
            path="/order/confirmation/:id"
            element={
              <RequireAuth>
                <Confirmation />
              </RequireAuth>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRequireAuth>
                <Dashboard />
              </AdminRequireAuth>
            }
          />

          {/* Category */}
          <Route
            path="/admin/categories"
            element={
              <AdminRequireAuth>
                <ShowCategories />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/categories/create"
            element={
              <AdminRequireAuth>
                <CreateCategories />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/categories/edit/:id"
            element={
              <AdminRequireAuth>
                <EditCategories />
              </AdminRequireAuth>
            }
          />

          {/* Brand */}
          <Route
            path="/admin/brands"
            element={
              <AdminRequireAuth>
                <ShowBrands />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/brands/create"
            element={
              <AdminRequireAuth>
                <CreateBrands />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/brands/edit/:id"
            element={
              <AdminRequireAuth>
                <EditBrands />
              </AdminRequireAuth>
            }
          />

          {/* Product */}
          <Route
            path="/admin/products"
            element={
              <AdminRequireAuth>
                <ShowProducts />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/products/create"
            element={
              <AdminRequireAuth>
                <CreateProducts />
              </AdminRequireAuth>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminRequireAuth>
                <EditProducts />
              </AdminRequireAuth>
            }
          />

          {/* Order */}
          <Route
            path="/admin/orders"
            element={
              <AdminRequireAuth>
                <ShowOrders />
              </AdminRequireAuth>
            }
          />

          <Route
            path="/admin/orders/:id"
            element={
              <AdminRequireAuth>
                <OrderDetail />
              </AdminRequireAuth>
            }
          />

          {/* Shipping */}
          <Route
            path="/admin/shipping"
            element={
              <AdminRequireAuth>
                <Shipping />
              </AdminRequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
