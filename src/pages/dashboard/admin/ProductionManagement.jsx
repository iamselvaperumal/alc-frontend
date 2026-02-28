import { Package } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import FormInput from "../../../components/FormInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Modal from "../../../components/Modal";
import Toast from "../../../components/Toast";

const ProductionManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    taskName: "",
    description: "",
    assignedTo: "",
    quantity: "",
    dueDate: "",
    status: "Pending",
  });

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/production");
      setTasks(response.data);
    } catch (_error) {
      showToast("Failed to fetch production tasks", "error");
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

  const handleAdd = () => {
    setEditMode(false);
    setFormData({
      taskName: "",
      description: "",
      assignedTo: "",
      quantity: "",
      dueDate: "",
      status: "Pending",
    });
    setModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditMode(true);
    setSelectedTask(task);
    setFormData({
      taskName: task.taskName || "",
      description: task.description || "",
      assignedTo: task.assignedTo?._id || "",
      quantity: task.quantity || "",
      dueDate: task.dueDate?.split("T")[0] || "",
      status: task.status || "Pending",
    });
    setModalOpen(true);
  };

  const handleDelete = async (task) => {
    if (window.confirm(`Are you sure you want to delete ${task.taskName}?`)) {
      try {
        await api.delete(`/production/${task._id}`);
        showToast("Task deleted successfully", "success");
        fetchTasks();
      } catch (_error) {
        showToast("Failed to delete task", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/production/${selectedTask._id}`, formData);
        showToast("Task updated successfully", "success");
      } else {
        await api.post("/production", formData);
        showToast("Task created successfully", "success");
      }
      setModalOpen(false);
      fetchTasks();
    } catch (_error) {
      showToast(
        _error.response?.data?.message || "Failed to save task",
        "error",
      );
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-yellow-100 text-yellow-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Completed: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const columns = [
    {
      key: "taskName",
      header: "Task Name",
      accessor: (item) => item.taskName,
      sortable: true,
    },
    {
      key: "assignedTo",
      header: "Assigned To",
      accessor: (item) => item.assignedTo?.user?.username || "Unassigned",
      sortable: true,
    },
    {
      key: "quantity",
      header: "Quantity",
      accessor: (item) => item.quantity || "N/A",
      sortable: true,
    },
    {
      key: "dueDate",
      header: "Due Date",
      accessor: (item) =>
        item.dueDate ? new Date(item.dueDate).toLocaleDateString() : "N/A",
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

  if (loading)
    return <LoadingSpinner fullPage message="Loading production tasks..." />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Production Management
          </h1>
          <p className="text-gray-600 mt-1">
            Track production tasks and workflow
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Package className="w-5 h-5" />
          Add Task
        </button>
      </div>

      <DataTable
        columns={columns}
        data={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable={true}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Production Task" : "Add Production Task"}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Task Name"
            name="taskName"
            value={formData.taskName}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleInputChange}
          />
          <FormInput
            label="Assign To"
            name="assignedTo"
            type="select"
            value={formData.assignedTo}
            onChange={handleInputChange}
            options={employees.map((emp) => ({
              value: emp._id,
              label: emp.user?.username || "Unknown",
            }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleInputChange}
            />
            <FormInput
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <FormInput
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleInputChange}
            required
            options={[
              { value: "Pending", label: "Pending" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
            ]}
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
              {editMode ? "Update" : "Add"} Task
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

export default ProductionManagement;
