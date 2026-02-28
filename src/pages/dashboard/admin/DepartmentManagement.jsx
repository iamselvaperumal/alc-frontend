import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import FormInput from "../../../components/FormInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Modal from "../../../components/Modal";
import Toast from "../../../components/Toast";

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get("/departments");
      setDepartments(response.data);
    } catch (_error) {
      showToast("Failed to fetch departments", "error");
    } finally {
      setLoading(false);
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

  const handleAdd = () => {
    setEditMode(false);
    setFormData({ name: "", description: "" });
    setModalOpen(true);
  };

  const handleEdit = (dept) => {
    setEditMode(true);
    setSelectedDept(dept);
    setFormData({
      name: dept.name || "",
      description: dept.description || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (dept) => {
    if (window.confirm(`Are you sure you want to delete ${dept.name}?`)) {
      try {
        await api.delete(`/departments/${dept._id}`);
        showToast("Department deleted successfully", "success");
        fetchDepartments();
      } catch (_error) {
        showToast("Failed to delete department", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/departments/${selectedDept._id}`, formData);
        showToast("Department updated successfully", "success");
      } else {
        await api.post("/departments", formData);
        showToast("Department added successfully", "success");
      }
      setModalOpen(false);
      fetchDepartments();
    } catch (_error) {
      showToast(
        _error.response?.data?.message || "Failed to save department",
        "error",
      );
    }
  };

  const columns = [
    {
      key: "name",
      header: "Department Name",
      accessor: (item) => item.name,
      render: (item) => (
        <a
          href={`/admin/departments/${item._id}`}
          className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
        >
          {item.name}
        </a>
      ),
      sortable: true,
    },
    {
      key: "description",
      header: "Description",
      accessor: (item) => item.description || "No description",
      sortable: false,
    },
  ];

  if (loading)
    return <LoadingSpinner fullPage message="Loading departments..." />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Department Management
          </h1>
          <p className="text-gray-600 mt-1">Organize your company structure</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Building2 className="w-5 h-5" />
          Add Department
        </button>
      </div>

      <DataTable
        columns={columns}
        data={departments}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable={true}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Department" : "Add New Department"}
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Department Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="e.g., Production, Quality Control"
          />
          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brief description of the department"
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
              {editMode ? "Update" : "Add"} Department
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

export default DepartmentManagement;
