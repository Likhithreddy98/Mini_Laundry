import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        <span className="brand-icon">👔</span>
        <span className="brand-name">Mini Laundry</span>
      </Link>

      <div className="navbar-links">
        <Link to="/dashboard" className={`nav-link ${isActive("/dashboard") ? "active" : ""}`}>
          Dashboard
        </Link>
        <Link to="/orders" className={`nav-link ${isActive("/orders") ? "active" : ""}`}>
          Orders
        </Link>
        <Link to="/create-order" className={`nav-link ${isActive("/create-order") ? "active" : ""}`}>
          + New Order
        </Link>
      </div>

      <div className="navbar-user">
        <span className="user-greeting">Hi, {user?.name?.split(" ")[0]}</span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
