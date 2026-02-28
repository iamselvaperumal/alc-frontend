import { ArrowLeft, Building2, FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import LoadingSpinner from "../../../components/LoadingSpinner";

const DepartmentDetails = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, projRes] = await Promise.all([
          api.get(`/departments/${id}`),
          api.get("/projects"), // Ideally this should be /departments/:id/projects if API supported it
        ]);

        setDepartment(deptRes.data);
        
        // Filter projects for this department since backend might not have dedicated endpoint
        const deptProjects = projRes.data.filter(
          (p) => p.department?._id === id || p.department === id
        );
        setProjects(deptProjects);
      } catch (error) {
        console.error("Error fetching department details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const columns = [
    {
      key: "name",
      header: "Project Name",
      accessor: (item) => item.name,
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
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {item.status}
        </span>
      ),
      sortable: true,
    },
    {
      key: "client",
      header: "Client",
      accessor: (item) => item.client?.username || "N/A",
      sortable: true,
    },
  ];

  if (loading) return <LoadingSpinner fullPage />;
  if (!department) return <div className="p-6">Department not found</div>;

  return (
    <div className="p-6">
      <Link
        to="/admin/departments"
        className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Departments
      </Link>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {department.name}
              </h1>
              <p className="text-emerald-100 text-lg">
                {department.description || "No description available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            Active Projects ({projects.length})
          </h2>
        </div>

        <DataTable columns={columns} data={projects} searchable={true} />
      </div>
    </div>
  );
};

export default DepartmentDetails;
