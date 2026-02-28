import {
  Building2,
  Clock,
  DollarSign,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = ({ children, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = {
    Admin: [
      { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { path: "/admin/employees", label: "Employees", icon: Users },
      { path: "/admin/departments", label: "Departments", icon: Building2 },
      { path: "/admin/projects", label: "Projects", icon: FolderKanban },
      { path: "/admin/attendance", label: "Attendance", icon: Clock },
      { path: "/admin/payroll", label: "Payroll", icon: DollarSign },
      { path: "/admin/production", label: "Production", icon: Package },
      { path: "/admin/orders", label: "Orders", icon: ShoppingCart },
    ],
    Employee: [
      { path: "/employee", label: "Dashboard", icon: LayoutDashboard },
      { path: "/employee/profile", label: "My Profile", icon: Users },
      { path: "/employee/attendance", label: "Attendance", icon: Clock },
      { path: "/employee/tasks", label: "My Tasks", icon: FolderKanban },
      { path: "/employee/payroll", label: "Payroll", icon: DollarSign },
    ],
    Client: [
      { path: "/client", label: "Dashboard", icon: LayoutDashboard },
      { path: "/client/orders", label: "My Orders", icon: ShoppingCart },
      { path: "/client/enquiry", label: "Enquiries", icon: Package },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">ALC TEX</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User info */}
          <div className="p-4 border-b bg-gray-50">
            <p className="text-sm font-medium text-gray-900">
              {user?.username}
            </p>
            <p className="text-xs text-gray-600">{role}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-bold">ALC TEX</h1>
            <div className="w-6" /> {/* Spacer */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
