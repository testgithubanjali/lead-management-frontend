import React from "react";
import { Toaster } from "react-hot-toast";
import { LeadProvider } from "./context/LeadContext";
import Dashboard from "./components/Dashboard";
import AddLeadForm from "./components/AddLeadForm";
import LeadsList from "./components/LeadsList";
import "./index.css";

function App() {
  return (
    <LeadProvider>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-inner">
              <div className="logo">
                <div className="logo-icon">🎯</div>
                <h1>Lead<span>CRM</span></h1>
              </div>
              <div className="nav-badge">v1.0.0</div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="main">
          <div className="container">
            {/* Dashboard Stats */}
            <Dashboard />

            {/* Two-column layout */}
            <div className="page-grid">
              {/* Left: Add Lead Form */}
              <aside>
                <AddLeadForm />
              </aside>

              {/* Right: Leads Table */}
              <section>
                <div className="card">
                  <div className="card-title">
                    <span className="icon">👥</span> All Leads
                  </div>
                  <LeadsList />
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111827",
            color: "#f1f5f9",
            border: "1px solid #1e2d45",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 14,
            borderRadius: 10,
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
    </LeadProvider>
  );
}

export default App;
