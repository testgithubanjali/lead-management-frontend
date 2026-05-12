import React from "react";

export default function DeleteModal({ lead, onConfirm, onCancel, loading }) {
  if (!lead) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">🗑 Delete Lead</div>
          <button className="modal-close" onClick={onCancel}>×</button>
        </div>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.6 }}>
          Are you sure you want to delete{" "}
          <strong style={{ color: "var(--text-primary)" }}>{lead.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
            style={{ background: "var(--red)", color: "#fff", flex: 1 }}
          >
            {loading ? (
              <><span className="spinner" style={{ width: 14, height: 14 }} /> Deleting...</>
            ) : (
              "Yes, Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
