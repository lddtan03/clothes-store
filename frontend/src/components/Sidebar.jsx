import React, { useContext } from "react";
import { AdminAuthContext } from "./context/AdminAuth";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const { logout } = useContext(AdminAuthContext);

  return (
    <div className="card shadow mb-5 sidebar">
      <div className="card-body p-4">
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/categories">Categories</Link>
          </li>
          <li>
            <Link to="/admin/brands">Brands</Link>
          </li>
          <li>
            <Link to="/admin/products">Products</Link>
          </li>
          <li>
            <Link to="/admin/orders">Orders</Link>
          </li>
          <li>
            <a href="">Users</a>
          </li>
          <li>
            <Link to="/admin/shipping">Shipping</Link>
          </li>
          <li>
            <a href="">Change Password</a>
          </li>
          <li>
            <a href="#" onClick={logout}>
              Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
