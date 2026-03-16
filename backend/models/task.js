// file that we use to send to mongodb to stucture the database
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true },
    Description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    completed: {type: Boolean, default: false},
    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'medium'}, // New field
    category: {type: String, default: 'general'}, // New field for organisation
    dateCreated: {type: Date, default: Date.now}
});

// ============ INDEXES FOR OPTIMISED DATA RETRIEVAL ============
// Index 1: Compound index on completed + dueDate (for filtering incomplete tasks by due date)
// This acts like a "partition key" (completed) + "sort key" (dueDate)
taskSchema.index({ completed: 1, dueDate: 1 });

// Index 2: Index on category for fast category-based queries
taskSchema.index({ category: 1 });

// Index 3: Index on priority for filtering by priority level
taskSchema.index({ priority: 1 });

// Index 4: Compound index for category + completed (partition by category, filter by status)
taskSchema.index({ category: 1, completed: 1 });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;