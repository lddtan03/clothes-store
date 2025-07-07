import React, { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { Link } from "react-router-dom";

export const UserSidebar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <div className="card shadow mb-5 sidebar">
      <div className="card-body p-4">
        <ul>
          <li>
            <Link to="/account">Account</Link>
          </li>
          <li>
            <Link to="/account/orders">Orders</Link>
          </li>
          <li>
            <Link to="#">Change Password</Link>
          </li>
          <li>
            <Link to="#" onClick={logout}>
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};
