import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const PRICES = {
  Shirt: 250,
  Pants: 500,
  Saree: 300,
  Kurta: 400,
  Jacket: 700,
  Bedsheet: 450,
  Towel: 200,
};

const GARMENT_TYPES = Object.keys(PRICES);

const CreateOrder = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    garmentType: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = "Customer name is required";
    if (!form.phone) errs.phone = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (!form.garmentType) errs.garmentType = "Please select a garment type";
    if (!form.quantity) errs.quantity = "Quantity is required";
    else if (Number(form.quantity) < 1 || !Number.isInteger(Number(form.quantity)))
      errs.quantity = "Quantity must be a positive whole number";
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await api.post("/orders", form);
      toast.success(`Order ${data.order.orderId} created!`);
      navigate("/orders");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const pricePerUnit = PRICES[form.garmentType] || 0;
  const totalBill = pricePerUnit * (Number(form.quantity) || 0);

  const delivery = new Date();
  delivery.setDate(delivery.getDate() + 2);
  const deliveryStr = delivery.toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Create New Order</h2>
          <p>Fill in the customer and garment details</p>
        </div>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-row">
            <div className="form-group">
              <label>Customer Name <span className="required">*</span></label>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className={errors.customerName ? "input-error" : ""}
              />
              {errors.customerName && <span className="error-text">{errors.customerName}</span>}
            </div>

            <div className="form-group">
              <label>Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                maxLength={10}
                className={errors.phone ? "input-error" : ""}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Garment Type <span className="required">*</span></label>
              <select
                name="garmentType"
                value={form.garmentType}
                onChange={handleChange}
                className={errors.garmentType ? "input-error" : ""}
              >
                <option value="">Select garment...</option>
                {GARMENT_TYPES.map((g) => (
                  <option key={g} value={g}>
                    {g} — ₹{PRICES[g]}/piece
                  </option>
                ))}
              </select>
              {errors.garmentType && <span className="error-text">{errors.garmentType}</span>}
            </div>

            <div className="form-group">
              <label>Quantity <span className="required">*</span></label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="1"
                className={errors.quantity ? "input-error" : ""}
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>
          </div>

          {form.garmentType && form.quantity > 0 && (
            <div className="bill-preview">
              <div className="bill-row">
                <span>Price per piece</span>
                <span>₹{pricePerUnit}</span>
              </div>
              <div className="bill-row">
                <span>Quantity</span>
                <span>× {form.quantity}</span>
              </div>
              <div className="bill-row bill-total">
                <span>Total Bill</span>
                <span>₹{totalBill}</span>
              </div>
              <div className="bill-row bill-delivery">
                <span>Estimated Delivery</span>
                <span>{deliveryStr}</span>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => navigate("/orders")}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>

      <div className="section-card price-reference">
        <h3>Price Reference</h3>
        <div className="price-grid">
          {GARMENT_TYPES.map((g) => (
            <div key={g} className="price-item">
              <span>{g}</span>
              <span className="price-tag">₹{PRICES[g]}/pc</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
