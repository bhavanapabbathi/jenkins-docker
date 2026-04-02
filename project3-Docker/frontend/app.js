const API = "http://localhost:8000";

// Register User
async function registerUser() {
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    const res = await fetch(`${API}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
        document.getElementById("reg-msg").innerText = `✅ User registered! Your ID is: ${data.id}`;
    } else {
        document.getElementById("reg-msg").innerText = `❌ Error: ${data.detail}`;
        document.getElementById("reg-msg").style.color = "red";
    }
}

// Add Task
async function addTask() {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-desc").value;
    const status = document.getElementById("task-status").value;
    const owner_id = parseInt(document.getElementById("task-owner").value);

    const res = await fetch(`${API}/tasks/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status, owner_id })
    });

    const data = await res.json();
    if (res.ok) {
        document.getElementById("task-msg").innerText = `✅ Task added successfully!`;
        loadTasks();
    } else {
        document.getElementById("task-msg").innerText = `❌ Error: ${data.detail}`;
        document.getElementById("task-msg").style.color = "red";
    }
}

// Load Tasks
async function loadTasks() {
    const res = await fetch(`${API}/tasks/`);
    const tasks = await res.json();

    const list = document.getElementById("task-list");
    list.innerHTML = "";

    if (tasks.length === 0) {
        list.innerHTML = "<p>No tasks found.</p>";
        return;
    }

    tasks.forEach(task => {
        list.innerHTML += `
            <div class="task-item status-${task.status}">
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p>Status: <strong>${task.status}</strong> | User ID: ${task.owner_id}</p>
                <button class="delete-btn" onclick="deleteTask(${task.id})">🗑 Delete</button>
            </div>
        `;
    });
}

// Delete Task
async function deleteTask(id) {
    const res = await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
        loadTasks();
    }
}

// Load tasks on page load
window.onload = loadTasks;
