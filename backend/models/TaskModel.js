const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String },
  assignedTo:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['Pending', 'Accepted','In Progress', 'Completed','Ignored'],
    default: 'Pending'
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  estimatedTime:     { type: Number, required: true },  // in hours
  actualTimeSpent:   { type: Number, default: 0 },       // in hours
  startTime:         { type: Date },
  endTime:           { type: Date },
  projectName: { type: String, default: '' }

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
