import { Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Toast from "../../../components/Toast";
import { useAuth } from "../../../context/AuthContext";

const MyProfile = () => {
  const { user } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const response = await api.get("/employees/profile");
      setEmployee(response.data);
      setFormData(response.data);
    } catch (_error) {
      showToast("Failed to fetch profile", "error");
    } finally {
      setLoading(false);
    }
    };
    
    if (user?._id) {
      fetchProfile();
    }
  }, [user]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/employees/${employee._id}`, formData);
      showToast("Profile updated successfully!", "success");
      setIsEditing(false);
      fetchProfile();
    } catch (_error) {
      showToast("Failed to update profile", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (!employee) return <div className="p-6">No profile data found</div>;

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">
          View and manage your personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-gray-600 text-sm mt-1">{employee.position}</p>
            <p className="text-gray-500 text-xs mt-2">
              {employee.department?.name}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {!isEditing ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Personal Information
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">
                        {employee.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">
                        {employee.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-bold text-gray-900 mb-2">
                      Work Information
                    </h4>
                    <p className="text-sm text-gray-600">
                      Employee ID:{" "}
                      <span className="font-medium">{employee.employeeId}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Position:{" "}
                      <span className="font-medium">{employee.position}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Hire Date:{" "}
                      <span className="font-medium">
                        {new Date(employee.hireDate).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Edit Profile
                </h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(employee);
                      }}
                      className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
