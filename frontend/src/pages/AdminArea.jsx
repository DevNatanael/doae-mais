import React, { useState } from "react";
import AdminDashboard from "../components/Admin/AdminDashboard";
import DonationsTable from "../components/Admin/DonationsTable";
import NeedsManager from "../components/Admin/NeedsManager";
import MembersManager from "../components/Admin/MembersManager";

const AdminArea = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Estilo simples para as abas
  const tabStyle = (isActive) => ({
    padding: "10px 20px",
    background: isActive ? "#6ee7b7" : "transparent",
    color: isActive ? "#0b0f14" : "#e8eef8",
    border: isActive ? "none" : "1px solid #2b3a58",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginRight: "8px",
    transition: "all 0.2s"
  });

  return (
    <main className="home-wrapper">
      <div className="admin-section" style={{ display: "block", textAlign: "left", minHeight: "auto", padding: "0" }}>
        
        {/* CABEÇALHO DO ADMIN */}
        <div style={{ marginBottom: "32px", borderBottom: "1px solid #1b2838", paddingBottom: "16px" }}>
          <h2 className="admin-title">Área Administrativa</h2>
          <p className="admin-subtitle" style={{ textAlign: "left", margin: 0 }}>
            Gerencie doações, campanhas e visualize métricas.
          </p>
        </div>

        {/* NAVEGAÇÃO POR ABAS */}
        <div style={{ marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <button 
            style={tabStyle(activeTab === "dashboard")} 
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button 
            style={tabStyle(activeTab === "donations")} 
            onClick={() => setActiveTab("donations")}
          >
            📦 Doações
          </button>
          <button 
            style={tabStyle(activeTab === "needs")} 
            onClick={() => setActiveTab("needs")}
          >
            📢 Campanhas
          </button>
          <button 
            style={tabStyle(activeTab === "members")} 
            onClick={() => setActiveTab("members")}
          >
            👥 Membros
          </button>
        </div>

        {/* CONTEÚDO DINÂMICO */}
        <div>
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "donations" && <DonationsTable />}
          {activeTab === "needs" && <NeedsManager />}
          {activeTab === "members" && <MembersManager />}
        </div>

      </div>
    </main>
  );
};

export default AdminArea;