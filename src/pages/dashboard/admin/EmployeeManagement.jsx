import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import FormInput from "../../../components/FormInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Modal from "../../../components/Modal";
import Toast from "../../../components/Toast";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    department: "",
    designation: "",
    salary: "",
    dateOfJoining: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (_error) {
      showToast("Failed to fetch employees", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (_error) {
      console.error("Failed to fetch departments", _error);
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

  const handleAddEmployee = () => {
    setEditMode(false);
    setFormData({
      username: "",
      email: "",
      password: "",
      department: "",
      designation: "",
      salary: "",
      dateOfJoining: "",
      phone: "",
      address: "",
    });
    setModalOpen(true);
  };

  const handleEditEmployee = (employee) => {
    setEditMode(true);
    setSelectedEmployee(employee);
    setFormData({
      username: employee.user?.username || "",
      email: employee.user?.email || "",
      password: "",
      department: employee.department?._id || "",
      designation: employee.designation || "",
      salary: employee.salary || "",
      dateOfJoining: employee.dateOfJoining?.split("T")[0] || "",
      phone: employee.phone || "",
      address: employee.address || "",
    });
    setModalOpen(true);
  };

  const handleDeleteEmployee = async (employee) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${employee.user?.username}?`,
      )
    ) {
      try {
        await api.delete(`/employees/${employee._id}`);
        showToast("Employee deleted successfully", "success");
        fetchEmployees();
      } catch (_error) {
        showToast("Failed to delete employee", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/employees/${selectedEmployee._id}`, formData);
        showToast("Employee updated successfully", "success");
      } else {
        await api.post("/employees", formData);
        showToast("Employee added successfully", "success");
      }
      setModalOpen(false);
      fetchEmployees();
    } catch (_error) {
      showToast(
        _error.response?.data?.message || "Failed to save employee",
        "error",
      );
    }
  };

  const columns = [
    {
      key: "name",
      header: "Name",
      accessor: (item) => item.user?.username || "N/A",
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      accessor: (item) => item.user?.email || "N/A",
      sortable: true,
    },
    {
      key: "department",
      header: "Department",
      accessor: (item) => item.department?.name || "N/A",
      sortable: true,
    },
    {
      key: "designation",
      header: "Designation",
      accessor: (item) => item.designation || "N/A",
      sortable: true,
    },
    {
      key: "salary",
      header: "Salary",
      accessor: (item) =>
        item.salary ? `₹${item.salary.toLocaleString()}` : "N/A",
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      accessor: (item) => (item.isActive ? "Active" : "Inactive"),
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
      ),
      sortable: false,
    },
  ];

  if (loading)
    return <LoadingSpinner fullPage message="Loading employees..." />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your workforce</p>
        </div>
        <button
          onClick={handleAddEmployee}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Add Employee
        </button>
      </div>

      <DataTable
        columns={columns}
        data={employees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
        searchable={true}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Employee" : "Add New Employee"}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              disabled={editMode}
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={editMode}
            />
            {!editMode && (
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Leave empty for default (123456)"
              />
            )}
            <FormInput
              label="Department"
              name="department"
              type="select"
              value={formData.department}
              onChange={handleInputChange}
              required
              options={departments.map((dept) => ({
                value: dept._id,
                label: dept.name,
              }))}
            />
            <FormInput
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Date of Joining"
              name="dateOfJoining"
              type="date"
              value={formData.dateOfJoining}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <FormInput
            label="Address"
            name="address"
            type="textarea"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
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
              {editMode ? "Update" : "Add"} Employee
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast Notification */}
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

export default EmployeeManagement;
