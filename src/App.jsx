import { useState, useEffect, useMemo } from "react";
import contentItems from "./data/contentItems";
import "./App.css";

const STORAGE_KEY = "idt-content-plan-state";
const SUGGESTIONS_KEY = "idt-content-plan-suggestions";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function loadSuggestions() {
  try {
    const raw = localStorage.getItem(SUGGESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function saveSuggestions(s) {
  localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(s));
}

function mergeState(items, stored) {
  const merged = {};
  items.forEach((item) => {
    if (stored[item.id]) {
      const s = { ...stored[item.id] };
      if (s.approval === "Objected" || s.approval === "Flagged") s.approval = "Rejected";
      merged[item.id] = s;
    } else {
      merged[item.id] = { approval: "Pending", notes: "", notesTimestamp: null };
    }
  });
  return merged;
}

const NOTE_REQUIRED = ["Rejected", "Changes Requested"];

const STATUS_CONFIG = {
  Pending:             { color: "#555",    textColor: "#fff" },
  Approved:            { color: "#27ae60", textColor: "#fff" },
  "On Hold":           { color: "#2980b9", textColor: "#fff" },
  Rejected:            { color: "#e74c3c", textColor: "#fff" },
  "Changes Requested": { color: "#f0c040", textColor: "#111" },
};

const ACTIONS = [
  { status: "Approved",           label: "Approve", btnClass: "btn-approve" },
  { status: "On Hold",            label: "Hold",    btnClass: "btn-hold"    },
  { status: "Rejected",           label: "Reject",  btnClass: "btn-reject"  },
  { status: "Changes Requested",  label: "Revise",  btnClass: "btn-revise"  },
];

const TYPE_COLORS = {
  Blog:     "#e07020",
  LinkedIn: "#0a66c2",
  Video:    "#9b59b6",
  X:        "#e0e0e0",
  Project:  "#d4a017",
};

const CATEGORY_COLORS = {
  Educational: "#2471a3",
  Application: "#7d3c98",
  Product:     "#b7460e",
  Culture:     "#1e8449",
  TBD:         "#555",
};

const MONTHS = ["April", "May", "June", "Ongoing"];
// Order types within each month section
const TYPE_ORDER = ["Blog", "LinkedIn", "Video", "X", "Project"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatusBadge({ approval }) {
  const cfg = STATUS_CONFIG[approval] || STATUS_CONFIG.Pending;
  return (
    <span className="status-badge" style={{ background: cfg.color, color: cfg.textColor }}>
      {approval}
    </span>
  );
}

function TypeBadge({ type }) {
  return (
    <span className="type-badge" style={{ background: TYPE_COLORS[type] || "#666", color: type === "X" ? "#111" : "#fff" }}>
      {type}
    </span>
  );
}

function CategoryBadge({ category }) {
  if (!category) return null;
  return (
    <span className="category-label" style={{ background: CATEGORY_COLORS[category] || "#555" }}>
      {category}
    </span>
  );
}

function ContentCard({ item, state, onSetStatus, onNote, large }) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(state.notes || "");
  const [pendingStatus, setPendingStatus] = useState(null);

  const handleAction = (status) => {
    if (NOTE_REQUIRED.includes(status) && !state.notes && !noteText.trim()) {
      setPendingStatus(status);
      setShowNotes(true);
      return;
    }
    setPendingStatus(null);
    onSetStatus(item.id, status);
  };

  const handleSaveNote = () => {
    onNote(item.id, noteText);
    if (pendingStatus && noteText.trim()) {
      onSetStatus(item.id, pendingStatus);
      setPendingStatus(null);
    }
    setShowNotes(false);
  };

  const statusSlug = state.approval.toLowerCase().replace(/\s+/g, "-");
  const cardClass = [
    "content-card",
    large ? "content-card-large" : "",
    state.approval !== "Pending" ? `card-${statusSlug}` : "",
  ].join(" ").trim();

  return (
    <div className={cardClass}>
      <div className="card-header">
        <div className="card-badges">
          <TypeBadge type={item.type} />
          <CategoryBadge category={item.category} />
        </div>
        <StatusBadge approval={state.approval} />
      </div>

      <h3 className="card-title">{item.title}</h3>
      {item.targetDate && <p className="card-date">{formatDate(item.targetDate)}</p>}
      <p className="card-desc">{item.description}</p>
      {item.note && <p className="card-note-preset">Note: {item.note}</p>}
      {item.status && <p className="card-write-status">Draft status: {item.status}</p>}
      {state.notes && !showNotes && (
        <p className="card-saved-note">"{state.notes}"</p>
      )}

      <div className="card-actions">
        {ACTIONS.map(({ status, label, btnClass }) => (
          <button
            key={status}
            className={`btn ${btnClass} ${state.approval === status ? "active" : ""}`}
            onClick={() => handleAction(status)}
          >
            {label}
          </button>
        ))}
        <button className="btn btn-note" onClick={() => setShowNotes(!showNotes)}>
          {showNotes ? "Close" : state.notes ? "Edit Note" : "Add Note"}
        </button>
      </div>

      {pendingStatus && !showNotes && (
        <p className="note-required">A note is required for {pendingStatus}.</p>
      )}

      {showNotes && (
        <div className="notes-panel">
          {pendingStatus && <p className="note-required">Add a note explaining why, then save.</p>}
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your note here..."
            rows={3}
          />
          <div className="notes-footer">
            <button className="btn btn-save-note" onClick={handleSaveNote}>Save Note</button>
            {state.notesTimestamp && (
              <span className="note-timestamp">
                Last saved:{" "}
                {new Date(state.notesTimestamp).toLocaleString("en-US", {
                  month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryBar({ itemStates }) {
  const counts = useMemo(() => {
    const vals = Object.values(itemStates);
    return {
      total:    vals.length,
      approved: vals.filter((s) => s.approval === "Approved").length,
      pending:  vals.filter((s) => s.approval === "Pending").length,
      onhold:   vals.filter((s) => s.approval === "On Hold").length,
      rejected: vals.filter((s) => s.approval === "Rejected").length,
      changes:  vals.filter((s) => s.approval === "Changes Requested").length,
    };
  }, [itemStates]);

  return (
    <div className="summary-bar">
      <div className="summary-item">
        <span className="summary-count">{counts.total}</span>
        <span className="summary-label">Total</span>
      </div>
      <div className="summary-item summary-approved">
        <span className="summary-count">{counts.approved}</span>
        <span className="summary-label">Approved</span>
      </div>
      <div className="summary-item summary-pending">
        <span className="summary-count">{counts.pending}</span>
        <span className="summary-label">Pending</span>
      </div>
      <div className="summary-item summary-onhold">
        <span className="summary-count">{counts.onhold}</span>
        <span className="summary-label">On Hold</span>
      </div>
      <div className="summary-item summary-rejected">
        <span className="summary-count">{counts.rejected}</span>
        <span className="summary-label">Rejected</span>
      </div>
      <div className="summary-item summary-changes">
        <span className="summary-count">{counts.changes}</span>
        <span className="summary-label">Revise</span>
      </div>
    </div>
  );
}

function SuggestionsSection({ suggestions, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: desc.trim() });
    setTitle("");
    setDesc("");
    setOpen(false);
  };

  return (
    <section className="suggestions-section">
      <div className="suggestions-header">
        <div>
          <h2 className="suggestions-title">Suggestions</h2>
          <p className="suggestions-sub">Ideas Luiz wants to see covered</p>
        </div>
        <button className="btn btn-suggest" onClick={() => setOpen(!open)}>
          {open ? "Cancel" : "+ Suggest an Idea"}
        </button>
      </div>

      {open && (
        <div className="suggest-form">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="suggest-input"
            autoFocus
          />
          <textarea
            placeholder="Short description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="suggest-textarea"
            rows={3}
          />
          <button className="btn btn-save-note" onClick={handleSubmit} disabled={!title.trim()}>
            Submit Idea
          </button>
        </div>
      )}

      {suggestions.length > 0 ? (
        <div className="suggestions-list">
          {suggestions.map((s) => (
            <div key={s.id} className="suggestion-card">
              <div className="suggestion-body">
                <p className="suggestion-title">{s.title}</p>
                {s.description && <p className="suggestion-desc">{s.description}</p>}
                <p className="suggestion-ts">
                  {new Date(s.createdAt).toLocaleString("en-US", {
                    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                  })}
                </p>
              </div>
              <button className="btn-delete" onClick={() => onDelete(s.id)} title="Remove">×</button>
            </div>
          ))}
        </div>
      ) : (
        !open && <p className="suggestions-empty">No suggestions yet.</p>
      )}
    </section>
  );
}

export default function App() {
  const [itemStates, setItemStates] = useState(() => mergeState(contentItems, loadState()));
  const [suggestions, setSuggestions] = useState(() => loadSuggestions());
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");

  useEffect(() => { saveState(itemStates); }, [itemStates]);
  useEffect(() => { saveSuggestions(suggestions); }, [suggestions]);

  const handleSetStatus = (id, status) => {
    setItemStates((prev) => ({ ...prev, [id]: { ...prev[id], approval: status } }));
  };

  const handleNote = (id, text) => {
    setItemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], notes: text, notesTimestamp: new Date().toISOString() },
    }));
  };

  const handleApproveMonth = (month) => {
    setItemStates((prev) => {
      const next = { ...prev };
      contentItems.filter((item) => item.month === month).forEach((item) => {
        if (next[item.id].approval === "Pending") {
          next[item.id] = { ...next[item.id], approval: "Approved" };
        }
      });
      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm("Reset all statuses and notes? This cannot be undone.")) {
      const fresh = {};
      contentItems.forEach((item) => {
        fresh[item.id] = { approval: "Pending", notes: "", notesTimestamp: null };
      });
      setItemStates(fresh);
    }
  };

  const handleAddSuggestion = ({ title, description }) => {
    setSuggestions((prev) => [
      ...prev,
      { id: Date.now().toString(), title, description, createdAt: new Date().toISOString() },
    ]);
  };

  const handleDeleteSuggestion = (id) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const types = ["All", ...new Set(contentItems.map((i) => i.type))];
  const statuses = ["All", "Pending", "Approved", "On Hold", "Rejected", "Changes Requested"];

  const filtered = contentItems.filter((item) => {
    if (filterType !== "All" && item.type !== filterType) return false;
    if (filterMonth !== "All" && item.month !== filterMonth) return false;
    if (filterStatus !== "All" && itemStates[item.id]?.approval !== filterStatus) return false;
    return true;
  });

  const groupedByMonth = MONTHS.map((month) => ({
    month,
    items: filtered.filter((item) => item.month === month),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>IDT Content Plan</h1>
          <p className="header-sub">Review and approve upcoming content</p>
        </div>
        <button className="btn btn-reset" onClick={handleReset}>Reset All</button>
      </header>

      <SummaryBar itemStates={itemStates} />

      <div className="filters">
        <div className="filter-group">
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            {types.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Month</label>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
            <option value="All">All</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {groupedByMonth.map(({ month, items }) => (
        <section key={month} className="month-section">
          <div className="month-header">
            <h2>{month === "Ongoing" ? "Ongoing" : `${month} 2026`}</h2>
            {month !== "Ongoing" && (
              <button className="btn btn-approve-all" onClick={() => handleApproveMonth(month)}>
                Approve All {month}
              </button>
            )}
          </div>

          {TYPE_ORDER.filter((type) => items.some((i) => i.type === type)).map((type) => (
            <div key={type} className="type-group">
              <h3 className="type-group-title">
                <span className="type-dot" style={{ background: TYPE_COLORS[type] || "#666" }} />
                {type}
              </h3>
              <div className={type === "Blog" ? "cards-grid cards-grid-blog" : "cards-grid"}>
                {items.filter((i) => i.type === type).map((item) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    state={itemStates[item.id]}
                    onSetStatus={handleSetStatus}
                    onNote={handleNote}
                    large={type === "Blog"}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}

      <SuggestionsSection
        suggestions={suggestions}
        onAdd={handleAddSuggestion}
        onDelete={handleDeleteSuggestion}
      />

      <footer className="app-footer">
        <p>IDT Content Plan Review Tool. Data stored locally in your browser.</p>
      </footer>
    </div>
  );
}
