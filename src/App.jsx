import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function TrackerApp() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    school: "",
    curriculum: "",
    applied: false,
    interview: false,
    followUp: new Date(),
  });

  useEffect(() => {
    const stored = localStorage.getItem("appTracker");
    if (stored) setEntries(JSON.parse(stored));
  }, []);

    useEffect(() => {
      localStorage.setItem("appTracker", JSON.stringify(entries));
    }, [entries]);

    const handleAdd = () => {
      if (!form.school.trim()) return;
      setEntries([...entries, { ...form, id: Date.now() }]);
      setForm({
        school: "",
        curriculum: "",
        applied: false,
        interview: false,
        followUp: new Date(),
      });
    };

    const toggleField = (id, field) => {
      setEntries(entries.map(e => e.id === id ? { ...e, [field]: !e[field] } : e));
    };

    return (
      <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Math Teacher Job Tracker</h1>
      <div style={{ margin: "1rem 0" }}>
      <input
      placeholder="School Name"
      value={form.school}
      onChange={e => setForm({ ...form, school: e.target.value })}
      style={{ padding: "0.5rem", marginRight: "1rem" }}
      />
      <input
      placeholder="Curriculum"
      value={form.curriculum}
      onChange={e => setForm({ ...form, curriculum: e.target.value })}
      style={{ padding: "0.5rem", marginRight: "1rem" }}
      />
      <input
      type="date"
      value={format(form.followUp, "yyyy-MM-dd")}
      onChange={e => setForm({ ...form, followUp: new Date(e.target.value) })}
      style={{ padding: "0.5rem", marginRight: "1rem" }}
      />
      <button onClick={handleAdd} style={{ padding: "0.5rem" }}>Add Entry</button>
      </div>

      {entries.map(entry => (
        <div
        key={entry.id}
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          marginBottom: "0.5rem",
          background: new Date(entry.followUp) <= new Date() ? "#fff7e6" : "#f9f9f9"
        }}
        >
        <strong>{entry.school}</strong><br />
        Curriculum: {entry.curriculum}<br />
        Follow-up: {format(new Date(entry.followUp), "yyyy-MM-dd")}<br />
        <button onClick={() => toggleField(entry.id, "applied")} style={{ marginRight: "1rem" }}>
        {entry.applied ? "✅ Applied" : "Apply"}
        </button>
        <button onClick={() => toggleField(entry.id, "interview")}>
        {entry.interview ? "🎤 Interviewed" : "Interview?"}
        </button>
        </div>
      ))}
      </div>
    );
}

