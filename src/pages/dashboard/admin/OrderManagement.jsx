import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import DataTable from '../../../components/DataTable';
import LoadingSpinner from '../../../components/LoadingSpinner';
import Toast from '../../../components/Toast';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders');
            setOrders(response.data);
        } catch (_error) {
            showToast('Failed to fetch orders', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleUpdateStatus = async (order, newStatus) => {
        try {
            await api.put(`/orders/${order._id}`, { status: newStatus });
            showToast('Order status updated successfully', 'success');
            fetchOrders();
        } catch (_error) {
            showToast('Failed to update order status', 'error');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Pending: 'bg-yellow-100 text-yellow-800',
            'In Production': 'bg-blue-100 text-blue-800',
            Shipped: 'bg-purple-100 text-purple-800',
            Delivered: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const columns = [
        {
            key: 'orderNumber',
            header: 'Order #',
            accessor: (item) => item.orderNumber || item._id.substring(0, 8).toUpperCase(),
            sortable: true
        },
        {
            key: 'client',
            header: 'Client',
            accessor: (item) => item.client?.user?.username || 'N/A',
            sortable: true
        },
        {
            key: 'productName',
            header: 'Product',
            accessor: (item) => item.productName,
            sortable: true
        },
        {
            key: 'quantity',
            header: 'Quantity',
            accessor: (item) => item.quantity,
            sortable: true
        },
        {
            key: 'totalAmount',
            header: 'Amount',
            accessor: (item) => item.totalAmount ? `₹${item.totalAmount.toLocaleString()}` : 'N/A',
            sortable: true
        },
        {
            key: 'deliveryDate',
            header: 'Delivery Date',
            accessor: (item) => item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'N/A',
            sortable: true
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                </span>
            ),
            sortable: true
        }
    ];

    const handleView = (order) => {
        // Show order details in an alert for now (can be enhanced with a modal later)
        alert(`Order Details:\n\nProduct: ${order.productName}\nQuantity: ${order.quantity}\nTotal: ₹${order.totalAmount?.toLocaleString()}\nStatus: ${order.status}\nDelivery Date: ${new Date(order.deliveryDate).toLocaleDateString()}`);
    };

    if (loading) return <LoadingSpinner fullPage message="Loading orders..." />;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600 mt-1">Track and manage client orders</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-blue-600">{orders.length} Total Orders</span>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={orders}
                onView={handleView}
                searchable={true}
            />

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

export default OrderManagement;
