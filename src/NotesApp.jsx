import React, { useEffect, useState } from "react";
import axios from "axios";

function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch notes
  useEffect(() => {
    axios.get("https://noteapp-backend-ki18.onrender.com/api/notes")
      .then(res => setNotes(res.data))
      .catch(err => console.log(err));
  }, []);

  // Add or Update Note
  const handleSubmit = () => {
    if (!form.title || !form.content) return;

    if (editingId) {
      axios.put(`https://noteapp-backend-ki18.onrender.com/api/notes/${editingId}`, form)
        .then(res => {
          setNotes(notes.map(note => note._id === editingId ? res.data : note));
          setForm({ title: "", content: "" });
          setEditingId(null);
        });
    } else {
      axios.post("https://noteapp-backend-ki18.onrender.com/api/notes", form)
        .then(res => {
          setNotes([res.data, ...notes]);
          setForm({ title: "", content: "" });
        });
    }
  };

  // Delete Note
  const deleteNote = (id) => {
    axios.delete(`https://noteapp-backend-ki18.onrender.com/api/notes/${id}`)
      .then(() => {
        setNotes(notes.filter(note => note._id !== id));
      });
  };

  // Edit Note
  const editNote = (note) => {
    setForm({ title: note.title, content: note.content });
    setEditingId(note._id);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📝 My Magical Notes</h2>

      {/* Form */}
      <div style={styles.formCard}>
        <input
          type="text"
          placeholder="Enter title..."
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          style={styles.input}
        />
        <textarea
          placeholder="Write your note..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          style={styles.textarea}
        />
        <button onClick={handleSubmit} style={styles.addButton}>
          {editingId ? "✏️ Update Note" : "➕ Add Note"}
        </button>
      </div>

      {/* Notes Grid */}
      <div style={styles.notesGrid}>
        {notes.map(note => (
          <div key={note._id} style={{ ...styles.noteCard, background: randomColor() }}>
            <h3 style={styles.noteTitle}>{note.title}</h3>
            <p style={styles.noteContent}>{note.content}</p>
            <div style={styles.actions}>
              <button onClick={() => editNote(note)} style={styles.editButton}>✏️ Edit</button>
              <button onClick={() => deleteNote(note._id)} style={styles.deleteButton}>🗑️ Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🎨 Random pastel colors for notes
function randomColor() {
  const colors = ["#FFEBEE", "#E3F2FD", "#E8F5E9", "#FFF3E0", "#F3E5F5", "#FBE9E7"];
  return colors[Math.floor(Math.random() * colors.length)];
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "25px",
    color: "#2c3e50",
  },
  formCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    minHeight: "100px",
    resize: "none",
  },
  addButton: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#4CAF50",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s",
  },
  notesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  noteCard: {
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
  },
  noteTitle: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "bold",
  },
  noteContent: {
    margin: "0 0 15px 0",
    fontSize: "15px",
    lineHeight: "1.5",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  editButton: {
    background: "#ff9800",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
  },
  deleteButton: {
    background: "#f44336",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
  }
};

export default NotesApp;
