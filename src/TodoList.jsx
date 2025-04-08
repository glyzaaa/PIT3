// src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://pit3-axj5.onrender.com/api/tasks/";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply dark mode based on toggle
  useEffect(() => {
    document.body.className = darkMode ? "dark-mode" : "light-mode";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // Fetch tasks from Django backend
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/tasks/")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  // Optional: You can implement POST later
  const addTask = () => {
    if (newTask.trim()) {
      // To make this work with Django, you'd need to POST to the backend
      axios
        .post("http://127.0.0.1:8000/api/tasks/", {
          title: newTask,
          completed: false,
        })
        .then((res) => {
          setTasks([...tasks, res.data]);
          setNewTask("");
        })
        .catch((err) => console.error("Error adding task:", err));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="container">
      <h1>React TODO App</h1>
      <div className="todo-box">
        <span className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌙" : "☀️"}
        </span>

        <div className="input-section">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
          />
          <button className="add-btn" onClick={addTask}>
            Add Task
          </button>
        </div>

        <div className="filter-section">
          <label>Filter:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className={task.completed ? "completed" : ""}>
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
