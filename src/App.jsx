import { useState, useEffect, useMemo } from "react";
import contentItems from "./data/contentItems";
import "./App.css";

const STORAGE_KEY  = "the-brief-state";
const SUGGEST_KEY  = "the-brief-suggestions";
const EDIT_PIN     = "6868";

// ─── persistence ─────────────────────────────────────────────────────────────
function loadState()       { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; } }
function saveState(s)      { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }
function loadSuggestions() { try { return JSON.parse(localStorage.getItem(SUGGEST_KEY)) || []; } catch { return []; } }
function saveSuggestions(s){ localStorage.setItem(SUGGEST_KEY, JSON.stringify(s)); }

function mergeState(items, stored) {
  const m = {};
  items.forEach(item => {
    const s = stored[item.id] || {};
    // migrate legacy values
    const a = s.approval;
    let approval = a;
    if (!approval || approval === "Pending")  approval = "Proposed";
    if (approval === "Objected" || approval === "Flagged" || approval === "Rejected") approval = "Passed";
    if (approval === "Approved (Phase 1)" || approval === "Greenlit") approval = "Greenlit";
    m[item.id] = { approval, notes: s.notes || "", notesTimestamp: s.notesTimestamp || null, image: s.image || null };
  });
  return m;
}

// ─── workflow config ──────────────────────────────────────────────────────────
//
//  PHASE 1 — PITCH
//    Proposed → Luiz: Green Light / Hold / Skip
//    On Hold  → Luiz: Green Light / Skip
//    Greenlit → Ciamac develops, then sends for review
//
//  PHASE 2 — FINAL REVIEW
//    In Review → Luiz: Approve / Request Changes
//    Revise    → Ciamac fixes, then resubmits (back to In Review)
//    Approved  → Done
//
const SECTION_OF = {
  "Proposed":  "proposals",
  "On Hold":   "proposals",
  "Greenlit":  "development",
  "Revise":    "development",  // revisions go back to Ciamac, not stuck in review
  "In Review": "review",
  "Approved":  "approved",
  "Passed":    "passed",
};

// Actions Luiz can take, per status
const LUIZ_ACTIONS = {
  "Proposed": [
    { status: "Greenlit", label: "Green Light", cls: "btn-greenlit" },
    { status: "On Hold",  label: "Hold",        cls: "btn-hold"    },
    { status: "Passed",   label: "Skip",        cls: "btn-pass"    },
  ],
  "On Hold": [
    { status: "Proposed",  label: "Unhold",      cls: "btn-pass"    },
    { status: "Greenlit",  label: "Green Light", cls: "btn-greenlit" },
    { status: "Passed",    label: "Skip",        cls: "btn-pass"    },
  ],
  "In Review": [
    { status: "Approved", label: "Approve",          cls: "btn-approve" },
    { status: "Revise",   label: "Request Changes",  cls: "btn-revise"  },
  ],
  "Greenlit":  [],
  "Revise":    [],
  "Approved":  [],
  "Passed":    [],
};

// Colors — type drives LEFT BORDER only; status badge is text-only, no heavy bg
const TYPE_BORDER = { Blog: "#d4a017", LinkedIn: "#0a66c2", Video: "#7d3c98", X: "#666", Project: "#b8860b" };
const STATUS_COLOR = {
  "Proposed":  { bg: "transparent",           text: "#555"    },
  "Greenlit":  { bg: "rgba(39,174,96,0.08)",  text: "#3ea864" },
  "On Hold":   { bg: "rgba(41,128,185,0.08)", text: "#4d8fbb" },
  "Passed":    { bg: "transparent",           text: "#333"    },
  "In Review": { bg: "rgba(212,160,23,0.08)", text: "#b88c0a" },
  "Revise":    { bg: "rgba(210,80,60,0.08)",  text: "#c05040" },
  "Approved":  { bg: "rgba(39,174,96,0.08)",  text: "#27ae60" },
};

const MONTHS = ["April", "May", "June", "Ongoing"];

const LEGEND_TYPES = [
  { type: "Blog",      color: "#d4a017", desc: "Long-form article. Interactive explainer. SEO. Goes on idtcameras.com." },
  { type: "LinkedIn",  color: "#0a66c2", desc: "Short post. 2x/week, Tue + Thu, 10am PT. Educational, Application, Product, or Culture." },
  { type: "Video",     color: "#7d3c98", desc: "Produced video. YouTube or LinkedIn native." },
  { type: "X",         color: "#777",    desc: "Short-form post for X. Repurposed from LinkedIn or standalone." },
  { type: "Project",   color: "#b8860b", desc: "Ongoing deliverable. Configurator, website, software. Not content — infrastructure." },
];

const LEGEND_CATS = [
  { cat: "Educational", desc: "Teaches something. Frame rate, interfaces, PIV. No product pitch." },
  { cat: "Application", desc: "Named client story. Caltech, Mercedes, RaceTech, Artemis. These are the differentiators." },
  { cat: "Product",     desc: "Specs, features, new release. Feature-forward, numbers over adjectives." },
  { cat: "Culture",     desc: "Behind the scenes. Pasadena facility, team, engineering process." },
];

const LEGEND_FLOW = [
  { status: "Proposed",  color: "#555",    desc: "Ciamac's pitch. Waiting on Luiz." },
  { status: "On Hold",   color: "#4d8fbb", desc: "Luiz paused it. Still in the pitch queue." },
  { status: "Greenlit",  color: "#3ea864", desc: "Luiz said go. Ciamac is building it." },
  { status: "In Review", color: "#b88c0a", desc: "Draft ready. Luiz reviews before publish." },
  { status: "Revise",    color: "#c05040", desc: "Changes requested. Back in development until resubmitted." },
  { status: "Approved",  color: "#27ae60", desc: "Final sign-off. Ready to publish." },
  { status: "Passed",    color: "#333",    desc: "Skipped this cycle. Archived." },
];

function formatDate(d) {
  if (!d) return "";
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function Legend() {
  const [open, setOpen] = useState(false);
  return (
    <div className="legend-wrap">
      <button className="legend-toggle" onClick={() => setOpen(o => !o)}>
        {open ? "Hide Guide" : "How This Works"}
      </button>
      {open && (
        <div className="legend-body">
          <div className="legend-col">
            <h4>Workflow</h4>
            {LEGEND_FLOW.map(({ status, color, desc }) => (
              <div key={status} className="legend-row">
                <span className="legend-dot" style={{ background: color }} />
                <span className="legend-label">{status}</span>
                <span className="legend-desc">{desc}</span>
              </div>
            ))}
          </div>
          <div className="legend-col">
            <h4>Content Types</h4>
            {LEGEND_TYPES.map(({ type, color, desc }) => (
              <div key={type} className="legend-row">
                <span className="legend-stripe" style={{ background: color }} />
                <span className="legend-label">{type}</span>
                <span className="legend-desc">{desc}</span>
              </div>
            ))}
          </div>
          <div className="legend-col">
            <h4>Categories</h4>
            {LEGEND_CATS.map(({ cat, desc }) => (
              <div key={cat} className="legend-row">
                <span className="legend-label">{cat}</span>
                <span className="legend-desc">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PIN modal ────────────────────────────────────────────────────────────────
function PinModal({ onSuccess, onClose }) {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (val === EDIT_PIN) { onSuccess(); }
    else { setErr(true); setVal(""); }
  };
  return (
    <div className="pin-overlay" onClick={onClose}>
      <div className="pin-modal" onClick={e => e.stopPropagation()}>
        <h3>Edit Mode</h3>
        <input
          type="password"
          inputMode="numeric"
          maxLength={6}
          value={val}
          onChange={e => { setVal(e.target.value); setErr(false); }}
          onKeyDown={e => e.key === "Enter" && submit()}
          placeholder="PIN"
          autoFocus
          className={err ? "pin-input pin-error" : "pin-input"}
        />
        {err && <p className="pin-err-msg">Incorrect PIN.</p>}
        <div className="pin-actions">
          <button className="btn btn-approve" onClick={submit}>Unlock</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_COLOR[status] || STATUS_COLOR["Proposed"];
  return <span className="status-badge" style={{ background: cfg.bg, color: cfg.text }}>{status}</span>;
}

// ─── Content Card ─────────────────────────────────────────────────────────────
function ContentCard({ item, state, editMode, onSetStatus, onNote, onImage }) {
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState(state.notes || "");
  const [pendingStatus, setPendingStatus] = useState(null);

  const luizActions = LUIZ_ACTIONS[state.approval] || [];
  const noteRequired = ["Revise", "On Hold", "Passed"];

  const handleAction = (status) => {
    if (noteRequired.includes(status) && !state.notes && !noteText.trim()) {
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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onImage(item.id, ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const borderColor = TYPE_BORDER[item.type] || "#444";
  const typeClass   = `card-type-${item.type.toLowerCase()}`;

  return (
    <div className={`content-card ${typeClass}`} style={{ borderLeftColor: borderColor }}>
      {state.image && (
        <div className="card-image-wrap">
          <img src={state.image} alt="" className="card-image" />
          {editMode && (
            <button className="card-image-remove" onClick={() => onImage(item.id, null)}>×</button>
          )}
        </div>
      )}

      <div className="card-top">
        <span className="card-type-label" style={{ color: borderColor }}>{item.type}</span>
        {item.category && <span className="card-category">{item.category}</span>}
        {item.status && <span className="card-write-status">{item.status}</span>}
        <StatusBadge status={state.approval} />
      </div>

      <h3 className="card-title">{item.title}</h3>
      {item.targetDate && <p className="card-date">{formatDate(item.targetDate)}</p>}
      <p className="card-desc">{item.description}</p>
      {item.note && <p className="card-note-preset">{item.note}</p>}

      {state.notes && !showNotes && (
        <p className="card-saved-note">"{state.notes}"</p>
      )}

      {/* Luiz's action buttons */}
      {luizActions.length > 0 && (
        <div className="card-actions">
          {luizActions.map(({ status, label, cls }) => (
            <button
              key={status}
              className={`btn ${cls} ${state.approval === status ? "active" : ""}`}
              onClick={() => handleAction(status)}
            >
              {label}
            </button>
          ))}
          <button className="btn btn-note" onClick={() => setShowNotes(!showNotes)}>
            {showNotes ? "Close" : state.notes ? "Edit Note" : "Note"}
          </button>
        </div>
      )}

      {/* Edit-mode controls — Ciamac only */}
      {editMode && (
        <div className="card-edit-controls">
          {state.approval === "Greenlit" && (
            <button className="btn btn-send-review" onClick={() => onSetStatus(item.id, "In Review")}>
              Send for Approval →
            </button>
          )}
          {state.approval === "Revise" && (
            <button className="btn btn-send-review" onClick={() => onSetStatus(item.id, "In Review")}>
              Back to Review →
            </button>
          )}
          <label className="btn btn-image">
            {state.image ? "Change Image" : "Add Image"}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
          </label>
        </div>
      )}

      {pendingStatus && !showNotes && (
        <p className="note-required">A note is required for {pendingStatus}.</p>
      )}

      {showNotes && (
        <div className="notes-panel">
          {pendingStatus && <p className="note-required">Add a note, then save.</p>}
          <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Your note..." rows={3} />
          <div className="notes-footer">
            <button className="btn btn-save-note" onClick={handleSaveNote}>Save Note</button>
            {state.notesTimestamp && (
              <span className="note-timestamp">
                Saved {new Date(state.notesTimestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Summary bar ─────────────────────────────────────────────────────────────
function SummaryBar({ itemStates }) {
  const c = useMemo(() => {
    const vals = Object.values(itemStates);
    return {
      total:       vals.length,
      proposed:    vals.filter(s => s.approval === "Proposed").length,
      greenlit:    vals.filter(s => s.approval === "Greenlit").length,
      inReview:    vals.filter(s => ["In Review","Revise"].includes(s.approval)).length,
      approved:    vals.filter(s => s.approval === "Approved").length,
      onHold:      vals.filter(s => s.approval === "On Hold").length,
    };
  }, [itemStates]);

  const items = [
    { label: "Total",       val: c.total,    cls: "" },
    { label: "Proposed",    val: c.proposed, cls: "sc-proposed" },
    { label: "Greenlit",    val: c.greenlit, cls: "sc-greenlit" },
    { label: "In Review",   val: c.inReview, cls: "sc-review"   },
    { label: "Approved",    val: c.approved, cls: "sc-approved"  },
    { label: "On Hold",     val: c.onHold,   cls: "sc-hold"      },
  ];

  return (
    <div className="summary-bar">
      {items.map(({ label, val, cls }) => (
        <div key={label} className={`summary-item ${cls}`}>
          <span className="summary-count">{val}</span>
          <span className="summary-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
function Section({ title, subtitle, cards, itemStates, editMode, onSetStatus, onNote, onImage, groupByMonth }) {
  if (cards.length === 0) return null;

  const renderCard = (item) => (
    <ContentCard
      key={item.id}
      item={item}
      state={itemStates[item.id]}
      editMode={editMode}
      onSetStatus={onSetStatus}
      onNote={onNote}
      onImage={onImage}
    />
  );

  return (
    <section className="brief-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-sub">{subtitle}</p>}
        </div>
        <span className="section-count">{cards.length}</span>
      </div>

      {groupByMonth ? (
        MONTHS.filter(m => cards.some(c => c.month === m)).map(month => (
          <div key={month} className="month-group">
            <h3 className="month-label">{month === "Ongoing" ? "Ongoing" : `${month} 2026`}</h3>
            <div className="cards-grid">
              {cards.filter(c => c.month === month).map(renderCard)}
            </div>
          </div>
        ))
      ) : (
        <div className="cards-grid">
          {cards.map(renderCard)}
        </div>
      )}
    </section>
  );
}

// ─── Suggestions ─────────────────────────────────────────────────────────────
function SuggestionsSection({ suggestions, onAdd, onDelete }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    onAdd({ title: title.trim(), description: desc.trim() });
    setTitle(""); setDesc(""); setOpen(false);
  };

  return (
    <section className="suggestions-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Suggestions</h2>
          <p className="section-sub">Content ideas from Luiz</p>
        </div>
        <button className="btn btn-suggest" onClick={() => setOpen(o => !o)}>
          {open ? "Cancel" : "+ Suggest an Idea"}
        </button>
      </div>

      {open && (
        <div className="suggest-form">
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="suggest-input" autoFocus />
          <textarea placeholder="Short description (optional)" value={desc} onChange={e => setDesc(e.target.value)} className="suggest-textarea" rows={3} />
          <button className="btn btn-save-note" onClick={submit} disabled={!title.trim()}>Submit Idea</button>
        </div>
      )}

      {suggestions.length > 0 ? (
        <div className="suggestions-list">
          {suggestions.map(s => (
            <div key={s.id} className="suggestion-card">
              <div>
                <p className="suggestion-title">{s.title}</p>
                {s.description && <p className="suggestion-desc">{s.description}</p>}
                <p className="suggestion-ts">{new Date(s.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</p>
              </div>
              <button className="btn-delete" onClick={() => onDelete(s.id)}>×</button>
            </div>
          ))}
        </div>
      ) : !open && <p className="suggestions-empty">No suggestions yet.</p>}
    </section>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [itemStates,  setItemStates]  = useState(() => mergeState(contentItems, loadState()));
  const [suggestions, setSuggestions] = useState(() => loadSuggestions());
  const [editMode,    setEditMode]    = useState(false);
  const [showPin,     setShowPin]     = useState(false);
  const [filterMonth, setFilterMonth] = useState("All");
  const [filterType,  setFilterType]  = useState("All");

  useEffect(() => saveState(itemStates),     [itemStates]);
  useEffect(() => saveSuggestions(suggestions), [suggestions]);

  const onSetStatus = (id, status) =>
    setItemStates(prev => ({ ...prev, [id]: { ...prev[id], approval: status } }));

  const onNote = (id, text) =>
    setItemStates(prev => ({ ...prev, [id]: { ...prev[id], notes: text, notesTimestamp: new Date().toISOString() } }));

  const onImage = (id, dataUrl) =>
    setItemStates(prev => ({ ...prev, [id]: { ...prev[id], image: dataUrl } }));

  const onAddSuggestion = ({ title, description }) =>
    setSuggestions(prev => [...prev, { id: Date.now().toString(), title, description, createdAt: new Date().toISOString() }]);

  const onDeleteSuggestion = (id) =>
    setSuggestions(prev => prev.filter(s => s.id !== id));

  const handleReset = () => {
    if (window.confirm("Reset all statuses, notes, and images? This cannot be undone.")) {
      const fresh = {};
      contentItems.forEach(item => {
        fresh[item.id] = { approval: "Proposed", notes: "", notesTimestamp: null, image: null };
      });
      setItemStates(fresh);
    }
  };

  // Filter and section assignment
  const filtered = contentItems.filter(item => {
    if (filterMonth !== "All" && item.month !== filterMonth) return false;
    if (filterType  !== "All" && item.type  !== filterType)  return false;
    return true;
  });

  const inSection = (section) => filtered.filter(item => SECTION_OF[itemStates[item.id]?.approval] === section);

  const types = ["All", ...new Set(contentItems.map(i => i.type))];

  const sharedProps = { itemStates, editMode, onSetStatus, onNote, onImage };

  return (
    <div className="app">
      {showPin && (
        <PinModal
          onSuccess={() => { setEditMode(true); setShowPin(false); }}
          onClose={() => setShowPin(false)}
        />
      )}

      <header className="app-header">
        <div>
          <h1 className="app-title">The Brief</h1>
          <p className="app-sub">IDT Content Plan — April to June 2026</p>
        </div>
        <div className="header-right">
          {editMode ? (
            <>
              <span className="edit-mode-badge">Edit Mode</span>
              <button className="btn btn-lock" onClick={() => setEditMode(false)}>Lock</button>
              <button className="btn btn-reset" onClick={handleReset}>Reset All</button>
            </>
          ) : (
            <button className="btn btn-lock" onClick={() => setShowPin(true)}>Edit</button>
          )}
        </div>
      </header>

      <Legend />
      <SummaryBar itemStates={itemStates} />

      <div className="filters">
        <div className="filter-group">
          <label>Month</label>
          <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
            <option value="All">All months</option>
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Type</label>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <Section
        title="Proposals"
        subtitle="Review each item. Greenlit means go build it."
        cards={inSection("proposals")}
        groupByMonth
        {...sharedProps}
      />

      <Section
        title="In Development"
        subtitle="Greenlit items Ciamac is building. Revise items being reworked before resubmission."
        cards={inSection("development")}
        {...sharedProps}
      />

      <Section
        title="In Review"
        subtitle="Draft is ready. Your call: Approve to publish, or Request Changes."
        cards={inSection("review")}
        {...sharedProps}
      />

      <Section
        title="Approved"
        subtitle="Final sign-off given. Ready to publish."
        cards={inSection("approved")}
        {...sharedProps}
      />

      {inSection("passed").length > 0 && (
        <Section
          title="Passed"
          subtitle="Not this cycle."
          cards={inSection("passed")}
          {...sharedProps}
        />
      )}

      <SuggestionsSection
        suggestions={suggestions}
        onAdd={onAddSuggestion}
        onDelete={onDeleteSuggestion}
      />

      <footer className="app-footer">
        <p>The Brief — IDT Content Review</p>
      </footer>
    </div>
  );
}
