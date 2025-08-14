const express = require('express');
const Bug = require('../models/Bug');
const axios = require('axios');

const router = express.Router();

/**
 * POST /api/bugs - Create a new bug
 * Creates a new bug entry in the database
 */
router.post('/', async (req, res, next) => {
  try {
    console.log('🐛 Creating new bug...');
    console.log('📝 Request body:', req.body);
    
    const { title, description, priority, reportedBy, assignedTo, source, customer } = req.body;
    
    // Validate required fields
    if (!title || !description || !reportedBy) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Title, description, and reportedBy are required fields'
      });
    }
    
    // Create new bug
    const newBug = new Bug({
      title,
      description,
      priority: priority || 'Medium',
      reportedBy,
      assignedTo: assignedTo || '',
      source: source || 'internal',
      customer: source === 'customer' ? (customer || {}) : undefined
    });
    
    const savedBug = await newBug.save();
    
    console.log('✅ Bug created successfully:', savedBug._id);
    
    // Send Slack notification if configured
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
          text: `🐛 New Bug: *${savedBug.title}*\nPriority: ${savedBug.priority}\nReported by: ${savedBug.reportedBy}\nSource: ${savedBug.source}${savedBug.assignedTo ? `\nAssigned to: ${savedBug.assignedTo}` : ''}`
        });
      } catch (notifyErr) {
        console.error('⚠️ Slack notification failed:', notifyErr.message);
      }
    }

    res.status(201).json({
      success: true,
      data: savedBug,
      message: 'Bug created successfully'
    });
    
  } catch (error) {
    console.error('❌ Error creating bug:', error.message);
    next(error);
  }
});

/**
 * GET /api/bugs - Get all bugs
 * Retrieves all bugs with optional filtering and sorting
 */
router.get('/', async (req, res, next) => {
  try {
    console.log('🔍 Fetching all bugs...');
    console.log('📋 Query parameters:', req.query);
    
    const { status, priority, sortBy = 'createdAt', order = 'desc' } = req.query;
    
    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // Build sort object
    const sort = {};
    sort[sortBy] = order === 'desc' ? -1 : 1;
    
    console.log('🔧 Filter:', filter);
    console.log('📊 Sort:', sort);
    
    const bugs = await Bug.find(filter).sort(sort);
    
    console.log(`✅ Found ${bugs.length} bugs`);
    
    res.json({
      success: true,
      count: bugs.length,
      data: bugs
    });
    
  } catch (error) {
    console.error('❌ Error fetching bugs:', error.message);
    next(error);
  }
});

/**
 * GET /api/bugs/:id - Get a specific bug by ID
 * Retrieves a single bug by its MongoDB ObjectId
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log(`🔍 Fetching bug with ID: ${id}`);
    
    const bug = await Bug.findById(id);
    
    if (!bug) {
      console.log('❌ Bug not found');
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    console.log('✅ Bug found:', bug.title);
    
    res.json({
      success: true,
      data: bug
    });
    
  } catch (error) {
    console.error('❌ Error fetching bug:', error.message);
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid bug ID format'
      });
    }
    
    next(error);
  }
});

/**
 * PUT /api/bugs/:id - Update a bug
 * Updates an existing bug with new data
 */
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`🔄 Updating bug with ID: ${id}`);
    console.log('📝 Update data:', updateData);
    
    // If status is changing, add statusHistory entry
    const existing = await Bug.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Bug not found' });
    }

    if (updateData.status && updateData.status !== existing.status) {
      existing.statusHistory.push({ from: existing.status, to: updateData.status, by: updateData.updatedBy || 'system' });
      existing.set(updateData);
      const saved = await existing.save();
      console.log('✅ Bug updated with status history');
      return res.json({ success: true, data: saved, message: 'Bug updated successfully' });
    }

    // Use validators when updating to enforce schema rules
    const updatedBug = await Bug.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedBug) {
      console.log('❌ Bug not found for update');
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    console.log('✅ Bug updated successfully:', updatedBug.title);
    
    res.json({
      success: true,
      data: updatedBug,
      message: 'Bug updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating bug:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid bug ID format'
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    next(error);
  }
});

/**
 * DELETE /api/bugs/:id - Delete a bug
 * Removes a bug from the database
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Deleting bug with ID: ${id}`);
    
    const deletedBug = await Bug.findByIdAndDelete(id);
    
    if (!deletedBug) {
      console.log('❌ Bug not found for deletion');
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    console.log('✅ Bug deleted successfully:', deletedBug.title);
    
    res.json({
      success: true,
      data: deletedBug,
      message: 'Bug deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Error deleting bug:', error.message);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid bug ID format'
      });
    }
    
    next(error);
  }
});

/**
 * PATCH /api/bugs/:id/status - Update bug status specifically
 * Convenience endpoint for updating just the status
 */
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason, by } = req.body;
    
    console.log(`🔄 Updating status for bug ${id} to ${status}`);
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    const bug = await Bug.findById(id);
    
    if (!bug) {
      return res.status(404).json({
        success: false,
        message: 'Bug not found'
      });
    }
    
    // Use the instance method for status update and push history with reason/by
    const previousStatus = bug.status;
    await bug.updateStatus(status);
    bug.statusHistory.push({ from: previousStatus, to: status, by: by || 'system', reason });
    await bug.save();
    
    console.log('✅ Bug status updated successfully');
    
    res.json({
      success: true,
      data: bug,
      message: 'Bug status updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Error updating bug status:', error.message);
    next(error);
  }
});

/**
 * POST /api/bugs/:id/comments - Add a comment to a bug
 */
router.post('/:id/comments', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { author, message } = req.body;

    if (!author || !message) {
      return res.status(400).json({ success: false, message: 'author and message are required' });
    }

    const bug = await Bug.findById(id);
    if (!bug) {
      return res.status(404).json({ success: false, message: 'Bug not found' });
    }

    await bug.addComment(author, message);
    res.status(201).json({ success: true, data: bug.comments[bug.comments.length - 1], message: 'Comment added' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/feedback - Create a bug from customer feedback
 * Treat customer feedback as a bug with source=customer
 */
router.post('/feedback', async (req, res, next) => {
  try {
    const { title, description, customerName, customerEmail, customerId, priority } = req.body;

    if (!title || !description || !customerName) {
      return res.status(400).json({ success: false, message: 'title, description, and customerName are required' });
    }

    const bug = new Bug({
      title,
      description,
      priority: priority || 'Medium',
      reportedBy: customerName,
      source: 'customer',
      customer: { name: customerName, email: customerEmail, id: customerId }
    });

    const saved = await bug.save();

    // Slack notification
    if (process.env.SLACK_WEBHOOK_URL) {
      try {
        await axios.post(process.env.SLACK_WEBHOOK_URL, {
          text: `📣 Customer Feedback → Bug\n*${saved.title}*\nPriority: ${saved.priority}\nCustomer: ${customerName} (${customerEmail || 'n/a'})`
        });
      } catch (err) {
        console.error('⚠️ Slack notification failed:', err.message);
      }
    }

    res.status(201).json({ success: true, data: saved, message: 'Feedback captured as bug' });
  } catch (error) {
    next(error);
  }
});

module.exports = router; 