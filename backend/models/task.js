// file that we use to send to mongodb to stucture the database
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {type: String, required:true },
    Description: {type: String, required: true},
    dueDate: {type: Date, required: true},
    completed: {type: Boolean, default: false},
    dateCreated: {type: Date, default: Date.now}
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;