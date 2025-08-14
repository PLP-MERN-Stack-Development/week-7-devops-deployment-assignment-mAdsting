import React, { useState } from 'react';
import { bugAPI, handleAPIError } from '../services/api';

/**
 * BugForm Component
 * Form for creating new bugs with validation and error handling
 * Includes debugging features and user feedback
 */
const BugForm = ({ onBugCreated, onCancel }) => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    reportedBy: '',
    assignedTo: '',
    source: 'internal', // 'internal' | 'customer'
    customerName: '',
    customerEmail: '',
    customerId: ''
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Handle input changes
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    console.log('📝 Form input changed:', { name, value });
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form data
   * @returns {boolean} True if valid, false otherwise
   */
  const validateForm = () => {
    console.log('🔍 Validating form data:', formData);
    
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }

    // Priority validation
    if (!['Low', 'Medium', 'High'].includes(formData.priority)) {
      newErrors.priority = 'Invalid priority value';
    }

    // Reporter validation
    if (!formData.reportedBy.trim()) {
      newErrors.reportedBy = 'Reporter name is required';
    } else if (formData.reportedBy.trim().length > 50) {
      newErrors.reportedBy = 'Reporter name cannot exceed 50 characters';
    }

    // Customer validation when source is customer
    if (formData.source === 'customer') {
      if (!formData.customerName.trim()) {
        newErrors.customerName = 'Customer name is required for customer-reported bugs';
      }
      if (formData.customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
        newErrors.customerEmail = 'Invalid email address';
      }
    }

    console.log('🔍 Validation errors:', newErrors);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Submitting bug form...');
    console.log('📋 Form data:', formData);

    // Validate form
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      // Shape payload for API
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        reportedBy: formData.reportedBy,
        assignedTo: formData.assignedTo || undefined,
        source: formData.source,
        customer:
          formData.source === 'customer'
            ? {
                name: formData.customerName,
                email: formData.customerEmail || undefined,
                id: formData.customerId || undefined,
              }
            : undefined,
      };

      // Create new bug via API
      const response = await bugAPI.createBug(payload);
      
      console.log('✅ Bug created successfully:', response);
      
      setSuccessMessage('Bug created successfully! 🎉');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        reportedBy: '',
        assignedTo: '',
        source: 'internal',
        customerName: '',
        customerEmail: '',
        customerId: ''
      });

      // Notify parent component
      if (onBugCreated) {
        onBugCreated(response.data);
      }

      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('❌ Error creating bug:', error);
      
      const errorMessage = handleAPIError(error);
      setErrors({ submit: errorMessage });
      
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle form reset
   */
  const handleReset = () => {
    console.log('🔄 Resetting form...');
    
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        reportedBy: '',
        assignedTo: '',
        source: 'internal',
        customerName: '',
        customerEmail: '',
        customerId: ''
      });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="bug-form-container">
      <div className="form-header">
        <h2>🐛 Report New Bug</h2>
        <p>Fill out the form below to report a new bug</p>
      </div>

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bug-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Bug Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`form-input ${errors.title ? 'error' : ''}`}
            placeholder="Enter a descriptive title for the bug"
            maxLength={100}
            disabled={isSubmitting}
          />
          {errors.title && (
            <span className="error-text">{errors.title}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className={`form-textarea ${errors.description ? 'error' : ''}`}
            placeholder="Describe the bug in detail..."
            rows={4}
            maxLength={1000}
            disabled={isSubmitting}
          />
          {errors.description && (
            <span className="error-text">{errors.description}</span>
          )}
          <div className="char-count">
            {formData.description.length}/1000 characters
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority *
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className={`form-select ${errors.priority ? 'error' : ''}`}
              disabled={isSubmitting}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            {errors.priority && (
              <span className="error-text">{errors.priority}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="reportedBy" className="form-label">
              Reported By *
            </label>
            <input
              type="text"
              id="reportedBy"
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleInputChange}
              className={`form-input ${errors.reportedBy ? 'error' : ''}`}
              placeholder="Your name"
              maxLength={50}
              disabled={isSubmitting}
            />
            {errors.reportedBy && (
              <span className="error-text">{errors.reportedBy}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="assignedTo" className="form-label">
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Assignee name or email"
              maxLength={100}
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Source *</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="source"
                  value="internal"
                  checked={formData.source === 'internal'}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                Internal
              </label>
              <label>
                <input
                  type="radio"
                  name="source"
                  value="customer"
                  checked={formData.source === 'customer'}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                Customer
              </label>
            </div>
          </div>
        </div>

        {formData.source === 'customer' && (
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customerName" className="form-label">
                Customer Name *
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                className={`form-input ${errors.customerName ? 'error' : ''}`}
                placeholder="Customer name"
                maxLength={100}
                disabled={isSubmitting}
              />
              {errors.customerName && (
                <span className="error-text">{errors.customerName}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="customerEmail" className="form-label">
                Customer Email
              </label>
              <input
                type="email"
                id="customerEmail"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                className={`form-input ${errors.customerEmail ? 'error' : ''}`}
                placeholder="customer@example.com"
                maxLength={100}
                disabled={isSubmitting}
              />
              {errors.customerEmail && (
                <span className="error-text">{errors.customerEmail}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="customerId" className="form-label">
                Customer ID
              </label>
              <input
                type="text"
                id="customerId"
                name="customerId"
                value={formData.customerId}
                onChange={handleInputChange}
                className="form-input"
                placeholder="CRM/Account ID"
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? '🔄 Creating...' : '🐛 Create Bug'}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="reset-button"
            disabled={isSubmitting}
          >
            🔄 Reset
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
              disabled={isSubmitting}
            >
              ❌ Cancel
            </button>
          )}
        </div>
      </form>

      <style>{`
        .bug-form-container {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: 0 auto;
        }

        .form-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .form-header h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .form-header p {
          color: #718096;
          margin: 0;
        }

        .success-message {
          background: #c6f6d5;
          color: #22543d;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 600;
        }

        .error-message {
          background: #fed7d7;
          color: #742a2a;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          text-align: center;
          font-weight: 600;
        }

        .bug-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-textarea,
        .form-select {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
        }

        .form-input:focus,
        .form-textarea:focus,
        .form-select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
        }

        .form-input.error,
        .form-textarea.error,
        .form-select.error {
          border-color: #e53e3e;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .error-text {
          color: #e53e3e;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .char-count {
          color: #718096;
          font-size: 0.875rem;
          text-align: right;
          margin-top: 0.25rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 1rem;
        }

        .submit-button,
        .reset-button,
        .cancel-button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 120px;
        }

        .submit-button {
          background: #4299e1;
          color: white;
        }

        .submit-button:hover:not(:disabled) {
          background: #3182ce;
          transform: translateY(-2px);
        }

        .reset-button {
          background: #edf2f7;
          color: #4a5568;
        }

        .reset-button:hover:not(:disabled) {
          background: #e2e8f0;
          transform: translateY(-2px);
        }

        .cancel-button {
          background: #fed7d7;
          color: #742a2a;
        }

        .cancel-button:hover:not(:disabled) {
          background: #feb2b2;
          transform: translateY(-2px);
        }

        .submit-button:disabled,
        .reset-button:disabled,
        .cancel-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .bug-form-container {
            padding: 1.5rem;
            margin: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .submit-button,
          .reset-button,
          .cancel-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BugForm; 