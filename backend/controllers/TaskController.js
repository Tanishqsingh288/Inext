const Task = require('../models/TaskModel');
const mongoose = require('mongoose');

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, status, estimatedTime, projectName } = req.body;

    if (!title || !assignedTo || !estimatedTime) {
      return res.status(400).json({ message: 'Title, AssignedTo, and EstimatedTime are required' });
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      status,
      estimatedTime,
      projectName: projectName || '',
      createdBy: req.user.id,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created', task: newTask });

  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'firstName')
      .populate('createdBy', 'firstName');

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching all tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

async function getTasksByUser(req, res) {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User information missing' });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const tasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (err) {
    console.error('🔥 Error in getTasksByUser:', err.message);
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
}

async function updateTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.body.status === 'Accepted' && !task.startTime) {
      task.startTime = new Date();
    }

    Object.assign(task, req.body);
    await task.save();

    res.json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task' });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
}

async function startTimer(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (!task.startTime) {
      task.startTime = new Date();
    }

    if (task.status === 'Accepted') {
      task.status = 'In Progress';
    }

    await task.save();

    res.json({ message: 'Timer started', task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to start timer' });
  }
}

async function stopTimer(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !task.startTime) {
      return res.status(400).json({ message: 'Timer was not started for this task' });
    }

    const now = new Date();
    const start = new Date(task.startTime);
    const durationInHours = (now - start) / (1000 * 60 * 60);

    task.endTime = now;
    task.actualTimeSpent = parseFloat((task.actualTimeSpent + durationInHours).toFixed(2));
    task.startTime = null;

    if (task.status === 'In Progress') {
      task.status = 'Completed';
    }

    await task.save();

    res.json({ message: 'Timer stopped', actualTimeSpent: task.actualTimeSpent, task });
  } catch (err) {
    res.status(500).json({ message: 'Failed to stop timer' });
  }
}

async function getReportByUser(req, res) {
  try {
    const userId = req.params.userId;

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const tasks = await Task.find({ assignedTo: userId }, 'title actualTimeSpent');

    const daily = await Task.aggregate([
      { $match: { assignedTo: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalHours: { $sum: "$actualTimeSpent" },
          tasks: { $push: "$title" }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    res.json({ totalTasks, tasks, dailyReport: daily });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report' });
  }
}

const updateTaskDetails = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, estimatedTime, assignedTo } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title !== undefined && title.trim() !== '') {
      task.title = title.trim();
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (estimatedTime !== undefined && estimatedTime !== '') {
      const est = Number(estimatedTime);
      if (!isNaN(est)) task.estimatedTime = est;
      else return res.status(400).json({ message: 'Estimated time must be a number' });
    }

    if (assignedTo !== undefined && assignedTo !== '') {
      task.assignedTo = assignedTo;
    }

    await task.save();

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (err) {
    console.error('❌ Update task error:', err.message);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

module.exports = {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
  startTimer,
  stopTimer,
  getReportByUser,
  updateTaskDetails,
  getAllTasks
};
