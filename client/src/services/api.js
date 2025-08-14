import axios from 'axios';

/**
 * API Service Layer
 * Centralized HTTP client for making requests to the backend
 * Includes error handling, request/response logging, and debugging
 */

// Create axios instance with default configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      params: config.params,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);

/**
 * Bug API methods
 * All CRUD operations for bugs with proper error handling
 */

export const bugAPI = {
  /**
   * Get all bugs with optional filtering
   * @param {Object} params - Query parameters for filtering and sorting
   * @returns {Promise<Array>} Array of bugs
   */
  getAllBugs: async (params = {}) => {
    try {
      console.log('🔍 Fetching all bugs with params:', params);
      const response = await api.get('/bugs', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching bugs:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bugs');
    }
  },

  /**
   * Get a single bug by ID
   * @param {string} id - Bug ID
   * @returns {Promise<Object>} Bug object
   */
  getBugById: async (id) => {
    try {
      console.log('🔍 Fetching bug by ID:', id);
      const response = await api.get(`/bugs/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching bug:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch bug');
    }
  },

  /**
   * Create a new bug
   * @param {Object} bugData - Bug data
   * @returns {Promise<Object>} Created bug object
   */
  createBug: async (bugData) => {
    try {
      console.log('🐛 Creating new bug:', bugData);
      const response = await api.post('/bugs', bugData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating bug:', error);
      throw new Error(error.response?.data?.message || 'Failed to create bug');
    }
  },

  /**
   * Create a bug from customer feedback
   * @param {Object} feedbackData - { title, description, customerName, customerEmail, customerId, priority }
   */
  createFeedback: async (feedbackData) => {
    try {
      console.log('📣 Creating feedback bug:', feedbackData);
      const response = await api.post('/bugs/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating feedback bug:', error);
      throw new Error(error.response?.data?.message || 'Failed to create feedback bug');
    }
  },

  /**
   * Update an existing bug
   * @param {string} id - Bug ID
   * @param {Object} bugData - Updated bug data
   * @returns {Promise<Object>} Updated bug object
   */
  updateBug: async (id, bugData) => {
    try {
      console.log('🔄 Updating bug:', id, bugData);
      const response = await api.put(`/bugs/${id}`, bugData);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating bug:', error);
      throw new Error(error.response?.data?.message || 'Failed to update bug');
    }
  },

  /**
   * Delete a bug
   * @param {string} id - Bug ID
   * @returns {Promise<Object>} Deletion confirmation
   */
  deleteBug: async (id) => {
    try {
      console.log('🗑️ Deleting bug:', id);
      const response = await api.delete(`/bugs/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting bug:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete bug');
    }
  },

  /**
   * Update bug status
   * @param {string} id - Bug ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated bug object
   */
  updateBugStatus: async (id, status) => {
    try {
      console.log('🔄 Updating bug status:', id, status);
      const response = await api.patch(`/bugs/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('❌ Error updating bug status:', error);
      throw new Error(error.response?.data?.message || 'Failed to update bug status');
    }
  },

  /**
   * Add a comment to a bug
   * @param {string} id - Bug ID
   * @param {Object} comment - { author, message }
   */
  addComment: async (id, comment) => {
    try {
      console.log('💬 Adding comment:', id, comment);
      const response = await api.post(`/bugs/${id}/comments`, comment);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      throw new Error(error.response?.data?.message || 'Failed to add comment');
    }
  },
};

/**
 * Utility function to handle API errors consistently
 * @param {Error} error - Error object
 * @returns {string} User-friendly error message
 */
export const handleAPIError = (error) => {
  console.error('🔧 Handling API error:', error);
  
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Invalid request data';
      case 401:
        return 'Unauthorized access';
      case 403:
        return 'Access forbidden';
      case 404:
        return 'Resource not found';
      case 500:
        return 'Server error occurred';
      default:
        return data.message || 'An error occurred';
    }
  } else if (error.request) {
    // Network error
    return 'Network error - please check your connection';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred';
  }
};

export default api; 