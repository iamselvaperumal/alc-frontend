import { Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../api/axios";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Modal from "../../../components/Modal";
import Toast from "../../../components/Toast";
import { useAuth } from "../../../context/AuthContext";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, [user]);

  const fetchMyOrders = async () => {
    try {
      const response = await api.get("/orders");
      const myOrders = response.data.filter(
        (order) => order.client?._id === user?._id,
      );
      setOrders(myOrders);
    } catch (_error) {
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await api.put(`/orders/${orderId}`, { status: "Cancelled" });
        showToast("Order cancelled successfully", "success");
        fetchMyOrders();
      } catch (_error) {
        showToast("Failed to cancel order", "error");
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  const getStatusColor = (status) => {
    const colors = {
      Received: "bg-yellow-100 text-yellow-800",
      "In Production": "bg-blue-100 text-blue-800",
      "Quality Check": "bg-purple-100 text-purple-800",
      Ready: "bg-green-100 text-green-800",
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your orders</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                  <ShoppingCart className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.items?.length || 0} item(s) · ₹
                      {order.totalAmount?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Order Progress
                  </span>
                  <span className="text-sm text-gray-600">{order.status}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${
                        order.status === "Delivered"
                          ? 100
                          : order.status === "Ready"
                            ? 80
                            : order.status === "Quality Check"
                              ? 60
                              : order.status === "In Production"
                                ? 40
                                : order.status === "Received"
                                  ? 20
                                  : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Order Details */}
              <div className="bg-gray-50 rounded p-3 mb-4 text-sm">
                <p className="text-gray-600">
                  <span className="font-medium">Order Date:</span>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                {order.deliveryDate && (
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Delivery Date:</span>{" "}
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewDetails(order)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  View Details
                </button>
                {order.status !== "Delivered" &&
                  order.status !== "Cancelled" && (
                    <button
                      onClick={() => handleCancelOrder(order._id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              No orders found. Place your first order!
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedOrder(null);
          }}
          title={`Order Details - ${selectedOrder.orderNumber}`}
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Items</h4>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded mb-2">
                  <p className="font-medium text-gray-900">{item.fabricType}</p>
                  <p className="text-sm text-gray-600">
                    Quantity: {item.quantity} units
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{item.pricePerUnit?.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900">
                  ₹{selectedOrder.totalAmount?.toLocaleString()}
                </span>
              </div>
              {selectedOrder.advanceAmount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Advance Paid:</span>
                  <span className="font-bold text-gray-900">
                    ₹{selectedOrder.advanceAmount?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyOrders;
