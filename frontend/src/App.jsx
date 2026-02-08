import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// 🗑️ Trash Icon Component (Simple SVG)
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const API_URL = "http://localhost:8081/tasks"; // 🔗 The Java Backend

  // 1. READ: Fetch tasks 📖
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get(API_URL)
      .then(response => setTasks(response.data))
      .catch(error => console.error("Error:", error));
  };

  // 2. CREATE: Add task ➕
  const addTask = () => {
    if (!newTask) return;
    axios.post(API_URL, { title: newTask, completed: false })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch(error => console.error("Error:", error));
  };

  // 3. UPDATE: Toggle Checkbox (Mark as Done) ✅
  const toggleTask = (id, currentStatus, title) => {
    axios.put(`${API_URL}/${id}`, {
      title: title,            // Keep title the same
      completed: !currentStatus // Flip the status (true -> false, false -> true)
    })
    .then(response => {
      // Update the UI instantly without reloading
      setTasks(tasks.map(task => 
        task.id === id ? response.data : task
      ));
    })
    .catch(error => console.error("Error updating:", error));
  };

  // 4. DELETE: Remove task 🗑️
  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => {
        // Remove it from the UI instantly
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error("Error deleting:", error));
  };

  return (
    <div className="app-container">
      <h1>🏆 Task Master 3000</h1>
      
      {/* INPUT FORM */}
      <div className="input-group">
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask} className="add-btn">Add</button>
      </div>

      {/* THE LIST */}
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
            
            {/* CHECKBOX (Click text to toggle) */}
            <span 
              onClick={() => toggleTask(task.id, task.completed, task.title)}
              style={{ cursor: "pointer", flexGrow: 1, textAlign: "left" }}
            >
              {task.completed ? "✅ " : "⬜ "} 
              {task.title}
            </span>

            {/* DELETE BUTTON */}
            <button 
              onClick={() => deleteTask(task.id)} 
              className="delete-btn"
              title="Delete Task"
            >
              <TrashIcon />
            </button>

          </li>
        ))}
      </ul>
    </div>
  )
}

export default App