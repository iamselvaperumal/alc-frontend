import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import FormInput from "../../../components/FormInput";
import Toast from "../../../components/Toast";
import { useAuth } from "../../../context/AuthContext";

const PlaceOrder = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [fabricTypes, setFabricTypes] = useState([]);
  const [items, setItems] = useState([
    { fabricType: "", quantity: 0, pricePerUnit: 0 },
  ]);
  const [formData, setFormData] = useState({
    orderNumber: `ORD-${Date.now()}`,
    deliveryDate: "",
    deliveryAddress: "",
    advanceAmount: 0,
  });

  useEffect(() => {
    const fetchFabricTypes = async () => {
      try {
        const response = await api.get("/orders/fabrics");
        setFabricTypes(response.data);
      } catch (error) {
        console.error("Error fetching fabric types:", error);
        showToast("Failed to load fabric types", "error");
      }
    };
    fetchFabricTypes();
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "quantity" || field === "pricePerUnit" ? Number(value) : value;
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { fabricType: "", quantity: 0, pricePerUnit: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotal = () => {
    return items.reduce(
      (total, item) => total + item.quantity * item.pricePerUnit,
      0,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items[0].fabricType || !items[0].quantity || !items[0].pricePerUnit) {
      showToast("Please fill in all item details", "error");
      return;
    }

    if (!formData.deliveryDate || !formData.deliveryAddress) {
      showToast("Please fill in delivery details", "error");
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        ...formData,
        items,
        totalAmount: calculateTotal(),
        client: user?._id,
      };

      await api.post("/orders", orderData);
      showToast("Order placed successfully!", "success");

      // Reset form
      setFormData({
        orderNumber: `ORD-${Date.now()}`,
        deliveryDate: "",
        deliveryAddress: "",
        advanceAmount: 0,
      });
      setItems([{ fabricType: "", quantity: 0, pricePerUnit: 0 }]);
    } catch (_error) {
      showToast(
        error.response?.data?.message || "Failed to place order",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Place New Order
        </h1>
        <p className="text-gray-600">
          Create a new order for our textile products
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Order Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Information
              </h3>
              <FormInput
                label="Order Number"
                name="orderNumber"
                value={formData.orderNumber}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Items
              </h3>
              <div className="space-y-4 mb-4">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">
                        Item {index + 1}
                      </h4>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Fabric Type
                        </label>
                        <select
                          value={item.fabricType}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "fabricType",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          required
                        >
                          <option value="">Select fabric</option>
                          {fabricTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="Units"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price per Unit
                        </label>
                        <input
                          type="number"
                          value={item.pricePerUnit}
                          onChange={(e) =>
                            handleItemChange(
                              index,
                              "pricePerUnit",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2"
                          placeholder="₹"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addItem}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm"
              >
                + Add Another Item
              </button>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Delivery Details
              </h3>
              <FormInput
                label="Delivery Date"
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleFormChange}
                required
              />
              <FormInput
                label="Delivery Address"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleFormChange}
                placeholder="Enter full delivery address"
                required
              />
              <FormInput
                label="Advance Amount (Optional)"
                type="number"
                name="advanceAmount"
                value={formData.advanceAmount}
                onChange={handleFormChange}
                placeholder="₹"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 mb-4">
              {items.map(
                (item, idx) =>
                  item.fabricType && (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.fabricType} x {item.quantity}
                      </span>
                      <span className="font-medium text-gray-900">
                        ₹{(item.quantity * item.pricePerUnit).toLocaleString()}
                      </span>
                    </div>
                  ),
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{calculateTotal().toLocaleString()}
                </span>
              </div>
              {formData.advanceAmount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Advance</span>
                  <span className="font-medium text-gray-900">
                    -₹{formData.advanceAmount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-blue-600">
                    ₹{calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
