const STATUS_CONFIG = {
  RECEIVED:   { label: "Received",   color: "#3b82f6", bg: "#eff6ff" },
  PROCESSING: { label: "Processing", color: "#f59e0b", bg: "#fffbeb" },
  READY:      { label: "Ready",      color: "#10b981", bg: "#ecfdf5" },
  DELIVERED:  { label: "Delivered",  color: "#6b7280", bg: "#f9fafb" },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: "#6b7280", bg: "#f9fafb" };
  return (
    <span
      className="status-badge"
      style={{ color: config.color, backgroundColor: config.bg, border: `1px solid ${config.color}` }}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
