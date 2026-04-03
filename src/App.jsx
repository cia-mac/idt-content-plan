import { useState, useEffect, useMemo } from "react";
import contentItems from "./data/contentItems";
import "./App.css";

const STORAGE_KEY = "idt-content-plan-state";
const SUGGESTIONS_KEY = "idt-content-plan-suggestions";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadSuggestions() {
  try {
    const raw = localStorage.getItem(SUGGESTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSuggestions(suggestions) {
  localStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(suggestions));
}

function mergeState(items, stored) {
  const merged = {};
  items.forEach((item) => {
    if (stored[item.id]) {
      const s = { ...stored[item.id] };
      if (s.approval === "Objected") s.approval = "Flagged";
      merged[item.id] = s;
    } else {
      merged[item.id] = { approval: "Pending", notes: "", notesTimestamp: null };
    }
  });
  return merged;
}

const TYPE_COLORS = {
  Blog: "#e07020",
  LinkedIn: "#0a66c2",
  Video: "#9b59b6",
  Tutorial: "#27ae60",
  Project: "#d4a017",
};

const MONTHS = ["April", "May", "June", "Ongoing"];

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatusBadge({ approval }) {
  const colors = {
    Pending: "#666",
    Approved: "#27ae60",
    Flagged: "#e67e22",
  };
  return (
    <span className="status-badge" style={{ background: colors[approval] }}>
      {approval}
    </span>
  );
}

function TypeBadge({ type }) {
  return (
    <span
      className="type-badge"
      style={{ background: TYPE_COLORS[type] || "#666" }}
    >
      {type}
    </span>
  );
}

function ContentCard({ item, state, onApprove, onFlag, onNote }) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(state.notes || "");
  const [pendingFlag, setPendingFlag] = useState(false);

  const handleApprove = () => {
    setPendingFlag(false);
    onApprove(item.id);
  };

  const handleFlag = () => {
    if (!state.notes && !noteText.trim()) {
      setPendingFlag(true);
      setShowNotes(true);
      return;
    }
    setPendingFlag(false);
    onFlag(item.id);
  };

  const handleSaveNote = () => {
    onNote(item.id, noteText);
    if (pendingFlag && noteText.trim()) {
      onFlag(item.id);
      setPendingFlag(false);
    }
    setShowNotes(false);
  };

  return (
    <div
      className={`content-card ${state.approval === "Approved" ? "card-approved" : ""} ${state.approval === "Flagged" ? "card-flagged" : ""}`}
    >
      <div className="card-header">
        <div className="card-badges">
          <TypeBadge type={item.type} />
          {item.category && (
            <span className="category-label">{item.category}</span>
          )}
        </div>
        <StatusBadge approval={state.approval} />
      </div>
      <h3 className="card-title">{item.title}</h3>
      {item.targetDate && (
        <p className="card-date">{formatDate(item.targetDate)}</p>
      )}
      <p className="card-desc">{item.description}</p>
      {item.note && <p className="card-note-preset">Note: {item.note}</p>}
      {item.status && (
        <p className="card-write-status">Draft status: {item.status}</p>
      )}

      <div className="card-actions">
        <button
          className={`btn btn-approve ${state.approval === "Approved" ? "active" : ""}`}
          onClick={handleApprove}
        >
          Approve
        </button>
        <button
          className={`btn btn-flag ${state.approval === "Flagged" ? "active" : ""}`}
          onClick={handleFlag}
        >
          Flag
        </button>
        <button
          className="btn btn-note"
          onClick={() => setShowNotes(!showNotes)}
        >
          {showNotes ? "Close" : "Add Note"}
        </button>
      </div>

      {pendingFlag && !showNotes && (
        <p className="note-required">A note is required when flagging.</p>
      )}

      {showNotes && (
        <div className="notes-panel">
          {pendingFlag && (
            <p className="note-required">
              A note is required when flagging. Add your note and save.
            </p>
          )}
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add your note here..."
            rows={3}
          />
          <div className="notes-footer">
            <button className="btn btn-save-note" onClick={handleSaveNote}>
              Save Note
            </button>
            {state.notesTimestamp && (
              <span className="note-timestamp">
                Last saved:{" "}
                {new Date(state.notesTimestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
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
      total: vals.length,
      approved: vals.filter((s) => s.approval === "Approved").length,
      flagged: vals.filter((s) => s.approval === "Flagged").length,
      pending: vals.filter((s) => s.approval === "Pending").length,
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
      <div className="summary-item summary-flagged">
        <span className="summary-count">{counts.flagged}</span>
        <span className="summary-label">Flagged</span>
      </div>
      <div className="summary-item summary-pending">
        <span className="summary-count">{counts.pending}</span>
        <span className="summary-label">Pending</span>
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
          <button
            className="btn btn-save-note"
            onClick={handleSubmit}
            disabled={!title.trim()}
          >
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
                {s.description && (
                  <p className="suggestion-desc">{s.description}</p>
                )}
                <p className="suggestion-ts">
                  {new Date(s.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                className="btn-delete"
                onClick={() => onDelete(s.id)}
                title="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        !open && (
          <p className="suggestions-empty">No suggestions yet.</p>
        )
      )}
    </section>
  );
}

export default function App() {
  const [itemStates, setItemStates] = useState(() =>
    mergeState(contentItems, loadState())
  );
  const [suggestions, setSuggestions] = useState(() => loadSuggestions());
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");

  useEffect(() => {
    saveState(itemStates);
  }, [itemStates]);

  useEffect(() => {
    saveSuggestions(suggestions);
  }, [suggestions]);

  const handleApprove = (id) => {
    setItemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], approval: "Approved" },
    }));
  };

  const handleFlag = (id) => {
    setItemStates((prev) => ({
      ...prev,
      [id]: { ...prev[id], approval: "Flagged" },
    }));
  };

  const handleNote = (id, text) => {
    setItemStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        notes: text,
        notesTimestamp: new Date().toISOString(),
      },
    }));
  };

  const handleApproveMonth = (month) => {
    setItemStates((prev) => {
      const next = { ...prev };
      contentItems
        .filter((item) => item.month === month)
        .forEach((item) => {
          if (next[item.id].approval === "Pending") {
            next[item.id] = { ...next[item.id], approval: "Approved" };
          }
        });
      return next;
    });
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Reset all approvals, flags, and notes? This cannot be undone."
      )
    ) {
      const fresh = {};
      contentItems.forEach((item) => {
        fresh[item.id] = {
          approval: "Pending",
          notes: "",
          notesTimestamp: null,
        };
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
  const statuses = ["All", "Pending", "Approved", "Flagged"];

  const filtered = contentItems.filter((item) => {
    if (filterType !== "All" && item.type !== filterType) return false;
    if (filterMonth !== "All" && item.month !== filterMonth) return false;
    if (
      filterStatus !== "All" &&
      itemStates[item.id]?.approval !== filterStatus
    )
      return false;
    return true;
  });

  const groupedByMonth = MONTHS.map((month) => ({
    month,
    items: filtered.filter((item) => item.month === month),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>IDT Content Plan</h1>
          <p className="header-sub">Review and approve upcoming content</p>
        </div>
        <button className="btn btn-reset" onClick={handleReset}>
          Reset All
        </button>
      </header>

      <SummaryBar itemStates={itemStates} />

      <div className="filters">
        <div className="filter-group">
          <label>Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Month</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="All">All</option>
            {MONTHS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {groupedByMonth.map(({ month, items }) => (
        <section key={month} className="month-section">
          <div className="month-header">
            <h2>{month === "Ongoing" ? "Ongoing Projects" : `${month} 2026`}</h2>
            {month !== "Ongoing" && (
              <button
                className="btn btn-approve-all"
                onClick={() => handleApproveMonth(month)}
              >
                Approve All {month}
              </button>
            )}
          </div>

          {["Blog", "LinkedIn", "Video", "Project"]
            .filter((type) => items.some((i) => i.type === type))
            .map((type) => (
              <div key={type} className="type-group">
                <h3 className="type-group-title">
                  <span
                    className="type-dot"
                    style={{ background: TYPE_COLORS[type] || "#666" }}
                  />
                  {type}
                </h3>
                <div className="cards-grid">
                  {items
                    .filter((i) => i.type === type)
                    .map((item) => (
                      <ContentCard
                        key={item.id}
                        item={item}
                        state={itemStates[item.id]}
                        onApprove={handleApprove}
                        onFlag={handleFlag}
                        onNote={handleNote}
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
