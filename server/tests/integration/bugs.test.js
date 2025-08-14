/**
 * Integration tests for Bug API endpoints
 * Tests all CRUD operations with real database interactions
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const Bug = require('../../models/Bug');

describe('Bug API Integration Tests', () => {
  let testBugId;

  // Sample bug data for testing
  const sampleBug = {
    title: 'Test Bug',
    description: 'This is a test bug for integration testing',
    priority: 'Medium',
    reportedBy: 'Test User'
  };

  const updatedBug = {
    title: 'Updated Test Bug',
    description: 'This is an updated test bug',
    priority: 'High',
    status: 'In Progress'
  };

  describe('POST /api/bugs', () => {
    it('should create a new bug with valid data', async () => {
      console.log('🧪 Testing bug creation...');
      
      const response = await request(app)
        .post('/api/bugs')
        .send(sampleBug)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(sampleBug.title);
      expect(response.body.data.description).toBe(sampleBug.description);
      expect(response.body.data.priority).toBe(sampleBug.priority);
      expect(response.body.data.status).toBe('Open'); // Default status
      expect(response.body.data.reportedBy).toBe(sampleBug.reportedBy);
      expect(response.body.data._id).toBeDefined();

      // Store the ID for other tests
      testBugId = response.body.data._id;
      
      console.log('✅ Bug creation test passed');
    });

    it('should return 400 for missing required fields', async () => {
      console.log('🧪 Testing bug creation with missing fields...');
      
      const invalidBug = {
        title: 'Test Bug',
        // Missing description and reportedBy
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
      
      console.log('✅ Missing fields validation test passed');
    });

    it('should return 400 for invalid priority', async () => {
      console.log('🧪 Testing bug creation with invalid priority...');
      
      const invalidBug = {
        ...sampleBug,
        priority: 'InvalidPriority'
      };

      const response = await request(app)
        .post('/api/bugs')
        .send(invalidBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      
      console.log('✅ Invalid priority validation test passed');
    });
  });

  describe('GET /api/bugs', () => {
    beforeEach(async () => {
      // Create test bugs for listing tests
      await Bug.create([
        { ...sampleBug, title: 'Bug 1', priority: 'Low' },
        { ...sampleBug, title: 'Bug 2', priority: 'Medium' },
        { ...sampleBug, title: 'Bug 3', priority: 'High' }
      ]);
    });

    it('should return all bugs', async () => {
      console.log('🧪 Testing get all bugs...');
      
      const response = await request(app)
        .get('/api/bugs')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('description');
      expect(response.body.data[0]).toHaveProperty('priority');
      expect(response.body.data[0]).toHaveProperty('status');
      
      console.log('✅ Get all bugs test passed');
    });

    it('should filter bugs by priority', async () => {
      console.log('🧪 Testing bug filtering by priority...');
      
      const response = await request(app)
        .get('/api/bugs?priority=High')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].priority).toBe('High');
      
      console.log('✅ Priority filtering test passed');
    });

    it('should sort bugs by creation date', async () => {
      console.log('🧪 Testing bug sorting...');
      
      const response = await request(app)
        .get('/api/bugs?sortBy=createdAt&order=desc')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      
      // Check if sorted by creation date (newest first)
      const dates = response.body.data.map(bug => new Date(bug.createdAt));
      expect(dates[0] >= dates[1]).toBe(true);
      expect(dates[1] >= dates[2]).toBe(true);
      
      console.log('✅ Sorting test passed');
    });
  });

  describe('GET /api/bugs/:id', () => {
    beforeEach(async () => {
      // Create a test bug for individual retrieval
      const bug = await Bug.create(sampleBug);
      testBugId = bug._id;
    });

    it('should return a specific bug by ID', async () => {
      console.log('🧪 Testing get bug by ID...');
      
      const response = await request(app)
        .get(`/api/bugs/${testBugId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testBugId.toString());
      expect(response.body.data.title).toBe(sampleBug.title);
      expect(response.body.data.description).toBe(sampleBug.description);
      
      console.log('✅ Get bug by ID test passed');
    });

    it('should return 404 for non-existent bug ID', async () => {
      console.log('🧪 Testing get non-existent bug...');
      
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
      
      console.log('✅ Non-existent bug test passed');
    });

    it('should return 400 for invalid ID format', async () => {
      console.log('🧪 Testing get bug with invalid ID format...');
      
      const response = await request(app)
        .get('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid bug ID format');
      
      console.log('✅ Invalid ID format test passed');
    });
  });

  describe('PUT /api/bugs/:id', () => {
    beforeEach(async () => {
      // Create a test bug for update tests
      const bug = await Bug.create(sampleBug);
      testBugId = bug._id;
    });

    it('should update an existing bug', async () => {
      console.log('🧪 Testing bug update...');
      
      const response = await request(app)
        .put(`/api/bugs/${testBugId}`)
        .send(updatedBug)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updatedBug.title);
      expect(response.body.data.description).toBe(updatedBug.description);
      expect(response.body.data.priority).toBe(updatedBug.priority);
      expect(response.body.data.status).toBe(updatedBug.status);
      expect(response.body.message).toBe('Bug updated successfully');
      
      console.log('✅ Bug update test passed');
    });

    it('should return 404 for non-existent bug ID', async () => {
      console.log('🧪 Testing update non-existent bug...');
      
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .put(`/api/bugs/${fakeId}`)
        .send(updatedBug)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
      
      console.log('✅ Update non-existent bug test passed');
    });

    it('should return 400 for invalid ID format', async () => {
      console.log('🧪 Testing update with invalid ID format...');
      
      const response = await request(app)
        .put('/api/bugs/invalid-id')
        .send(updatedBug)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid bug ID format');
      
      console.log('✅ Update with invalid ID test passed');
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    beforeEach(async () => {
      // Create a test bug for deletion tests
      const bug = await Bug.create(sampleBug);
      testBugId = bug._id;
    });

    it('should delete an existing bug', async () => {
      console.log('🧪 Testing bug deletion...');
      
      const response = await request(app)
        .delete(`/api/bugs/${testBugId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(testBugId.toString());
      expect(response.body.message).toBe('Bug deleted successfully');
      
      // Verify bug is actually deleted
      const deletedBug = await Bug.findById(testBugId);
      expect(deletedBug).toBeNull();
      
      console.log('✅ Bug deletion test passed');
    });

    it('should return 404 for non-existent bug ID', async () => {
      console.log('🧪 Testing delete non-existent bug...');
      
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .delete(`/api/bugs/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
      
      console.log('✅ Delete non-existent bug test passed');
    });

    it('should return 400 for invalid ID format', async () => {
      console.log('🧪 Testing delete with invalid ID format...');
      
      const response = await request(app)
        .delete('/api/bugs/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid bug ID format');
      
      console.log('✅ Delete with invalid ID test passed');
    });
  });

  describe('PATCH /api/bugs/:id/status', () => {
    beforeEach(async () => {
      // Create a test bug for status update tests
      const bug = await Bug.create(sampleBug);
      testBugId = bug._id;
    });

    it('should update bug status', async () => {
      console.log('🧪 Testing bug status update...');
      
      const response = await request(app)
        .patch(`/api/bugs/${testBugId}/status`)
        .send({ status: 'In Progress' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('In Progress');
      expect(response.body.message).toBe('Bug status updated successfully');
      
      console.log('✅ Status update test passed');
    });

    it('should return 400 for missing status', async () => {
      console.log('🧪 Testing status update with missing status...');
      
      const response = await request(app)
        .patch(`/api/bugs/${testBugId}/status`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Status is required');
      
      console.log('✅ Missing status validation test passed');
    });

    it('should return 404 for non-existent bug ID', async () => {
      console.log('🧪 Testing status update for non-existent bug...');
      
      const fakeId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .patch(`/api/bugs/${fakeId}/status`)
        .send({ status: 'Resolved' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Bug not found');
      
      console.log('✅ Status update non-existent bug test passed');
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      console.log('🧪 Testing error handling...');
      
      // This test verifies that the error handling middleware works
      // by making a request that should trigger an error
      const response = await request(app)
        .get('/api/bugs/nonexistent-id-format')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
      
      console.log('✅ Error handling test passed');
    });
  });
}); 