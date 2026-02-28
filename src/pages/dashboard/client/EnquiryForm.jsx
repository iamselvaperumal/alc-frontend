import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import FormInput from "../../../components/FormInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Toast from "../../../components/Toast";
import { useAuth } from "../../../context/AuthContext";

const EnquiryForm = () => {
  const { user } = useAuth();
  const [myEnquiries, setMyEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    email: user?.email || "",
    phone: "",
  });

  useEffect(() => {
    fetchMyEnquiries();
  }, [user]);

  const fetchMyEnquiries = async () => {
    try {
      const response = await api.get("/enquiries");
      const myEnquiries = response.data.filter((e) => e.email === user?.email);
      setMyEnquiries(myEnquiries);
    } catch (_error) {
      showToast("Failed to fetch enquiries", "error");
    } finally {
      setFetchLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh [1]

    // 1. Validation Check
    if (!formData.subject || !formData.message || !formData.email) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);

    try {
      // 2. API Call with safety check for user object
      await api.post("/api/enquiry", {
        ...formData,
        name: user?.username || "Anonymous", // Safety check for null user
        status: "New",
      });

      showToast(
        "Enquiry submitted successfully! We will respond soon.",
        "success",
      );

      // 3. Reset form
      setFormData({
        subject: "",
        message: "",
        email: user?.email || "",
        phone: "",
      });

      // 4. Refresh data
      if (typeof fetchMyEnquiries === "function") {
        fetchMyEnquiries();
      }
    } catch (_error) {
      // Improved Error Handling
      console.error("Submission error:", _error);
      showToast(
        _error.response?.data?.message || "Failed to submit enquiry",
        "error",
      );
    } finally {
      setLoading(false); // Ensures loader hides [3]
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      New: "bg-yellow-100 text-yellow-800",
      Read: "bg-blue-100 text-blue-800",
      Replied: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Enquiry</h1>
        <p className="text-gray-600">
          Contact us with your questions and inquiries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <FormInput
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="What is this enquiry about?"
              required
            />

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <FormInput
              label="Phone (Optional)"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Your contact number"
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="6"
                placeholder="Please provide detailed information about your enquiry"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Why Contact Us?
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li>✓ Bulk order discounts</li>
              <li>✓ Customization options</li>
              <li>✓ Technical specifications</li>
              <li>✓ Delivery schedules</li>
              <li>✓ Payment terms</li>
              <li>✓ Sample availability</li>
            </ul>
          </div>
        </div>
      </div>

      {/* My Enquiries */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Enquiries</h2>

        {fetchLoading ? (
          <LoadingSpinner />
        ) : myEnquiries.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {myEnquiries.map((enquiry) => (
                  <tr key={enquiry._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">
                        {enquiry.subject}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {enquiry.message}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(enquiry.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(enquiry.status)}`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No enquiries yet. Submit one above!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryForm;
