const express = require('express');
const router = express.Router();
const AuthMiddleware = require('../middleware/AuthMiddleware');
const {
  createTask,
  getTasksByUser,
  updateTask,
  deleteTask,
  startTimer,
  stopTimer,
  getReportByUser,
  updateTaskDetails,
  getAllTasks
} = require('../controllers/TaskController');

router.get('/', AuthMiddleware, getAllTasks);
router.post('/', AuthMiddleware, createTask);
router.get('/user', AuthMiddleware, getTasksByUser);
router.put('/:id', AuthMiddleware, updateTask);
router.put('/task/:id', AuthMiddleware, updateTaskDetails);
router.delete('/:id', AuthMiddleware, deleteTask);
router.put('/:id/start', AuthMiddleware, startTimer);
router.put('/:id/stop', AuthMiddleware, stopTimer);
router.get('/report/:userId', AuthMiddleware, getReportByUser);

module.exports = router;
