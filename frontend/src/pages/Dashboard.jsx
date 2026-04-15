import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  RECEIVED:   "#3b82f6",
  PROCESSING: "#f59e0b",
  READY:      "#10b981",
  DELIVERED:  "#6b7280",
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/orders/dashboard");
      setStats(data);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="page-loading">Loading dashboard...</div>;

  const { totalOrders, totalRevenue, statusBreakdown } = stats;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your laundry orders</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <span className="stat-label">Total Orders</span>
            <span className="stat-value">{totalOrders}</span>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <span className="stat-label">Total Revenue</span>
            <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div className="stat-card stat-yellow">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">
              {(statusBreakdown.RECEIVED || 0) + (statusBreakdown.PROCESSING || 0)}
            </span>
          </div>
        </div>

        <div className="stat-card stat-gray">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-label">Delivered</span>
            <span className="stat-value">{statusBreakdown.DELIVERED || 0}</span>
          </div>
        </div>
      </div>

      <div className="section-card">
        <h3>Orders by Status</h3>
        <div className="status-breakdown">
          {Object.entries(statusBreakdown).map(([status, count]) => (
            <div key={status} className="status-row">
              <div className="status-row-left">
                <span
                  className="status-dot"
                  style={{ backgroundColor: STATUS_COLORS[status] }}
                />
                <span className="status-name">{status}</span>
              </div>
              <div className="status-row-right">
                <div className="status-bar-wrap">
                  <div
                    className="status-bar"
                    style={{
                      width: totalOrders > 0 ? `${(count / totalOrders) * 100}%` : "0%",
                      backgroundColor: STATUS_COLORS[status],
                    }}
                  />
                </div>
                <span className="status-count">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalOrders === 0 && (
        <div className="empty-state">
          <p>No orders yet. <a href="/create-order">Create your first order →</a></p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
