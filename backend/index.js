//Passwords and API Keys
require("dotenv").config();

//Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//Server
const app = express();
const port = 3000;

//Middleware
app.use(express.json()); //Allows us to use JSON bodies
app.use(cors()); //Allows frontend to communicate

//Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("Database Connection Error", err));

//Import Routes
const taskRoutes = require('./routes/taskRoutes');

//Routing
app.get('/', (req, res) => {
    res.send("Backend is Running!");
});

app.use('/tasks', taskRoutes);

app.listen(port, () => {
    console.log(`Server is listening in port ${port}`);
});



//console.log("Hello! The To Do App Backend is starting...")