import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../api/axios";
import DataTable from "../../../components/DataTable";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Toast from "../../../components/Toast";

const AttendanceTracking = () => {
  const { user } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [clockedIn, setClockedIn] = useState(false);
  const [todayAttendance, setTodayAttendance] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEmployeeAndAttendance();
    }
  }, [user]);

  const fetchEmployeeAndAttendance = async () => {
    try {
        // Get employee profile first to get the correct Employee ID
      const empRes = await api.get("/employees/profile");
      const eid = empRes.data._id;
      setEmployeeId(eid);

      const attRes = await api.get(`/attendance/employee/${eid}`);
      setAttendance(attRes.data);

      // pass the fetched list so we don't trigger the blocked /attendance endpoint
      await checkTodayStatus(eid, attRes.data);
    } catch (_error) {
      showToast("Failed to fetch attendance data", "error");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Look up today's attendance for the given employee.
   * If `records` are provided we use them to avoid hitting the
   * admin-only `/attendance` endpoint (403 for non-admins).
   */
  const checkTodayStatus = async (employeeId, records) => {
    try {
      const today = new Date().toISOString().split("T")[0];
      let data = records;

      if (!data) {
        // fallback to fetching employee-specific data
        const res = await api.get(`/attendance/employee/${employeeId}`);
        data = res.data;
      }

      // Filter for this employee and today's date
      const todayRecord = data.find(
        (att) =>
          (att.employee?._id === employeeId || att.employee === employeeId) &&
          att.date &&
          att.date.split("T")[0] === today
      );

      if (todayRecord) {
        setTodayAttendance(todayRecord);
        setClockedIn(!!todayRecord.checkInTime && !todayRecord.checkOutTime);
      }
    } catch (_error) {
      console.error("Error checking today status", _error);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleClockIn = async () => {
    try {
      // markAttendance handles both create and update depending on body
      if (!employeeId) throw new Error("Employee ID missing");

      const { data } = await api.post("/attendance", {
        employeeId,
        checkIn: true,
      });

      // update local state with the new record
      setTodayAttendance(data);
      setAttendance((prev) => [data, ...prev]);
      showToast("Clocked in successfully!", "success");
      setClockedIn(true);
    } catch (_error) {
      showToast("Failed to clock in", "error");
    }
  };

  const handleClockOut = async () => {
    try {
      if (!employeeId) {
        showToast("Unable to determine employee", "error");
        return;
      }

      if (!todayAttendance) {
        showToast("No attendance record for today", "error");
        return;
      }

      const { data } = await api.post("/attendance", {
        employeeId,
        checkOut: true,
      });

      // data will be the updated record
      setTodayAttendance(data);
      setAttendance((prev) =>
        prev.map((att) => (att._id === data._id ? data : att))
      );
      showToast("Clocked out successfully!", "success");
      setClockedIn(false);
    } catch (_error) {
      showToast("Failed to clock out", "error");
    }
  };

  if (loading) return <LoadingSpinner />;

  const columns = [
    { key: "date", label: "Date" },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "status", label: "Status" },
  ];

  const formattedData = attendance.map((att) => ({
    ...att,
    date: new Date(att.date).toLocaleDateString(),
    status: att.status || "Unknown",
  }));

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Attendance Tracking
        </h1>
        <p className="text-gray-600">
          Track your daily check-in and check-out times
        </p>
      </div>

      {/* Clock In/Out Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Today's Status</h2>
            <p className="text-gray-600 mt-1">
              {clockedIn
                ? "✅ You are clocked in"
                : "⏱️ You are not clocked in"}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClockIn}
              disabled={clockedIn}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Clock In
            </button>
            <button
              onClick={handleClockOut}
              disabled={!clockedIn}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Clock className="w-5 h-5" />
              Clock Out
            </button>
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Attendance History
        </h3>
        {attendance.length > 0 ? (
          <DataTable columns={columns} data={formattedData} />
        ) : (
          <p className="text-gray-600 text-center py-6">
            No attendance records found
          </p>
        )}
      </div>
    </div>
  );
};

export default AttendanceTracking;
