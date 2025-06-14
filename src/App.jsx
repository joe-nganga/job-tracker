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
  const [search, setSearch] = useState("");

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

    const filteredEntries = entries.filter(entry =>
    entry.school.toLowerCase().includes(search.toLowerCase())
    );

    const exportCSV = () => {
      const headers = ["School", "Curriculum", "Follow-up Date", "Applied", "Interview"];
      const rows = entries.map(e => [
        e.school,
        e.curriculum,
        format(new Date(e.followUp), "yyyy-MM-dd"),
          e.applied ? "Yes" : "No",
          e.interview ? "Yes" : "No"
      ]);
      const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "applications.csv";
      link.click();
    };

    return (
      <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>📋 Job Application Tracker</h1>
      <div style={{ marginBottom: "1rem" }}>
      <input
      placeholder="Search by school..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <input
      placeholder="School Name"
      value={form.school}
      onChange={e => setForm({ ...form, school: e.target.value })}
      style={{ padding: "0.5rem", flex: 1 }}
      />
      <input
      placeholder="Curriculum"
      value={form.curriculum}
      onChange={e => setForm({ ...form, curriculum: e.target.value })}
      style={{ padding: "0.5rem", flex: 1 }}
      />
      <input
      type="date"
      value={format(form.followUp, "yyyy-MM-dd")}
      onChange={e => setForm({ ...form, followUp: new Date(e.target.value) })}
      style={{ padding: "0.5rem" }}
      />
      <button onClick={handleAdd} style={{ padding: "0.5rem 1rem", background: "#4CAF50", color: "white", border: "none" }}>Add</button>
      <button onClick={exportCSV} style={{ padding: "0.5rem 1rem", background: "#2196F3", color: "white", border: "none" }}>Export CSV</button>
      </div>
      </div>

      {filteredEntries.length === 0 && <div style={{ color: "#888" }}>No entries found.</div>}

      {filteredEntries.map(entry => (
        <div
        key={entry.id}
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          backgroundColor: new Date(entry.followUp) <= new Date() ? "#fff3cd" : "#e9f7ef",
        }}
        >
        <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{entry.school}</div>
        <div>Curriculum: <strong>{entry.curriculum}</strong></div>
        <div>Follow-up: <strong>{format(new Date(entry.followUp), "yyyy-MM-dd")}</strong></div>
        <div style={{ marginTop: "0.5rem" }}>
        <button
        onClick={() => toggleField(entry.id, "applied")}
        style={{
          padding: "0.3rem 0.8rem",
          marginRight: "1rem",
          backgroundColor: entry.applied ? "#28a745" : "#f8f9fa",
          color: entry.applied ? "white" : "black",
          border: "1px solid #ccc"
        }}
        >
        {entry.applied ? "✅ Applied" : "Apply"}
        </button>
        <button
        onClick={() => toggleField(entry.id, "interview")}
        style={{
          padding: "0.3rem 0.8rem",
          backgroundColor: entry.interview ? "#17a2b8" : "#f8f9fa",
          color: entry.interview ? "white" : "black",
          border: "1px solid #ccc"
        }}
        >
        {entry.interview ? "🎤 Interviewed" : "Interview?"}
        </button>
        </div>
        </div>
      ))}
      </div>
    );
}
