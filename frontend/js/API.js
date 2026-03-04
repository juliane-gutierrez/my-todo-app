// Handling the communication with the backend.

const url = 'http://localhost:3000'; // Backend URL

// ============ API FUNCTIONS ============

// 1. GET all tasks (READ)
async function getTasks() {
    try {
        const response = await fetch(`${url}/tasks`);
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return [];
    }
}

// 2. CREATE a new task
async function createTask(taskData) {
    try {
        const response = await fetch(`${url}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        const newTask = await response.json();
        return newTask;
    } catch (error) {
        console.error("Error creating task:", error);
    }
}

// 3. UPDATE a task (toggle completed)
async function updateTask(id, updates) {
    try {
        const response = await fetch(`${url}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        const updatedTask = await response.json();
        return updatedTask;
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

// 4. DELETE a task
async function deleteTask(id) {
    try {
        const response = await fetch(`${url}/tasks/${id}`, {
            method: 'DELETE'
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// ============ UI FUNCTIONS ============

// Display all tasks on the page
async function displayTasks() {
    const tasks = await getTasks();
    const toDoList = document.getElementById('toDoList');
    const completedList = document.getElementById('completedList');
    
    // Clear existing lists
    toDoList.innerHTML = '<h2>To Do</h2>';
    completedList.innerHTML = '<h2>Completed</h2>';
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${task.title}</strong> - ${task.Description}
            <br><small>Due: ${new Date(task.dueDate).toLocaleDateString()}</small>
            <br>
            <button onclick="toggleComplete('${task._id}', ${!task.completed})">
                ${task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            <button onclick="removeTask('${task._id}')">Delete</button>
        `;
        
        if (task.completed) {
            li.style.textDecoration = 'line-through';
            completedList.appendChild(li);
        } else {
            toDoList.appendChild(li);
        }
    });
}

// Handle form submission to create new task
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const taskData = {
        title: formData.get('taskName'),
        Description: formData.get('description') || 'No description',
        dueDate: formData.get('dueDate') || new Date()
    };
    
    await createTask(taskData);
    form.reset();
    displayTasks(); // Refresh the list
}

// Toggle task completion
async function toggleComplete(id, completed) {
    await updateTask(id, { completed });
    displayTasks(); // Refresh the list
}

// Remove a task
async function removeTask(id) {
    await deleteTask(id);
    displayTasks(); // Refresh the list
}

// ============ EVENT LISTENERS ============
window.addEventListener('DOMContentLoaded', () => {
    displayTasks();
    
    const form = document.getElementById('taskForm');
    form.addEventListener('submit', handleFormSubmit);
});