import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

// 🗑️ Trash Icon
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
)

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  
  // 🔐 SECURITY STATE
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://taskmaster-fullstack-production.up.railway.app/api/tasks";

  // 🔑 THE CREDENTIALS (The "Briefcase")
  const authConfig = {
    auth: {
      username: username,
      password: password
    }
  };

  // 1. LOGIN FUNCTION
  const handleLogin = (e) => {
    e.preventDefault();
    axios.get(API_URL, authConfig)
      .then(response => {
        setTasks(response.data);
        setIsLoggedIn(true);
        setError("");
      })
      .catch(error => {
        setError("❌ Login Failed! Check console.");
        console.error(error);
      });
  };

  // 2. CREATE (With Error Handling) ➕
  const addTask = () => {
    setError(""); // Clear previous errors

    axios.post(API_URL, { title: newTask, completed: false }, authConfig)
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask("");
        setError(""); 
      })
      .catch(error => {
        console.error("Error:", error);
        // 🕵️‍♂️ DETECTIVE WORK: Show Backend Error
        if (error.response && error.response.status === 400) {
            setError("❌ Backend says: Title is invalid (check rules)");
        } else {
            setError("❌ Something exploded.");
        }
      });
  };

  // 3. UPDATE (I put this back!) ✅
  const toggleTask = (id, currentStatus, title) => {
    axios.put(`${API_URL}/${id}`, { title, completed: !currentStatus }, authConfig)
      .then(response => {
        setTasks(tasks.map(t => t.id === id ? response.data : t));
      })
      .catch(error => console.error("Error:", error));
  };

  // 4. DELETE (I put this back!) 🗑️
  const deleteTask = (id) => {
    axios.delete(`${API_URL}/${id}`, authConfig)
      .then(() => setTasks(tasks.filter(t => t.id !== id)))
      .catch(error => console.error("Error:", error));
  };

  // 🛑 IF NOT LOGGED IN -> SHOW LOGIN FORM
  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <h1>🔐 Security Gate</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Username (user)" 
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Unlock App 🔓</button>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>
    );
  }

  // ✅ IF LOGGED IN -> SHOW TASKS
  return (
    <div className="app-container">
      <h1>🏆 Task Master 3000</h1>
      <div style={{marginBottom: '20px', color: '#03dac6'}}>
        Logged in as: <strong>{username}</strong>
      </div>
      
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

      {/* 🔴 ERROR MESSAGE ZONE (Now inside the return!) */}
      {error && <div style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>{error}</div>}

      <ul className="task-list">
        {tasks.map(task => (
          <li key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
            <span 
              onClick={() => toggleTask(task.id, task.completed, task.title)}
              style={{ cursor: "pointer", flexGrow: 1, textAlign: "left" }}
            >
              {task.completed ? "✅ " : "⬜ "} {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} className="delete-btn"><TrashIcon /></button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App