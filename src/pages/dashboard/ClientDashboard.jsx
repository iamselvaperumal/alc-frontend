import { Package, ShoppingCart } from "lucide-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import StatsCard from "../../components/StatsCard";
import DashboardLayout from "../../layouts/DashboardLayout";
import ClientProjects from "./client/ClientProjects";
import EnquiryForm from "./client/EnquiryForm";
import MyOrders from "./client/MyOrders";
import PlaceOrder from "./client/PlaceOrder";

import { ArrowRight, Zap } from "lucide-react";

const ClientDashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50 p-8">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-orange-600 to-blue-600 mb-2">
              Client Dashboard
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Track your orders, manage enquiries, and monitor production.
            </p>
          </div>
          <ShoppingCart className="w-12 h-12 text-rose-500 opacity-20" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <StatsCard
          title="Active Orders"
          value="3"
          subtitle="In Production"
          icon={ShoppingCart}
          color="blue"
        />
        <StatsCard
          title="Total Orders"
          value="12"
          subtitle="All Time"
          icon={Package}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-10 hover:shadow-2xl transition-all duration-300">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-rose-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-gradient-to-b from-rose-600 to-orange-500 rounded-full"></div>
            <h3 className="text-3xl font-bold text-gray-900">Quick Actions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Place New Order Button */}
            <button
              onClick={() => navigate("/client/place-order")}
              className="group/item relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-8 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-500 hover:border-blue-400"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover/item:opacity-10 transition-opacity"></div>
              <div className="relative flex flex-col items-center justify-center gap-3">
                <ShoppingCart className="w-8 h-8" />
                <span>Place New Order</span>
                <ArrowRight className="w-5 h-5 group-hover/item:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Send Enquiry Button */}
            <button
              onClick={() => navigate("/client/enquiry")}
              className="group/item relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 text-white px-6 py-8 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 border border-emerald-500 hover:border-emerald-400"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover/item:opacity-10 transition-opacity"></div>
              <div className="relative flex flex-col items-center justify-center gap-3">
                <Zap className="w-8 h-8" />
                <span>Send Enquiry</span>
                <ArrowRight className="w-5 h-5 group-hover/item:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* View Orders Button */}
            <button
              onClick={() => navigate("/client/orders")}
              className="group/item relative overflow-hidden bg-gradient-to-br from-indigo-600 to-indigo-700 text-white px-6 py-8 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 border border-indigo-500 hover:border-indigo-400"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover/item:opacity-10 transition-opacity"></div>
              <div className="relative flex flex-col items-center justify-center gap-3">
                <Package className="w-8 h-8" />
                <span>View My Orders</span>
                <ArrowRight className="w-5 h-5 group-hover/item:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* View Projects Button */}
            <button
              onClick={() => navigate("/client/projects")}
              className="group/item relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-700 text-white px-6 py-8 rounded-xl font-bold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 border border-purple-500 hover:border-purple-400"
            >
              <div className="absolute inset-0 bg-white opacity-0 group-hover/item:opacity-10 transition-opacity"></div>
              <div className="relative flex flex-col items-center justify-center gap-3">
                <Package className="w-8 h-8" />
                <span>View My Projects</span>
                <ArrowRight className="w-5 h-5 group-hover/item:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Border Animation */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-600 to-indigo-600 w-0 group-hover:w-full transition-all duration-500"></div>
      </div>
    </div>
  );
};

const ClientDashboard = () => {
  return (
    <DashboardLayout role="Client">
      <Routes>
        <Route path="/" element={<ClientDashboardHome />} />
        <Route path="/orders" element={<MyOrders />} />
        <Route path="/projects" element={<ClientProjects />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/enquiry" element={<EnquiryForm />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ClientDashboard;
