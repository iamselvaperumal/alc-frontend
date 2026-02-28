import {
    ArrowRight,
    Award,
    Building2,
    Clock,
    DollarSign,
    FolderKanban,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import api from "../../api/axios";
import StatsCard from "../../components/StatsCard";
import DashboardLayout from "../../layouts/DashboardLayout";

// Import admin management pages
import AttendanceManagement from "./admin/AttendanceManagement";
import AwardManagement from "./admin/AwardManagement";
import DepartmentDetails from "./admin/DepartmentDetails";
import DepartmentManagement from "./admin/DepartmentManagement";
import EmployeeManagement from "./admin/EmployeeManagement";
import OrderManagement from "./admin/OrderManagement";
import PayrollManagement from "./admin/PayrollManagement";
import ProductionManagement from "./admin/ProductionManagement";
import ProjectManagement from "./admin/ProjectManagement";

const AdminDashboardHome = () => {
  const [stats, setStats] = useState({
    employees: 0,
    projects: 0,
    departments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empRes, deptRes] = await Promise.all([
          api.get("/employees"),
          api.get("/departments"),
        ]);

        let projCount = 0;
        try {
          const projRes = await api.get("/projects");
          projCount = projRes.data.length;
        } catch (e) {
          console.log("No projects fetch error or empty");
        }

        setStats({
          employees: empRes.data.length,
          projects: projCount,
          departments: deptRes.data.length,
        });
      } catch (_error) {
        console.error("Error fetching admin stats", _error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      to: "/admin/employees",
      label: "Manage Employees",
      icon: Users,
      color: "blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      to: "/admin/departments",
      label: "Manage Departments",
      icon: Building2,
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600",
    },
    {
      to: "/admin/projects",
      label: "Manage Projects",
      icon: FolderKanban,
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      to: "/admin/attendance",
      label: "Track Attendance",
      icon: Clock,
      color: "amber",
      gradient: "from-amber-500 to-amber-600",
    },
    {
      to: "/admin/payroll",
      label: "Manage Payroll",
      icon: DollarSign,
      color: "cyan",
      gradient: "from-cyan-500 to-cyan-600",
    },
    {
      to: "/admin/production",
      label: "Production Tasks",
      icon: Package,
      color: "violet",
      gradient: "from-violet-500 to-violet-600",
    },
    {
      to: "/admin/orders",
      label: "Client Orders",
      icon: ShoppingCart,
      color: "orange",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      to: "/admin/awards",
      label: "Awards & Certs",
      icon: Award,
      color: "rose",
      gradient: "from-rose-500 to-rose-600",
    },
  ];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="inline-block">
            <TrendingUp className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          </div>
          <p className="text-lg font-semibold text-gray-900">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Welcome back! Here's your business overview at a glance.
            </p>
          </div>
          <TrendingUp className="w-12 h-12 text-emerald-500 opacity-20" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <StatsCard
          title="Total Employees"
          value={stats.employees}
          subtitle="Active Staff Members"
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Departments"
          value={stats.departments}
          subtitle="Operational Units"
          icon={Building2}
          color="emerald"
        />
        <StatsCard
          title="Active Projects"
          value={stats.projects}
          subtitle="Ongoing Initiatives"
          icon={FolderKanban}
          color="indigo"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg backdrop-blur-sm border border-gray-100 p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-600 to-blue-500 rounded-full"></div>
          <h2 className="text-3xl font-bold text-gray-900">Quick Actions</h2>
        </div>
        <nav className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.to}
                to={action.to}
                className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-transparent"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  {/* Icon Container */}
                  <div
                    className={`mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br ${action.gradient} shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-blue-600 transition-all duration-300">
                    {action.label}
                  </h3>

                  {/* Arrow */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-600 transition-colors">
                      Manage
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-600 transition-all duration-300 group-hover:translate-x-1" />
                  </div>
                </div>

                {/* Bottom Border Animation */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 w-0 group-hover:w-full transition-all duration-300"></div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <DashboardLayout role="Admin">
      <Routes>
        <Route path="/" element={<AdminDashboardHome />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/departments" element={<DepartmentManagement />} />
        <Route path="/departments/:id" element={<DepartmentDetails />} />
        <Route path="/projects" element={<ProjectManagement />} />
        <Route path="/attendance" element={<AttendanceManagement />} />
        <Route path="/payroll" element={<PayrollManagement />} />
        <Route path="/production" element={<ProductionManagement />} />
        <Route path="/orders" element={<OrderManagement />} />
        <Route path="/awards" element={<AwardManagement />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
