import React, { useEffect, useState, useCallback } from "react";
import { useLeads } from "../context/LeadContext";
import DeleteModal from "./DeleteModal";
import toast from "react-hot-toast";

const SOURCE_EMOJI = { Call: "📞", WhatsApp: "💬", Field: "🏃" };

function StatusBadge({ status }) {
  const cls = {
    Interested: "badge-interested",
    "Not Interested": "badge-not-interested",
    Converted: "badge-converted",
  }[status] || "badge-interested";
  const dot = { Interested: "🔵", "Not Interested": "🔴", Converted: "🟢" }[status];
  return <span className={`badge ${cls}`}>{dot} {status}</span>;
}

function SourceBadge({ source }) {
  const cls = { Call: "badge-call", WhatsApp: "badge-whatsapp", Field: "badge-field" }[source] || "";
  return (
    <span className={`badge ${cls}`}>
      {SOURCE_EMOJI[source]} {source}
    </span>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function LeadsList() {
  const { leads, loading, fetchLeads, updateStatus, deleteLead, filters, setFilters } = useLeads();
  const [search, setSearch] = useState(filters.search || "");
  const [statusFilter, setStatusFilter] = useState(filters.status || "");
  const [sourceFilter, setSourceFilter] = useState(filters.source || "");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState({});

  const loadLeads = useCallback(() => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (sourceFilter) params.source = sourceFilter;
    fetchLeads(params);
  }, [fetchLeads, search, statusFilter, sourceFilter]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(loadLeads, 350);
    return () => clearTimeout(t);
  }, [loadLeads]);

  const handleStatusChange = async (id, newStatus) => {
    setStatusLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await updateStatus(id, { status: newStatus });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatusLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteLead(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setSourceFilter("");
  };

  const hasFilters = search || statusFilter || sourceFilter;

  return (
    <div>
      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="form-input"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-select filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Interested">Interested</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Converted">Converted</option>
        </select>
        <select
          className="form-select filter-select"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="">All Sources</option>
          <option value="Call">Call</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Field">Field</option>
        </select>
        {hasFilters && (
          <button className="btn btn-ghost" onClick={clearFilters}>
            ✕ Clear
          </button>
        )}
      </div>

      {/* Count */}
      <div style={{ marginBottom: 12, fontSize: 13, color: "var(--text-muted)" }}>
        {loading ? "Loading..." : `${leads.length} lead${leads.length !== 1 ? "s" : ""} found`}
      </div>

      {/* Table */}
      <div className="leads-table-wrap">
        <table className="leads-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Status</th>
              <th>Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="loading-row">
                <td colSpan={7}>
                  <span className="spinner" /> Loading leads...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-state-icon">📭</div>
                    <h3>{hasFilters ? "No leads match your filters" : "No leads yet"}</h3>
                    <p style={{ fontSize: 13, marginTop: 4 }}>
                      {hasFilters
                        ? "Try adjusting your search or filters"
                        : "Add your first lead using the form on the left"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead, idx) => (
                <tr key={lead.id}>
                  <td style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12 }}>
                    {idx + 1}
                  </td>
                  <td>
                    <div className="lead-name">{lead.name}</div>
                    {lead.notes && (
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                        📝 {lead.notes.length > 40 ? lead.notes.slice(0, 40) + "…" : lead.notes}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="lead-phone">{lead.phone}</div>
                  </td>
                  <td>
                    <SourceBadge source={lead.source} />
                  </td>
                  <td>
                    {statusLoading[lead.id] ? (
                      <span className="spinner" style={{ width: 14, height: 14 }} />
                    ) : (
                      <select
                        className="status-select"
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                        style={{
                          borderColor:
                            lead.status === "Converted"
                              ? "rgba(16,185,129,0.4)"
                              : lead.status === "Not Interested"
                              ? "rgba(239,68,68,0.4)"
                              : "rgba(59,130,246,0.4)",
                          color:
                            lead.status === "Converted"
                              ? "#34d399"
                              : lead.status === "Not Interested"
                              ? "#f87171"
                              : "#60a5fa",
                        }}
                      >
                        <option value="Interested">🔵 Interested</option>
                        <option value="Not Interested">🔴 Not Interested</option>
                        <option value="Converted">🟢 Converted</option>
                      </select>
                    )}
                  </td>
                  <td>
                    <div className="lead-time">{formatDate(lead.created_at)}</div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn btn-danger btn-icon"
                        title="Delete lead"
                        onClick={() => setDeleteTarget(lead)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          lead={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
