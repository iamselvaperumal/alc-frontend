import { DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import FormInput from "../../../components/FormInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Modal from "../../../components/Modal";
import Toast from "../../../components/Toast";

const PayrollManagement = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    allowances: 0,
    deductions: 0,
  });

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await api.get("/payroll");
      setPayrolls(response.data);
    } catch (_error) {
      showToast("Failed to fetch payroll records", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (_error) {
      console.error("Failed to fetch employees", _error);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = () => {
    setFormData({
      employeeId: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      allowances: 0,
      deductions: 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/payroll", formData);
      showToast("Payroll generated successfully", "success");
      setModalOpen(false);
      fetchPayrolls();
    } catch (_error) {
      showToast(
        _error.response?.data?.message || "Failed to generate payroll",
        "error",
      );
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      Paid: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const columns = [
    {
      key: "employee",
      header: "Employee",
      accessor: (item) => item.employee?.user?.username || "N/A",
      sortable: true,
    },
    {
      key: "month",
      header: "Month/Year",
      accessor: (item) => `${item.month}/${item.year}`,
      sortable: true,
    },
    {
      key: "basicSalary",
      header: "Basic Salary",
      accessor: (item) => `₹${item.basicSalary?.toLocaleString()}`,
      sortable: true,
    },
    {
      key: "allowances",
      header: "Allowances",
      accessor: (item) => `₹${item.allowances?.toLocaleString()}`,
      sortable: false,
    },
    {
      key: "deductions",
      header: "Deductions",
      accessor: (item) => `₹${item.deductions?.toLocaleString()}`,
      sortable: false,
    },
    {
      key: "netSalary",
      header: "Net Salary",
      accessor: (item) => `₹${item.netSalary?.toLocaleString()}`,
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
        >
          {item.status}
        </span>
      ),
      sortable: true,
    },
  ];

  if (loading) return <LoadingSpinner fullPage message="Loading payroll..." />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payroll Management
          </h1>
          <p className="text-gray-600 mt-1">Manage employee salaries</p>
        </div>
        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <DollarSign className="w-5 h-5" />
          Generate Payroll
        </button>
      </div>

      <DataTable columns={columns} data={payrolls} searchable={true} />

      {/* Generate Payroll Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Generate Payroll"
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Employee"
            name="employeeId"
            type="select"
            value={formData.employeeId}
            onChange={handleInputChange}
            required
            options={employees.map((emp) => ({
              value: emp._id,
              label: `${emp.user?.username} - ₹${emp.salary?.toLocaleString()}`,
            }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Month"
              name="month"
              type="number"
              value={formData.month}
              onChange={handleInputChange}
              required
              min="1"
              max="12"
            />
            <FormInput
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Allowances"
              name="allowances"
              type="number"
              value={formData.allowances}
              onChange={handleInputChange}
            />
            <FormInput
              label="Deductions"
              name="deductions"
              type="number"
              value={formData.deductions}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Generate Payroll
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default PayrollManagement;
