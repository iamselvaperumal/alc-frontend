import { Clock, DollarSign, FolderKanban } from "lucide-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import StatsCard from "../../components/StatsCard";
import DashboardLayout from "../../layouts/DashboardLayout";
import AttendanceTracking from "./employee/AttendanceTracking";
import MyPayroll from "./employee/MyPayroll";
import MyProfile from "./employee/MyProfile";
import MyTasks from "./employee/MyTasks";

import { ArrowRight, Briefcase } from "lucide-react";

const EmployeeDashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 p-8">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 mb-2">
              Employee Dashboard
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Welcome! Here's your performance and work overview.
            </p>
          </div>
          <Briefcase className="w-12 h-12 text-emerald-500 opacity-20" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatsCard
          title="Attendance This Month"
          value="22"
          subtitle="Days Present"
          icon={Clock}
          color="emerald"
        />
        <StatsCard
          title="Tasks Assigned"
          value="5"
          subtitle="Active Tasks"
          icon={FolderKanban}
          color="blue"
        />
        <StatsCard
          title="This Month Salary"
          value="₹45,000"
          subtitle="Pending Approval"
          icon={DollarSign}
          color="indigo"
        />
      </div>

      {/* Quick Actions and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions Card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-900">
                Quick Actions
              </h3>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/employee/attendance")}
                className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <Clock className="w-6 h-6" />
                  <span>Clock In/Out</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={() => navigate("/employee/tasks")}
                className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <FolderKanban className="w-6 h-6" />
                  <span>View My Tasks</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </button>
              <button
                onClick={() => navigate("/employee/payroll")}
                className="w-full group/btn relative overflow-hidden bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
                <div className="relative flex items-center justify-between">
                  <DollarSign className="w-6 h-6" />
                  <span>View Payroll</span>
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Border Animation */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-emerald-600 to-indigo-600 w-0 group-hover:w-full transition-all duration-500"></div>
        </div>

        {/* Recent Activity Card */}
        <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-300">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-gradient-to-b from-emerald-600 to-blue-500 rounded-full"></div>
              <h3 className="text-2xl font-bold text-gray-900">
                Recent Activity
              </h3>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">
                    Last Clock In
                  </p>
                  <p className="text-base font-semibold text-blue-700 mt-1">
                    Today at 9:00 AM
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-lg border border-emerald-200 hover:shadow-md transition-all duration-300">
                <div className="p-3 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700">
                  <FolderKanban className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Latest Task</p>
                  <p className="text-base font-semibold text-emerald-700 mt-1">
                    Production Order #1234
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center pt-4">
                <button
                  onClick={() => navigate("/employee/profile")}
                  className="flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors group/link"
                >
                  <span>View Full Profile</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Border Animation */}
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 w-0 group-hover:w-full transition-all duration-500"></div>
        </div>
      </div>
    </div>
  );
};

const EmployeeDashboard = () => {
  return (
    <DashboardLayout role="Employee">
      <Routes>
        <Route path="/" element={<EmployeeDashboardHome />} />
        <Route path="/profile" element={<MyProfile />} />
        <Route path="/attendance" element={<AttendanceTracking />} />
        <Route path="/tasks" element={<MyTasks />} />
        <Route path="/payroll" element={<MyPayroll />} />
      </Routes>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
