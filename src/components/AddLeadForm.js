import React, { useState } from "react";
import { useLeads } from "../context/LeadContext";

const INITIAL = { name: "", phone: "", source: "", status: "Interested", notes: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  else if (form.name.trim().length < 2) errors.name = "Name must be at least 2 characters";

  if (!form.phone.trim()) errors.phone = "Phone number is required";
  else if (!/^[+\d\s\-().]{7,20}$/.test(form.phone.trim()))
    errors.phone = "Enter a valid phone number";

  if (!form.source) errors.source = "Please select a source";

  return errors;
}

export default function AddLeadForm() {
  const { createLead } = useLeads();
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    try {
      await createLead(form);
      setForm(INITIAL);
      setErrors({});
    } catch (err) {
      // toast shown from context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card" style={{ position: "sticky", top: 80 }}>
      <div className="card-title">
        <span className="icon">➕</span> Add New Lead
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            className={`form-input${errors.name ? " error" : ""}`}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Ravi Kumar"
            autoComplete="off"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            className={`form-input${errors.phone ? " error" : ""}`}
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. +91-9876543210"
            autoComplete="off"
          />
          {errors.phone && <div className="form-error">{errors.phone}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Source *</label>
          <select
            className={`form-select${errors.source ? " error" : ""}`}
            name="source"
            value={form.source}
            onChange={handleChange}
          >
            <option value="">Select source...</option>
            <option value="Call">📞 Call</option>
            <option value="WhatsApp">💬 WhatsApp</option>
            <option value="Field">🏃 Field</option>
          </select>
          {errors.source && <div className="form-error">{errors.source}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Initial Status</label>
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Interested">🔵 Interested</option>
            <option value="Not Interested">🔴 Not Interested</option>
            <option value="Converted">🟢 Converted</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            className="form-textarea"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Optional notes about this lead..."
          />
        </div>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <span className="spinner" style={{ width: 16, height: 16 }} />
              Adding...
            </>
          ) : (
            <>+ Add Lead</>
          )}
        </button>
      </form>
    </div>
  );
}
