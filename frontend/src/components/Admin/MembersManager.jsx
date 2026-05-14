import React, { useEffect, useState, useCallback } from "react";
import { membersService } from "../../services/membersService";

/* ─── helpers ─────────────────────────────────────────────────────── */
const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  dateOfBirth: "",
};

const formatDate = (raw) => {
  if (!raw) return "—";
  // raw may be "YYYY-MM-DD" or a full ISO string
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
};

/* ─── sub-components ───────────────────────────────────────────────── */

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  const bg = type === "error" ? "rgba(252,165,165,0.12)" : "rgba(110,231,183,0.12)";
  const color = type === "error" ? "#fca5a5" : "#6ee7b7";
  const border = type === "error" ? "#7f1d1d" : "#065f46";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "28px",
        right: "28px",
        background: bg,
        color,
        border: `1px solid ${border}`,
        borderRadius: "12px",
        padding: "14px 20px",
        fontSize: "14px",
        fontWeight: 600,
        zIndex: 9999,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        backdropFilter: "blur(8px)",
        animation: "fadeInUp 0.3s ease",
      }}
    >
      <span>{type === "error" ? "❌" : "✅"}</span>
      {message}
    </div>
  );
}

function Modal({ member, onClose, onSaved }) {
  const isEditing = Boolean(member?.id);
  const [form, setForm] = useState(
    isEditing
      ? {
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
          address: member.address,
          dateOfBirth: member.dateOfBirth
            ? String(member.dateOfBirth).slice(0, 10)
            : "",
        }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [fieldError, setFieldError] = useState("");

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError("");
    setSaving(true);
    try {
      if (isEditing) {
        await membersService.update(member.id, form);
      } else {
        await membersService.create(form);
      }
      onSaved(isEditing ? "Membro atualizado!" : "Membro cadastrado!");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Erro ao salvar. Verifique os dados.";
      setFieldError(Array.isArray(msg) ? msg.join(" · ") : msg);
      setSaving(false);
    }
  };

  const input = {
    background: "#0a0e17",
    border: "1px solid #2b3a58",
    color: "#e8eef8",
    padding: "10px 12px",
    borderRadius: "8px",
    width: "100%",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const label = {
    display: "block",
    fontSize: "12px",
    fontWeight: 700,
    color: "#a8b3c7",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#111722",
          border: "1px solid #223048",
          borderRadius: "18px",
          padding: "32px",
          width: "100%",
          maxWidth: "520px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          animation: "scaleIn 0.2s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: "#e8eef8",
                fontSize: "18px",
                fontWeight: 700,
              }}
            >
              {isEditing ? "✏️ Editar Membro" : "➕ Novo Membro"}
            </h3>
            <p style={{ margin: "4px 0 0", color: "#a8b3c7", fontSize: "13px" }}>
              {isEditing
                ? "Atualize as informações do membro."
                : "Preencha os dados para cadastrar."}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#a8b3c7",
              fontSize: "22px",
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {fieldError && (
          <div
            style={{
              background: "rgba(252,165,165,0.1)",
              border: "1px solid #7f1d1d",
              color: "#fca5a5",
              padding: "10px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              marginBottom: "18px",
            }}
          >
            {fieldError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div>
              <label style={label}>Nome</label>
              <input
                style={input}
                type="text"
                placeholder="João"
                required
                value={form.firstName}
                onChange={set("firstName")}
              />
            </div>
            <div>
              <label style={label}>Sobrenome</label>
              <input
                style={input}
                type="text"
                placeholder="Silva"
                required
                value={form.lastName}
                onChange={set("lastName")}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: "16px" }}>
            <label style={label}>E-mail</label>
            <input
              style={input}
              type="email"
              placeholder="joao@exemplo.com"
              required
              value={form.email}
              onChange={set("email")}
            />
          </div>

          {/* Address */}
          <div style={{ marginBottom: "16px" }}>
            <label style={label}>Endereço</label>
            <input
              style={input}
              type="text"
              placeholder="Rua das Flores, 123 – Bairro"
              required
              value={form.address}
              onChange={set("address")}
            />
          </div>

          {/* Date of birth */}
          <div style={{ marginBottom: "24px" }}>
            <label style={label}>Data de Nascimento</label>
            <input
              style={input}
              type="date"
              required
              value={form.dateOfBirth}
              onChange={set("dateOfBirth")}
            />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
                background: "transparent",
                border: "1px solid #2b3a58",
                color: "#a8b3c7",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="button"
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: 700,
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? "Salvando…" : isEditing ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── main component ───────────────────────────────────────────────── */

const MembersManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | {} | member object
  const [toast, setToast] = useState(null); // {message, type}
  const [deleting, setDeleting] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = useCallback(() => setToast(null), []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await membersService.getAll();
      setMembers(data);
    } catch {
      showToast("Erro ao carregar membros.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaved = (msg) => {
    setModal(null);
    showToast(msg);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente excluir este membro? Esta ação não pode ser desfeita."))
      return;
    setDeleting(id);
    try {
      await membersService.remove(id);
      setMembers((prev) => prev.filter((m) => m.id !== id));
      showToast("Membro removido com sucesso.");
    } catch {
      showToast("Erro ao remover membro.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      m.firstName.toLowerCase().includes(q) ||
      m.lastName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  });

  /* ── styles ─── */
  const th = {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: "#a8b3c7",
    borderBottom: "1px solid #1b2838",
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "12px 14px",
    fontSize: "14px",
    color: "#e8eef8",
    borderBottom: "1px solid #111d2e",
    verticalAlign: "middle",
  };

  const avatar = (m) => {
    const initials = `${m.firstName[0] || ""}${m.lastName[0] || ""}`.toUpperCase();
    // deterministic hue from email string
    const hue = [...m.email].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
    return { initials, hue };
  };

  return (
    <div>
      {/* ── header bar ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h3 style={{ margin: 0, color: "#e8eef8", fontSize: "18px", fontWeight: 700 }}>
            👥 Membros Cadastrados
          </h3>
          <p style={{ margin: "4px 0 0", color: "#a8b3c7", fontSize: "13px" }}>
            {members.length} membro{members.length !== 1 ? "s" : ""} no total
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Buscar por nome ou e-mail…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: "#0a0e17",
              border: "1px solid #2b3a58",
              color: "#e8eef8",
              padding: "9px 14px",
              borderRadius: "8px",
              fontSize: "14px",
              outline: "none",
              minWidth: "220px",
            }}
          />
          {/* Add button */}
          <button
            className="button"
            onClick={() => setModal({})}
            style={{ padding: "9px 18px", fontSize: "14px", fontWeight: 700 }}
          >
            + Novo Membro
          </button>
        </div>
      </div>

      {/* ── table ── */}
      <div
        className="home-card"
        style={{ padding: 0, overflow: "hidden", borderRadius: "14px" }}
      >
        {loading ? (
          <div
            style={{
              padding: "48px",
              textAlign: "center",
              color: "#a8b3c7",
              fontSize: "15px",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
            Carregando membros…
          </div>
        ) : filtered.length === 0 ? (
          <div
            style={{
              padding: "56px",
              textAlign: "center",
              color: "#a8b3c7",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>👤</div>
            <p style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#e8eef8" }}>
              {search ? "Nenhum resultado encontrado" : "Nenhum membro cadastrado"}
            </p>
            {!search && (
              <button
                className="button"
                onClick={() => setModal({})}
                style={{ marginTop: "16px", padding: "10px 24px", fontSize: "14px" }}
              >
                Cadastrar primeiro membro
              </button>
            )}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d1320" }}>
                  <th style={th}>Membro</th>
                  <th style={th}>E-mail</th>
                  <th style={th}>Endereço</th>
                  <th style={th}>Nascimento</th>
                  <th style={{ ...th, textAlign: "center" }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, idx) => {
                  const { initials, hue } = avatar(m);
                  return (
                    <tr
                      key={m.id}
                      style={{
                        background: idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                        transition: "background 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "rgba(110,231,183,0.04)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background =
                          idx % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)")
                      }
                    >
                      {/* Avatar + name */}
                      <td style={td}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: `hsl(${hue}, 55%, 28%)`,
                              border: `2px solid hsl(${hue}, 55%, 40%)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "13px",
                              fontWeight: 700,
                              color: `hsl(${hue}, 80%, 80%)`,
                              flexShrink: 0,
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {m.firstName} {m.lastName}
                            </div>
                            <div style={{ fontSize: "11px", color: "#6ee7b7", marginTop: "2px" }}>
                              #{m.id?.slice(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ ...td, color: "#a8b3c7" }}>{m.email}</td>
                      <td style={{ ...td, color: "#a8b3c7", maxWidth: "200px" }}>
                        <span
                          title={m.address}
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {m.address}
                        </span>
                      </td>
                      <td style={{ ...td, color: "#a8b3c7" }}>{formatDate(m.dateOfBirth)}</td>

                      {/* Actions */}
                      <td style={{ ...td, textAlign: "center" }}>
                        <div
                          style={{ display: "flex", gap: "8px", justifyContent: "center" }}
                        >
                          <button
                            onClick={() => setModal(m)}
                            title="Editar"
                            style={{
                              background: "rgba(110,231,183,0.08)",
                              border: "1px solid rgba(110,231,183,0.25)",
                              color: "#6ee7b7",
                              borderRadius: "7px",
                              padding: "6px 12px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: 600,
                              transition: "background 0.15s",
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            disabled={deleting === m.id}
                            title="Excluir"
                            style={{
                              background: "rgba(252,165,165,0.08)",
                              border: "1px solid rgba(252,165,165,0.25)",
                              color: "#fca5a5",
                              borderRadius: "7px",
                              padding: "6px 12px",
                              cursor: "pointer",
                              fontSize: "13px",
                              fontWeight: 600,
                              transition: "background 0.15s",
                              opacity: deleting === m.id ? 0.6 : 1,
                            }}
                          >
                            {deleting === m.id ? "…" : "🗑️ Excluir"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal !== null && (
        <Modal
          member={Object.keys(modal).length ? modal : null}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}

      {/* ── Toast ── */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* ── keyframes (injected once) ── */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MembersManager;
