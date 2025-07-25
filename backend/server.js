const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');


//Imports 
const ErrorMiddleware = require('./middleware/ErrorMiddleware');
const authRoutes = require('./routes/AuthRoutes');
const userRoutes = require('./routes/UserRoutes');
const taskRoutes = require('./routes/TaskRoutes');
const uploadRoutes = require('./routes/UploadRoutes');




dotenv.config();


const app = express();

// Middlewares Activcation
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(ErrorMiddleware);




//Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/upload', uploadRoutes);





// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('DataBase Initailisation Success. 🟢');

    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server Started on port ${process.env.PORT}`);
    });
})
.catch(err => {
    console.error('DataBAse Failed to Initialise throws error >>  🔴🔴', err.message);
});
