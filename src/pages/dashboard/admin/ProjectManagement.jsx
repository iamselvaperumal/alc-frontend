import { FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import FormInput from "../../../components/FormInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Modal from "../../../components/Modal";
import Toast from "../../../components/Toast";

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client: "",
    startDate: "",
    endDate: "",
    status: "Planning",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");
      setProjects(response.data);
    } catch (_error) {
      showToast("Failed to fetch projects", "error");
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
    setFormData({
      name: "",
      description: "",
      client: "",
      startDate: "",
      endDate: "",
      status: "Planning",
    });
    setModalOpen(true);
  };

  const handleEdit = (project) => {
    setEditMode(true);
    setSelectedProject(project);
    setFormData({
      name: project.name || "",
      description: project.description || "",
      client: project.client?._id || project.client || "",
      startDate: project.startDate?.split("T")[0] || "",
      endDate: project.endDate?.split("T")[0] || "",
      status: project.status || "Planning",
    });
    setModalOpen(true);
  };

  const handleDelete = async (project) => {
    if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
      try {
        await api.delete(`/projects/${project._id}`);
        showToast("Project deleted successfully", "success");
        fetchProjects();
      } catch (_error) {
        showToast("Failed to delete project", "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await api.put(`/projects/${selectedProject._id}`, formData);
        showToast("Project updated successfully", "success");
      } else {
        await api.post("/projects", formData);
        showToast("Project added successfully", "success");
      }
      setModalOpen(false);
      fetchProjects();
    } catch (_error) {
      showToast(
        _error.response?.data?.message || "Failed to save project",
        "error",
      );
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Planning: "bg-blue-100 text-blue-800",
      "In Progress": "bg-yellow-100 text-yellow-800",
      Completed: "bg-green-100 text-green-800",
      "On Hold": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const columns = [
    {
      key: "name",
      header: "Project Name",
      accessor: (item) => item.name,
      sortable: true,
    },
    {
      key: "client",
      header: "Client",
      accessor: (item) => item.client?.username || "N/A",
      sortable: true,
    },
    {
      key: "startDate",
      header: "Start Date",
      accessor: (item) =>
        item.startDate ? new Date(item.startDate).toLocaleDateString() : "N/A",
      sortable: true,
    },
    {
      key: "endDate",
      header: "End Date",
      accessor: (item) =>
        item.endDate ? new Date(item.endDate).toLocaleDateString() : "N/A",
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

  if (loading) return <LoadingSpinner fullPage message="Loading projects..." />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Project Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage projects</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FolderKanban className="w-5 h-5" />
          Add Project
        </button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchable={true}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editMode ? "Edit Project" : "Add New Project"}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Project Name"
            name="name"
            value={formData.name}
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
            label="Client"
            name="client"
            value={formData.client}
            onChange={handleInputChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Start Date"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              required
            />
            <FormInput
              label="End Date"
              name="endDate"
              type="date"
              value={formData.endDate}
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
              { value: "Planning", label: "Planning" },
              { value: "In Progress", label: "In Progress" },
              { value: "Completed", label: "Completed" },
              { value: "On Hold", label: "On Hold" },
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
              {editMode ? "Update" : "Add"} Project
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

export default ProjectManagement;
