import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import FormInput from "../../../components/FormInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Modal from "../../../components/Modal";
import Toast from "../../../components/Toast";

const AttendanceManagement = () => {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
    checkIn: "",
    checkOut: "",
  });

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/attendance");
      setAttendance(response.data);
    } catch (_error) {
      showToast("Failed to fetch attendance", "error");
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

  const handleMarkAttendance = () => {
    setFormData({
      employeeId: "",
      date: new Date().toISOString().split("T")[0],
      status: "Present",
      checkIn: "",
      checkOut: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/attendance", formData);
      showToast("Attendance marked successfully", "success");
      setModalOpen(false);
      fetchAttendance();
    } catch (_error) {
      showToast(
        _error.response?.data?.message || "Failed to mark attendance",
        "error",
      );
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Present: "bg-green-100 text-green-800",
      Absent: "bg-red-100 text-red-800",
      Leave: "bg-yellow-100 text-yellow-800",
      "Half Day": "bg-blue-100 text-blue-800",
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
      key: "date",
      header: "Date",
      accessor: (item) => new Date(item.date).toLocaleDateString(),
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
    {
      key: "checkIn",
      header: "Check In",
      accessor: (item) => item.checkIn || "N/A",
      sortable: false,
    },
    {
      key: "checkOut",
      header: "Check Out",
      accessor: (item) => item.checkOut || "N/A",
      sortable: false,
    },
  ];

  if (loading)
    return <LoadingSpinner fullPage message="Loading attendance..." />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-600 mt-1">Track employee attendance</p>
        </div>
        <button
          onClick={handleMarkAttendance}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Clock className="w-5 h-5" />
          Mark Attendance
        </button>
      </div>

      <DataTable columns={columns} data={attendance} searchable={true} />

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Mark Attendance"
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
              label: emp.user?.username || "Unknown",
            }))}
          />
          <FormInput
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
          <FormInput
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={handleInputChange}
            required
            options={[
              { value: "Present", label: "Present" },
              { value: "Absent", label: "Absent" },
              { value: "Leave", label: "Leave" },
              { value: "Half Day", label: "Half Day" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              label="Check In"
              name="checkIn"
              type="time"
              value={formData.checkIn}
              onChange={handleInputChange}
            />
            <FormInput
              label="Check Out"
              name="checkOut"
              type="time"
              value={formData.checkOut}
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
              Mark Attendance
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

export default AttendanceManagement;
