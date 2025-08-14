const mongoose = require('mongoose');

/**
 * Bug Schema - Defines the structure for bug documents in MongoDB
 * Includes validation, defaults, and timestamps for tracking
 */
const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Bug title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Bug description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Priority must be Low, Medium, or High'
    },
    default: 'Medium'
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: {
      values: ['Open', 'In Progress', 'Resolved'],
      message: 'Status must be Open, In Progress, or Resolved'
    },
    default: 'Open'
  },
  reportedBy: {
    type: String,
    required: [true, 'Reporter name is required'],
    trim: true,
    maxlength: [50, 'Reporter name cannot exceed 50 characters']
  },
  assignedTo: {
    type: String,
    trim: true,
    default: ''
  },
  source: {
    type: String,
    enum: {
      values: ['internal', 'customer'],
      message: 'Source must be internal or customer'
    },
    default: 'internal'
  },
  customer: {
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    id: { type: String, trim: true }
  },
  comments: [
    {
      author: { type: String, required: true, trim: true },
      message: { type: String, required: true, trim: true, maxlength: 2000 },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  statusHistory: [
    {
      from: { type: String },
      to: { type: String, required: true },
      by: { type: String, trim: true },
      at: { type: Date, default: Date.now },
      reason: { type: String, trim: true, maxlength: 500 }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

/**
 * Virtual field for formatted creation date
 * Useful for display purposes
 */
bugSchema.virtual('formattedCreatedAt').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

/**
 * Instance method to update bug status
 * Includes validation and logging for debugging
 */
bugSchema.methods.updateStatus = function(newStatus) {
  console.log(`🔄 Updating bug ${this._id} status from ${this.status} to ${newStatus}`);
  
  if (!['Open', 'In Progress', 'Resolved'].includes(newStatus)) {
    throw new Error('Invalid status value');
  }
  
  const previousStatus = this.status;
  this.status = newStatus;
  this.updatedAt = new Date();
  // Record status change in history
  this.statusHistory.push({ from: previousStatus, to: newStatus, by: 'system' });
  
  console.log(`✅ Bug status updated successfully`);
  return this.save();
};

/**
 * Instance method to add a comment
 */
bugSchema.methods.addComment = function(author, message) {
  console.log(`💬 Adding comment to bug ${this._id} by ${author}`);
  this.comments.push({ author, message });
  this.updatedAt = new Date();
  return this.save();
};

/**
 * Static method to find bugs by priority
 * Useful for filtering and reporting
 */
bugSchema.statics.findByPriority = function(priority) {
  console.log(`🔍 Finding bugs with priority: ${priority}`);
  return this.find({ priority });
};

/**
 * Pre-save middleware for additional validation
 * Logs important changes for debugging
 */
bugSchema.pre('save', function(next) {
  console.log(`💾 Saving bug: ${this.title}`);
  console.log(`📊 Bug details:`, {
    id: this._id,
    title: this.title,
    priority: this.priority,
    status: this.status,
    reporter: this.reportedBy
  });
  next();
});

module.exports = mongoose.model('Bug', bugSchema); 