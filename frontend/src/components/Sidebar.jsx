import React from "react";
import logo from "../assets/logo.png";
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/authContext";
const Sidebar = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();


const handleLogout = () => {
  logout();
  navigate("/login");
};

  return (
    <div className="flex h-screen flex-col justify-between min-w-60 border-e border-gray-100 bg-white">
      {/* Top section with logo and navigation */}
      <div className="px-4 py-6">
        <img src={logo} width={100} className="mx-auto" alt="Logo" />

        <ul className="mt-10 space-y-4">
          <li>
            <Link
              to="/"
              className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Overview
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Products
            </Link>
          </li>
          
        </ul>
      </div>

      {/* Bottom section with logout */}
      <div className="px-4 py-6">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
