import React, { useEffect } from "react";
import { useLeads } from "../context/LeadContext";

const STAT_COLORS = {
  total: "#3b82f6",
  interested: "#60a5fa",
  converted: "#10b981",
  not_interested: "#ef4444",
};

export default function Dashboard() {
  const { stats, statsLoading, fetchStats } = useLeads();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (statsLoading || !stats) {
    return (
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card" style={{ opacity: 0.4 }}>
            <div className="stat-label">Loading...</div>
            <div className="stat-value">—</div>
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    { label: "Total Leads", value: stats.total, sub: "All time", color: STAT_COLORS.total },
    { label: "Interested", value: stats.interested, sub: "Active prospects", color: STAT_COLORS.interested },
    { label: "Converted", value: stats.converted, sub: "Closed deals", color: STAT_COLORS.converted },
    { label: "Not Interested", value: stats.not_interested, sub: "Disqualified", color: STAT_COLORS.not_interested },
  ];

  const total = parseInt(stats.total) || 1;
  const sources = [
    { label: "Call", count: stats.from_call, color: "#f59e0b" },
    { label: "WhatsApp", count: stats.from_whatsapp, color: "#10b981" },
    { label: "Field", count: stats.from_field, color: "#8b5cf6" },
  ];

  return (
    <>
      {/* Stat Cards */}
      <div className="stats-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label} style={{ "--accent-color": c.color }}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value || 0}</div>
            <div className="stat-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Detailed Stats Card */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title">
          <span className="icon">📊</span> Overview
        </div>

        {/* Source Breakdown */}
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.6px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 10 }}>
          Leads by Source
        </div>
        <div className="source-stats">
          {sources.map((s) => (
            <div className="source-row" key={s.label}>
              <div className="source-label">{s.label}</div>
              <div className="source-bar-wrap">
                <div
                  className="source-bar"
                  style={{
                    width: `${Math.round((s.count / total) * 100)}%`,
                    background: s.color,
                    minWidth: s.count > 0 ? 6 : 0,
                  }}
                />
              </div>
              <div className="source-count">{s.count || 0}</div>
            </div>
          ))}
        </div>

        <div className="divider" />

        {/* Conversion Rate */}
        <div className="conversion-section">
          <div className="conv-header">
            <div className="conv-label">Conversion Rate</div>
            <div className="conv-value">{stats.conversion_rate}%</div>
          </div>
          <div className="conv-bar-wrap">
            <div className="conv-bar" style={{ width: `${stats.conversion_rate}%` }} />
          </div>
        </div>

        {/* Time pills */}
        <div className="meta-pills">
          <div className="meta-pill">
            🗓 This week: <strong>{stats.this_week || 0}</strong>
          </div>
          <div className="meta-pill">
            📅 This month: <strong>{stats.this_month || 0}</strong>
          </div>
        </div>
      </div>
    </>
  );
}