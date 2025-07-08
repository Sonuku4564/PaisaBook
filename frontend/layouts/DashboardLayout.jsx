// layouts/DashboardLayout.js
import { Outlet } from "react-router-dom";
import Sidebar from "../src/components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
