import { FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useAuth } from "../../../context/AuthContext";

const ClientProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get(`/projects?client=${user._id}`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchProjects();
    }
  }, [user]);

  const columns = [
    {
      key: "title",
      header: "Project Title",
      accessor: (item) => item.title,
      sortable: true,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.status === "Completed"
              ? "bg-green-100 text-green-800"
              : item.status === "In Progress"
              ? "bg-blue-100 text-blue-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {item.status}
        </span>
      ),
      sortable: true,
    },
    {
      key: "deadline",
      header: "Deadline",
      accessor: (item) => new Date(item.deadline).toLocaleDateString(),
      sortable: true,
    },
    {
      key: "progress",
      header: "Progress",
      render: (item) => (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${item.progress || 0}%` }}
          ></div>
        </div>
      ),
      sortable: true,
    },
  ];

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-indigo-100 p-3 rounded-lg">
          <FolderKanban className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600">Track the progress of your projects</p>
        </div>
      </div>

      <DataTable columns={columns} data={projects} searchable={true} />
    </div>
  );
};

export default ClientProjects;
