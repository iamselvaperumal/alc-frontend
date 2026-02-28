import { FolderKanban } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Toast from "../../../components/Toast";
import { useAuth } from "../../../context/AuthContext";

const MyTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMyTasks();
  }, [user]);

  const fetchMyTasks = async () => {
    try {
      // Get employee profile first
      const empRes = await api.get("/employees/profile");
      const employeeId = empRes.data._id;

      const response = await api.get("/production");
      const myTasks = response.data.filter(
        (task) => task.assignedTo?._id === employeeId || task.assignedTo === employeeId
      );
      setTasks(myTasks);
    } catch (_error) {
      showToast("Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusUpdate = async (task, newStage) => {
    try {
      await api.put(`/production/${task._id}`, { stage: newStage });
      showToast("Task updated successfully!", "success");
      fetchMyTasks();
    } catch (_error) {
      showToast("Failed to update task", "error");
    }
  };

  if (loading) return <LoadingSpinner />;

  const stages = [
    "Raw Material",
    "Weaving",
    "Dyeing",
    "Quality Check",
    "Packaging",
    "Completed",
  ];

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return task.stage !== "Completed";
    if (filter === "completed") return task.stage === "Completed";
    return true;
  });

  const getStageColor = (stage) => {
    const colors = {
      "Raw Material": "bg-gray-100 text-gray-800",
      Weaving: "bg-blue-100 text-blue-800",
      Dyeing: "bg-purple-100 text-purple-800",
      "Quality Check": "bg-yellow-100 text-yellow-800",
      Packaging: "bg-green-100 text-green-800",
      Completed: "bg-green-100 text-green-800",
    };
    return colors[stage] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Production Tasks
        </h1>
        <p className="text-gray-600">
          Track and update your assigned production tasks
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          All Tasks
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "pending"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <FolderKanban className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {task.jobName}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Order: {task.clientOrder?.orderNumber}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(task.stage)}`}
                >
                  {task.stage}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progress
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {task.progress || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${task.progress || 0}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                {task.stage !== "Completed" && (
                  <>
                    {stages.indexOf(task.stage) < stages.length - 1 && (
                      <button
                        onClick={() => {
                          const nextStage =
                            stages[stages.indexOf(task.stage) + 1];
                          handleStatusUpdate(task, nextStage);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                      >
                        Move to Next Stage
                      </button>
                    )}
                    {task.stage === stages[stages.length - 2] && (
                      <button
                        onClick={() => handleStatusUpdate(task, "Completed")}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Mark Complete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No tasks assigned</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
