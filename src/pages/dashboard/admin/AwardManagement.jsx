import { Award } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import FormInput from "../../../components/FormInput";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Modal from "../../../components/Modal";
import Toast from "../../../components/Toast";

const AwardManagement = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    description: "",
    category: "ISO",
  });

  useEffect(() => {
    fetchAwards();
  }, []);

  const fetchAwards = async () => {
    try {
      const response = await api.get("/awards");
      setAwards(response.data);
    } catch (_error) {
      showToast("Failed to fetch awards", "error");
    } finally {
      setLoading(false);
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

  const handleOpenModal = (award = null) => {
    if (award) {
      setFormData(award);
      setEditingId(award._id);
    } else {
      setFormData({
        image: "",
        title: "",
        description: "",
        category: "ISO",
      });
      setEditingId(null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/awards/${editingId}`, formData);
        showToast("Award updated successfully", "success");
      } else {
        await api.post("/awards", formData);
        showToast("Award created successfully", "success");
      }
      setModalOpen(false);
      fetchAwards();
    } catch (_error) {
      showToast(
        _error.response?.data?.message || "Failed to save award",
        "error",
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this award?")) {
      try {
        await api.delete(`/awards/${id}`);
        showToast("Award deleted successfully", "success");
        fetchAwards();
      } catch (_error) {
        showToast("Failed to delete award", "error");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const categories = ["ISO", "Certification", "Award", "Recognition"];

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Awards & Certifications
          </h1>
          <p className="text-gray-600 mt-1">
            Manage company awards and certifications
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add Award
        </button>
      </div>

      {/* Awards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.length > 0 ? (
          awards.map((award) => (
            <div
              key={award._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {award.image && (
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-full h-48 object-cover bg-gray-200"
                />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">
                    {award.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded whitespace-nowrap ml-2">
                    {award.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {award.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(award)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(award._id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No awards yet. Add your first award!
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Award" : "Add New Award"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Award title"
            required
          />

          <FormInput
            label="Image URL"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Award description"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingId ? "Update Award" : "Create Award"}
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AwardManagement;
