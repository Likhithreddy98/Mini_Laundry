import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import StatusBadge from "../components/StatusBadge";
import toast from "react-hot-toast";

const STATUSES = ["", "RECEIVED", "PROCESSING", "READY", "DELIVERED"];
const GARMENT_TYPES = ["", "Shirt", "Pants", "Saree", "Kurta", "Jacket", "Bedsheet", "Towel"];

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", search: "", garmentType: "" });
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.garmentType) params.garmentType = filters.garmentType;

      const { data } = await api.get("/orders", { params });
      setOrders(data.orders);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success("Status updated");
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => setFilters({ status: "", search: "", garmentType: "" });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>All Orders</h2>
          <p>{orders.length} order(s) found</p>
        </div>
        <button className="btn-primary" onClick={() => navigate("/create-order")}>
          + New Order
        </button>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by name or phone..."
          className="filter-input"
        />

        <select name="status" value={filters.status} onChange={handleFilterChange} className="filter-select">
          <option value="">All Statuses</option>
          {STATUSES.filter(Boolean).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select name="garmentType" value={filters.garmentType} onChange={handleFilterChange} className="filter-select">
          <option value="">All Garments</option>
          {GARMENT_TYPES.filter(Boolean).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {(filters.status || filters.search || filters.garmentType) && (
          <button className="btn-ghost" onClick={clearFilters}>Clear</button>
        )}
      </div>

      {loading ? (
        <div className="page-loading">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found. <a href="/create-order">Create one →</a></p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Garment</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Est. Delivery</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  <td className="order-id">{order.orderId}</td>
                  <td>{order.customerName}</td>
                  <td>{order.phone}</td>
                  <td>{order.garmentType}</td>
                  <td>{order.quantity}</td>
                  <td className="amount">₹{order.totalBill}</td>
                  <td>{new Date(order.estimatedDelivery).toLocaleDateString("en-IN")}</td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                      disabled={updatingId === order.orderId}
                      className="status-select"
                    >
                      {STATUSES.filter(Boolean).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
