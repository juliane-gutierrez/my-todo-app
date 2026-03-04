const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// ============================================================
// DATA PERSISTENCE QUERIES - CRUD OPERATIONS
// ============================================================

// ============ READ QUERIES ============

// QUERY 1: GET /tasks - Get all tasks (sorted by dateCreated)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ dateCreated: -1 }); // Sort by newest first
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 2: GET /tasks/incomplete - Get incomplete tasks sorted by due date
// Uses index: { completed: 1, dueDate: 1 }
router.get('/incomplete', async (req, res) => {
    try {
        const tasks = await Task.find({ completed: false }).sort({ dueDate: 1 }); // Soonest due first
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 3: GET /tasks/completed - Get completed tasks
router.get('/completed', async (req, res) => {
    try {
        const tasks = await Task.find({ completed: true }).sort({ dateCreated: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 4: GET /tasks/category/:category - Get tasks by category
// Uses index: { category: 1 }
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const tasks = await Task.find({ category: category }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 5: GET /tasks/priority/:priority - Get tasks by priority level
// Uses index: { priority: 1 }
router.get('/priority/:priority', async (req, res) => {
    try {
        const { priority } = req.params;
        const tasks = await Task.find({ priority: priority }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 6: GET /tasks/overdue - Get overdue incomplete tasks
router.get('/overdue', async (req, res) => {
    try {
        const today = new Date();
        const tasks = await Task.find({ 
            completed: false, 
            dueDate: { $lt: today }  // $lt = less than (before today)
        }).sort({ dueDate: 1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 7: GET /tasks/:id - Get a single task by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============ CREATE QUERIES ============

// QUERY 8: POST /tasks - Create a new task
router.post('/', async (req, res) => {
    try {
        const newTask = new Task({
            title: req.body.title,
            Description: req.body.Description,
            dueDate: req.body.dueDate,
            priority: req.body.priority || 'medium',
            category: req.body.category || 'general',
            completed: false
        });
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// QUERY 9: POST /tasks/bulk - Create multiple tasks at once
router.post('/bulk', async (req, res) => {
    try {
        const tasks = req.body.tasks; // Expects { tasks: [{...}, {...}] }
        const savedTasks = await Task.insertMany(tasks);
        res.status(201).json(savedTasks);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ============ UPDATE QUERIES ============

// QUERY 10: PUT /tasks/:id - Update a task (full update)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { 
            new: true,           // Return the updated document
            runValidators: true  // Validate the update against the schema
        });
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 11: PATCH /tasks/:id/toggle - Toggle completed status
router.patch('/:id/toggle', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }
        task.completed = !task.completed;
        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 12: PATCH /tasks/:id/priority - Update only the priority
router.patch('/:id/priority', async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            id, 
            { priority: priority },
            { new: true, runValidators: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 13: PUT /tasks/complete-all - Mark all tasks as completed
router.put('/complete-all', async (req, res) => {
    try {
        const result = await Task.updateMany(
            { completed: false },  // Filter: only incomplete tasks
            { completed: true }    // Update: set completed to true
        );
        res.json({ message: `${result.modifiedCount} tasks marked as completed` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ============ DELETE QUERIES ============

// QUERY 14: DELETE /tasks/:id - Delete a single task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        res.json({ message: "Task Deleted", task: deletedTask });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// QUERY 15: DELETE /tasks/completed/all - Delete all completed tasks
router.delete('/completed/all', async (req, res) => {
    try {
        const result = await Task.deleteMany({ completed: true });
        res.json({ message: `${result.deletedCount} completed tasks deleted` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;