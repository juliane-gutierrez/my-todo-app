const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// GET /tasks - Get all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /tasks - Create a new task
router.post('/', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        res.json(savedTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Task.findByIdAndDelete(id);
        res.json({ message: "Task Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /tasks/:id - Update a task (Toggle completed)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedTask);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;