import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Toast from "../../../components/Toast";
import { useAuth } from "../../../context/AuthContext";

const MyPayroll = () => {
  const { user } = useAuth();
  const [payroll, setPayroll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMyPayroll();
  }, [user]);

  const fetchMyPayroll = async () => {
    try {
      const response = await api.get("/payroll");
      setPayroll(response.data);
    } catch (_error) {
      showToast("Failed to fetch payroll", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <LoadingSpinner />;

  const columns = [
    { key: "month", label: "Month" },
    { key: "basicSalary", label: "Basic Salary" },
    { key: "allowances", label: "Allowances" },
    { key: "deductions", label: "Deductions" },
    { key: "netSalary", label: "Net Salary" },
    { key: "status", label: "Status" },
  ];

  const formattedData = payroll.map((p) => ({
    ...p,
    month: `${p.month}/${p.year}`,
    basicSalary: `₹${p.basicSalary?.toLocaleString() || 0}`,
    allowances: `₹${p.allowances?.toLocaleString() || 0}`,
    deductions: `₹${p.deductions?.toLocaleString() || 0}`,
    netSalary: `₹${p.netSalary?.toLocaleString() || 0}`,
    status: p.isPaid ? "✅ Paid" : "⏳ Pending",
  }));

  const lastPayroll = payroll[payroll.length - 1];

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Payroll</h1>
        <p className="text-gray-600">View your salary and payment history</p>
      </div>

      {/* Current Salary Card */}
      {lastPayroll && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Basic Salary</p>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{lastPayroll.basicSalary?.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Allowances</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{lastPayroll.allowances?.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Deductions</p>
              <DollarSign className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ₹{lastPayroll.deductions?.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-600 text-sm font-medium">Net Salary</p>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">
              ₹{lastPayroll.netSalary?.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Payroll History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Payroll History
        </h3>
        {payroll.length > 0 ? (
          <DataTable columns={columns} data={formattedData} />
        ) : (
          <p className="text-gray-600 text-center py-6">
            No payroll records found
          </p>
        )}
      </div>
    </div>
  );
};

export default MyPayroll;
